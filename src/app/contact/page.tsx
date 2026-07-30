import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/ui/page-intro";
import { isPlaceholderValue } from "@/config/launch-data";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "문의",
  description: "제품, 대량 구매, 납품과 고객지원 문의 안내입니다.",
  alternates: {
    canonical: "/contact",
  },
};

const inquiryTypes = [
  {
    title: "제품 문의",
    description: "모델과 마감 선택에 필요한 제품 정보를 문의해 주세요.",
  },
  {
    title: "대량 구매 및 납품",
    description: "현장명, 필요 제품, 수량과 일정을 함께 알려주세요.",
  },
  {
    title: "설치 및 A/S",
    description: "제품 모델명과 문의 내용을 확인해 전달해 주세요.",
  },
];

export default function ContactPage() {
  const emailReady = !isPlaceholderValue(siteConfig.email);
  const phoneReady = !isPlaceholderValue(siteConfig.telephone);

  return (
    <>
      <PageIntro
        breadcrumb="문의"
        description="문의 유형과 제품 모델명을 함께 남겨주시면 확인에 도움이 됩니다."
        eyebrow="Contact"
        title="제품과 납품에 대해 문의하세요."
      />

      <section className="page-shell grid gap-12 pb-24 md:grid-cols-[1fr_1fr] md:gap-20 md:pb-32">
        <div className="border-t border-line">
          {inquiryTypes.map((type, index) => (
            <article
              className="grid grid-cols-[2.5rem_1fr] border-b border-line py-7"
              key={type.title}
            >
              <span className="text-[10px] text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-lg font-medium">{type.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {type.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="bg-stone p-7 md:p-10">
          <p className="eyebrow-section mb-8">Contact information</p>
          <dl className="space-y-7 text-sm">
            <div>
              <dt className="text-xs text-muted">고객센터</dt>
              <dd className="mt-2 text-lg font-medium">
                {phoneReady ? (
                  <a href={`tel:${siteConfig.telephone}`}>
                    {siteConfig.telephone}
                  </a>
                ) : (
                  siteConfig.telephone
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">이메일</dt>
              <dd className="mt-2 text-lg font-medium">
                {emailReady ? (
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                ) : (
                  siteConfig.email
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">사업장 주소</dt>
              <dd className="mt-2 leading-6">{siteConfig.address}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">운영 시간</dt>
              <dd className="mt-2 leading-6">{siteConfig.operatingHours}</dd>
            </div>
          </dl>

          {!emailReady && !phoneReady ? (
            <p className="mt-10 border-t border-line pt-5 text-xs leading-5 text-muted">
              현재 연락처 입력 전입니다. 실제 운영 전{" "}
              <code>data/launch/business.yaml</code>에서 고객센터와 이메일을
              반드시 설정해 주세요.
            </p>
          ) : null}

          <Link className="text-link mt-8" href="/support">
            고객지원 안내 보기
          </Link>
          {siteConfig.kakaoChannelUrl ? (
            <a
              className="text-link mt-4"
              href={siteConfig.kakaoChannelUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              카카오 채널로 문의
            </a>
          ) : null}
        </div>
      </section>
    </>
  );
}
