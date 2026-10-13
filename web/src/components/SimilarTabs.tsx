"use client";

import { useState } from "react";
import { getProduct } from "@/lib/data";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const TABS = [
  {
    key: "content" as const,
    label: "비슷한 상품",
    method: "콘텐츠 기반 · 상품명·설명·리뷰 임베딩",
    note: "구매 기록이 없는 신상품도 찾을 수 있어요.",
  },
  {
    key: "itemcf" as const,
    label: "함께 구매한 상품",
    method: "ItemCF · 같은 사람이 함께 산 기록",
    note: "실제로 함께 구매된 근거가 있지만, 데이터가 희소하면 엉뚱한 상품이 섞여요.",
  },
];

export function SimilarTabs({ product }: { product: Product }) {
  const available = TABS.filter((t) => product.similar[t.key].length);
  const [tab, setTab] = useState(available[0]?.key ?? "content");
  if (!available.length) return null;
  const current = TABS.find((t) => t.key === tab)!;
  const list = product.similar[tab].map(getProduct).filter(Boolean) as Product[];

  return (
    <section className="mt-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line">
        <div className="flex gap-6" role="tablist">
          {available.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium transition ${
                tab === t.key ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="pb-3 font-mono text-[11px] text-dim">{current.method}</p>
      </div>
      <p className="mb-5 text-xs text-muted">{current.note}</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
        {list.slice(0, 6).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
