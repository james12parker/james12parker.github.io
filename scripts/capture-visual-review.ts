import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";

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

    const desktopEnglish = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      colorScheme: "light",
      reducedMotion: "reduce",
      locale: "en-US",
    });
    const mobileEnglish = await browser.newContext({
      viewport: { width: 390, height: 844 },
      colorScheme: "light",
      reducedMotion: "reduce",
      locale: "en-US",
      isMobile: true,
      hasTouch: true,
    });
    await desktopEnglish.addInitScript(() =>
      localStorage.setItem("hoyang-language", "en"),
    );
    await mobileEnglish.addInitScript(() =>
      localStorage.setItem("hoyang-language", "en"),
    );

    await captureDesktop(desktop);
    await captureMobile(mobile);
    await captureLocalizedHome(
      desktopEnglish,
      "desktop",
      "19-home-en-desktop.png",
    );
    await captureLocalizedHome(
      mobileEnglish,
      "mobile",
      "20-home-en-mobile.png",
    );
    await captureHomepageSections(desktop);
    await captureCatalogUpdates(desktop);
    await captureRequestedChecks(browser);
    await desktop.close();
    await mobile.close();
    await desktopEnglish.close();
    await mobileEnglish.close();
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
    console.log(`capture: ${path}`);
    await visit(page, path);
    await screenshot(page, filename, "desktop", fullPage);
  }

  await visit(page, "/");
  await page.getByRole("button", { name: /^제품/ }).first().click();
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

  await visit(page, "/products/saco-towel-bar");
  await page
    .getByRole("group", { name: "마감 선택" })
    .getByRole("button", { name: "마감: 크롬" })
    .click();
  await page
    .locator('img[alt*="사코 수건걸이 크롬"]')
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

async function captureLocalizedHome(
  context: BrowserContext,
  viewport: "desktop" | "mobile",
  filename: string,
) {
  const page = await preparedPage(context, viewport);
  await visit(page, "/");
  await page.locator('html[lang="en"]').waitFor();
  await page.getByRole("heading", { name: "Browse by category" }).waitFor();
  await screenshot(page, filename, viewport, true, "English homepage");
  await page.close();
}

async function captureHomepageSections(context: BrowserContext) {
  const page = await preparedPage(context, "desktop");
  await visit(page, "/");
  const sections = [
    ["21-coordinated-towel-bars-desktop.png", "하나의 공간으로 이어지는 구성"],
    ["22-category-navigation-desktop.png", "Browse by category"],
  ] as const;
  for (const [filename, heading] of sections) {
    const section = page
      .locator("section")
      .filter({ hasText: heading })
      .first();
    await section.screenshot({
      path: resolve(screenshotDirectory, filename),
      animations: "disabled",
    });
    captures.push({
      filename,
      path: `docs/screenshots/${filename}`,
      viewport: "desktop",
      fullPage: false,
      state: heading,
    });
  }
  await page.close();
}
async function captureCatalogUpdates(context: BrowserContext) {
  const page = await preparedPage(context, "desktop");
  await visit(page, "/");
  const hero = page.locator("main > section").first();
  await hero.screenshot({
    path: resolve(screenshotDirectory, "23-hero-branding-desktop.png"),
    animations: "disabled",
  });
  captures.push({
    filename: "23-hero-branding-desktop.png",
    path: "docs/screenshots/23-hero-branding-desktop.png",
    viewport: "desktop",
    fullPage: false,
    state: "larger logo, EssentialBathroomStorage, reduced Korean heading",
  });

  await visit(page, "/products");
  for (const [filename, text] of [
    ["24-hg822c-card-desktop.png", "HG822C 이단수건선반"],
    ["25-hg822s-card-desktop.png", "HG822S 이단수건선반"],
    ["26-belair-paper-holder-chrome.png", "벨레어 휴지걸이"],
    ["27-brio-paper-holder-chrome.png", "브리오 휴지걸이"],
  ] as const) {
    const card = page.locator("article").filter({ hasText: text }).first();
    await card.scrollIntoViewIfNeeded();
    await card.screenshot({
      path: resolve(screenshotDirectory, filename),
      animations: "disabled",
    });
    captures.push({
      filename,
      path: "docs/screenshots/" + filename,
      viewport: "desktop",
      fullPage: false,
      state: text,
    });
  }
  await page.close();
}

async function captureRequestedChecks(browser: Browser) {
  for (const width of [375, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 375 ? 812 : 1000 },
      colorScheme: "light",
      reducedMotion: "reduce",
      locale: "ko-KR",
      isMobile: width === 375,
      hasTouch: width === 375,
    });
    const page = await preparedPage(
      context,
      width === 375 ? "mobile" : "desktop",
    );
    await visit(page, "/");
    const hero = page.locator("main > section").first();
    const filename = `28-hero-${width}.png`;
    await hero.screenshot({
      path: resolve(screenshotDirectory, filename),
      animations: "disabled",
    });
    captures.push({
      filename,
      path: `docs/screenshots/${filename}`,
      viewport: width === 375 ? "mobile" : "desktop",
      fullPage: false,
      state: `Homepage hero and EssentialBathroomStorage at ${width}px`,
    });
    await page.close();
    await context.close();
  }

  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "light",
    reducedMotion: "reduce",
    locale: "ko-KR",
  });
  const page = await preparedPage(desktop, "desktop");
  await visit(page, "/");
  const heroStatement = page.locator('[aria-label="EssentialBathroomStorage"]');
  await heroStatement.screenshot({
    path: resolve(screenshotDirectory, "40-essential-storage-closeup.png"),
    animations: "disabled",
  });
  captures.push({
    filename: "40-essential-storage-closeup.png",
    path: "docs/screenshots/40-essential-storage-closeup.png",
    viewport: "desktop",
    fullPage: false,
    state: "EssentialBathroomStorage close-up",
  });

  const categorySection = page
    .locator("section")
    .filter({ hasText: "Browse by category" })
    .first();
  await categorySection.screenshot({
    path: resolve(screenshotDirectory, "32-category-section-normal.png"),
    animations: "disabled",
  });
  captures.push({
    filename: "32-category-section-normal.png",
    path: "docs/screenshots/32-category-section-normal.png",
    viewport: "desktop",
    fullPage: false,
    state: "Category cards, normal state",
  });
  const categoryCard = categorySection.locator("a").first();
  await categoryCard.hover();
  await categoryCard.screenshot({
    path: resolve(screenshotDirectory, "33-category-card-hover.png"),
    animations: "disabled",
  });
  captures.push({
    filename: "33-category-card-hover.png",
    path: "docs/screenshots/33-category-card-hover.png",
    viewport: "desktop",
    fullPage: false,
    state: "Category card, hover state",
  });
  await categoryCard.locator("img").screenshot({
    path: resolve(screenshotDirectory, "34-category-image-edge.png"),
    animations: "disabled",
  });
  captures.push({
    filename: "34-category-image-edge.png",
    path: "docs/screenshots/34-category-image-edge.png",
    viewport: "desktop",
    fullPage: false,
    state: "Close category image edge",
  });

  await visit(page, "/products?category=towel-bars");
  await screenshot(
    page,
    "35-towel-bar-order.png",
    "desktop",
    true,
    "Requested towel-bar and towel-shelf order",
  );

  await visit(page, "/products?collection=batuta");
  const battutaCard = page
    .locator("article")
    .filter({ hasText: "바투타 수건걸이" })
    .first();
  await battutaCard.screenshot({
    path: resolve(screenshotDirectory, "41-battuta-towel-bar-card.png"),
    animations: "disabled",
  });
  captures.push({
    filename: "41-battuta-towel-bar-card.png",
    path: "docs/screenshots/41-battuta-towel-bar-card.png",
    viewport: "desktop",
    fullPage: false,
    state: "바투타 수건걸이 사틴 product card",
  });

  await visit(page, "/products/batuta-towel-bar");
  await screenshot(
    page,
    "42-battuta-towel-bar-detail.png",
    "desktop",
    true,
    "바투타 수건걸이 사틴 product detail",
  );

  await visit(page, "/products?collection=hg-series");
  for (const [filename, productName] of [
    ["43-hg100ms-clean-image.png", "HG100MS 코너선반"],
    ["44-hg110-1-clean-image.png", "HG110-1 매립휴지걸이"],
  ] as const) {
    const card = page
      .locator("article")
      .filter({ hasText: productName })
      .first();
    await card.scrollIntoViewIfNeeded();
    await card.screenshot({
      path: resolve(screenshotDirectory, filename),
      animations: "disabled",
    });
    captures.push({
      filename,
      path: `docs/screenshots/${filename}`,
      viewport: "desktop",
      fullPage: false,
      state: `${productName} without embedded model label`,
    });
  }

  await page.addInitScript(() => localStorage.setItem("hoyang-language", "en"));
  for (const [filename, path, state] of [
    ["36-battuta-collections.png", "/collections", "battuta collection card"],
    [
      "37-battuta-detail.png",
      "/collections/batuta",
      "battuta collection heading",
    ],
    [
      "38-battuta-products.png",
      "/products?collection=batuta",
      "battuta product and filter labels",
    ],
  ] as const) {
    await visit(page, path);
    await page.locator('html[lang="en"]').waitFor();
    await screenshot(page, filename, "desktop", true, state);
  }
  await page.close();
  await desktop.close();

  const mobile = await browser.newContext({
    viewport: { width: 375, height: 812 },
    colorScheme: "light",
    reducedMotion: "reduce",
    locale: "en-US",
    isMobile: true,
    hasTouch: true,
  });
  await mobile.addInitScript(() =>
    localStorage.setItem("hoyang-language", "en"),
  );
  const mobilePage = await preparedPage(mobile, "mobile");
  await visit(mobilePage, "/");
  await mobilePage.getByRole("button", { name: "Open menu" }).click();
  await screenshot(
    mobilePage,
    "39-mobile-logo-navigation-battuta.png",
    "mobile",
    false,
    "HOYANG25 mobile navigation and battuta label",
  );
  await mobilePage.close();
  await mobile.close();
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
  await page.locator("main").waitFor({ state: "attached" });
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
