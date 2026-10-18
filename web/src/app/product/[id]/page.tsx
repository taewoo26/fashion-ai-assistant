import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProduct, metrics, products, SIZE_KO } from "@/lib/data";
import type { SizeFit } from "@/lib/types";
import { AiTag, CategoryLabel, ProductImage, Rating, SizeBadge } from "@/components/ui";
import { AskAboutButton } from "@/components/chat/AskAboutButton";
import { SimilarTabs } from "@/components/SimilarTabs";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProduct(id);
  return { title: p ? `${p.title} — AXIS//WEAR` : "AXIS//WEAR" };
}

const FIT_POS: Record<SizeFit, number | null> = {
  runs_small: 12,
  true_to_size: 50,
  runs_large: 88,
  mixed: null,
  unknown: null,
};

function SizeMeter({ fit }: { fit: SizeFit }) {
  const pos = FIT_POS[fit];
  return (
    <div>
      <div className="relative h-2 rounded-full bg-gradient-to-r from-small/70 via-true/70 to-large/70">
        {pos != null && (
          <span
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg bg-ink shadow-[0_0_16px_rgb(255_255_255/0.6)]"
            style={{ left: `${pos}%` }}
            aria-hidden
          />
        )}
        {fit === "mixed" && <span className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(90deg,transparent_0_6px,rgb(5_6_10/0.55)_6px_10px)]" />}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-dim">
        <span>작게 나와요</span>
        <span>정사이즈</span>
        <span>크게 나와요</span>
      </div>
    </div>
  );
}

function Tags({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-14 shrink-0 text-[11px] text-dim">{label}</span>
      {items.map((t) => (
        <span key={t} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
          {t}
        </span>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();
  const s = p.summary;
  const price = formatPrice(p.price);
  const sizeEval = metrics.evaluation?.size;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 text-xs text-dim">
        <Link href="/#shop" className="hover:text-ink">
          ← 상품 목록
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-line lg:sticky lg:top-24 lg:self-start">
          <ProductImage product={p} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <CategoryLabel category={p.category} />
            <h1 className="text-2xl font-bold leading-snug sm:text-3xl">{p.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              {p.store && <span>{p.store}</span>}
              <Rating value={p.rating} count={p.ratingCount} />
              {p.reviewCount != null && <span className="text-xs">리뷰 {p.reviewCount.toLocaleString()}개 분석</span>}
            </div>
            <div className="font-display text-3xl font-bold">
              {price ?? <span className="font-sans text-base font-normal text-dim">가격 정보 없음</span>}
            </div>
          </div>

          {s ? (
            <section className="relative overflow-hidden rounded-2xl border border-accent/30 bg-surface p-5 sm:p-6">
              <div className="hairline absolute inset-x-0 top-0" />
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <AiTag /> 리뷰 한눈에 보기
                </h2>
                <SizeBadge fit={s.sizeFit} />
              </div>
              <p className="text-[15px] leading-relaxed text-ink">{s.summary}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-bg/60 p-4">
                  <h3 className="mb-2 text-xs font-bold text-true">좋았던 점</h3>
                  <ul className="flex flex-col gap-1.5 text-sm text-ink/90">
                    {s.pros.map((x) => (
                      <li key={x} className="flex gap-2">
                        <span className="text-true">+</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-line bg-bg/60 p-4">
                  <h3 className="mb-2 text-xs font-bold text-small">아쉬운 점</h3>
                  <ul className="flex flex-col gap-1.5 text-sm text-ink/90">
                    {s.cons.length ? (
                      s.cons.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="text-small">−</span>
                          {x}
                        </li>
                      ))
                    ) : (
                      <li className="text-muted">반복된 불만이 없어요</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-line bg-bg/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold">사이즈 핏</h3>
                  <span className="text-xs text-muted">{SIZE_KO[s.sizeFit]}</span>
                </div>
                {s.sizeFit !== "unknown" && <SizeMeter fit={s.sizeFit} />}
                <p className="mt-3 text-xs leading-relaxed text-muted">{s.sizeEvidence}</p>
              </div>
              {sizeEval && (
                <p className="mt-2 text-[11px] text-dim">
                  리뷰의 사이즈 의견을 세어 정한 라벨이에요 · 정답 {sizeEval.nTest}개 기준 정확도 {Math.round(sizeEval.after * 100)}%
                </p>
              )}

              <div className="mt-5 flex flex-col gap-2">
                <Tags label="소재" items={s.materials} />
                <Tags label="계절" items={s.seasons} />
                <Tags label="상황" items={s.occasions} />
                <Tags label="스타일" items={s.styleTags} />
              </div>

              <p className="mt-5 text-[11px] leading-relaxed text-dim">
                요약과 장단점은 LLM이 리뷰를 읽고 정리한 내용이에요. 일부 리뷰를 전체 의견처럼 일반화할 수 있어요.
              </p>
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">
              이 상품은 아직 AI 리뷰 요약이 없어요. 데모에서는 리뷰가 많은 상품 일부만 요약했어요.
            </section>
          )}

          <AskAboutButton productId={p.id} />
        </div>
      </div>

      <SimilarTabs product={p} />
    </div>
  );
}
