import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, type BrowserContext, type Page } from "playwright";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const screenshotDirectory = resolve(projectRoot, "docs/screenshots");
const baseUrl = process.env.REVIEW_BASE_URL ?? "http://127.0.0.1:3100";
const consoleErrors: string[] = [];
const failedRequests: string[] = [];

type Capture = {
  filename: string;
  path: string;
  viewport: "desktop" | "mobile";
  fullPage: boolean;
  state?: string;
};

const captures: Capture[] = [];

async function main() {
  await mkdir(screenshotDirectory, { recursive: true });
  const browser = await chromium.launch();

  try {
    const desktop = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      colorScheme: "light",
      reducedMotion: "reduce",
      locale: "ko-KR",
    });
    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      colorScheme: "light",
      reducedMotion: "reduce",
      locale: "ko-KR",
      isMobile: true,
      hasTouch: true,
    });

    await captureDesktop(desktop);
    await captureMobile(mobile);
    await desktop.close();
    await mobile.close();
  } finally {
    await browser.close();
  }

  const result = {
    baseUrl,
    generatedAt: new Date().toISOString(),
    viewportSizes: {
      desktop: { width: 1440, height: 1000 },
      mobile: { width: 390, height: 844 },
    },
    captures,
    consoleErrors,
    failedRequests,
  };
  await writeFile(
    resolve(screenshotDirectory, "visual-review-results.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );

  console.log(`screenshots: ${captures.length}`);
  console.log(`console errors: ${consoleErrors.length}`);
  console.log(`failed requests: ${failedRequests.length}`);
  if (consoleErrors.length > 0 || failedRequests.length > 0) {
    process.exitCode = 1;
  }
}

async function captureDesktop(context: BrowserContext) {
  const page = await preparedPage(context, "desktop");
  const routes = [
    ["01-home-desktop.png", "/", true],
    ["02-products-desktop.png", "/products", true],
    ["03-collection-concord-desktop.png", "/collections/concord", true],
    ["04-hg-products-desktop.png", "/products?collection=hg-series", true],
    ["05-towel-bar-desktop.png", "/products/concord-towel-bar", true],
    [
      "06-paper-holder-desktop.png",
      "/products/belair-toilet-paper-holder",
      true,
    ],
    [
      "07-recessed-holder-desktop.png",
      "/products/hg110-1-recessed-holder",
      true,
    ],
    ["08-about-desktop.png", "/about", true],
    ["09-support-desktop.png", "/support", true],
    ["10-contact-desktop.png", "/contact", true],
  ] as const;

  for (const [filename, path, fullPage] of routes) {
    await visit(page, path);
    await screenshot(page, filename, "desktop", fullPage);
  }

  await visit(page, "/");
  await page.locator("summary").filter({ hasText: "제품" }).first().click();
  await screenshot(
    page,
    "11-mega-menu-desktop.png",
    "desktop",
    false,
    "제품 메가 메뉴 열림",
  );

  await visit(page, "/products?category=mirrors&collection=batuta");
  await page.getByText("조건에 맞는 제품이 없습니다.").waitFor();
  await screenshot(
    page,
    "12-empty-filter-desktop.png",
    "desktop",
    false,
    "공유 가능한 빈 필터 결과",
  );

  const response = await visit(page, "/not-a-real-route");
  if (response?.status() !== 404) {
    failedRequests.push(
      `custom 404 returned ${response?.status() ?? "no response"}`,
    );
  }
  await screenshot(page, "13-404-desktop.png", "desktop", false, "custom 404");
  await page.close();
}

async function captureMobile(context: BrowserContext) {
  const page = await preparedPage(context, "mobile");
  await visit(page, "/");
  await screenshot(page, "14-home-mobile.png", "mobile", true);

  await visit(page, "/products");
  await screenshot(page, "15-products-mobile.png", "mobile", true);

  await page.getByRole("button", { name: "메뉴 열기" }).click();
  await screenshot(
    page,
    "16-mobile-navigation.png",
    "mobile",
    false,
    "모바일 메뉴 열림",
  );
  await page.getByRole("button", { name: "메뉴 닫기" }).click();

  await page.getByRole("button", { name: /^필터/ }).click();
  await page.getByRole("dialog", { name: "제품 필터" }).waitFor();
  await screenshot(
    page,
    "17-filter-drawer-mobile.png",
    "mobile",
    false,
    "모바일 필터 드로어 열림",
  );
  await page.getByRole("button", { name: "필터 닫기" }).click();

  await visit(page, "/products/belair-towel-bar");
  await page.getByRole("button", { name: "크롬" }).click();
  await page
    .locator('img[alt*="벨레어 수건걸이 크롬"]')
    .waitFor({ state: "visible" });
  await screenshot(
    page,
    "18-finish-selector-mobile.png",
    "mobile",
    false,
    "크롬 마감 선택",
  );
  await page.close();
}

async function preparedPage(
  context: BrowserContext,
  viewport: "desktop" | "mobile",
) {
  const page = await context.newPage();
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !page.url().includes("/not-a-real-route")
    ) {
      consoleErrors.push(`[${viewport}] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    consoleErrors.push(`[${viewport}] ${error.message}`);
  });
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      !response.url().includes("/not-a-real-route")
    ) {
      failedRequests.push(
        `[${viewport}] ${response.status()} ${response.url()}`,
      );
    }
  });
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation:none!important;transition:none!important}",
  });
  return page;
}

async function visit(page: Page, path: string) {
  const response = await page.goto(`${baseUrl}${path}`, {
    waitUntil: "networkidle",
  });
  await page.locator("main").waitFor();
  return response;
}

async function screenshot(
  page: Page,
  filename: string,
  viewport: "desktop" | "mobile",
  fullPage: boolean,
  state?: string,
) {
  if (fullPage) {
    await loadLazyImages(page);
  }
  await page.screenshot({
    path: resolve(screenshotDirectory, filename),
    fullPage,
    animations: "disabled",
  });
  captures.push({
    filename,
    path: `docs/screenshots/${filename}`,
    viewport,
    fullPage,
    state,
  });
}

async function loadLazyImages(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((done) => {
      let position = 0;
      const step = Math.max(window.innerHeight * 0.8, 500);
      const timer = window.setInterval(() => {
        position += step;
        window.scrollTo(0, position);
        if (position >= document.documentElement.scrollHeight) {
          window.clearInterval(timer);
          done();
        }
      }, 80);
    });
  });
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
}

void main();
