"use client";

import { useMemo, useState } from "react";
import { CATEGORY_KO, catalog } from "@/lib/data";
import type { Category, SizeFit } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const SIZE_FILTERS: { key: SizeFit | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "runs_small", label: "작게 나와요" },
  { key: "true_to_size", label: "정사이즈" },
  { key: "runs_large", label: "크게 나와요" },
];

export function Catalog() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [size, setSize] = useState<SizeFit | "all">("all");
  const [onlyAi, setOnlyAi] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(catalog.map((p) => p.category).filter(Boolean))) as Category[],
    [],
  );

  const list = useMemo(
    () =>
      catalog.filter(
        (p) =>
          (cat === "all" || p.category === cat) &&
          (size === "all" || p.summary?.sizeFit === size) &&
          (!onlyAi || !!p.summary),
      ),
    [cat, size, onlyAi],
  );

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs transition ${
      active ? "border-accent bg-accent text-bg font-medium" : "border-line text-muted hover:border-line-strong hover:text-ink"
    }`;

  return (
    <section id="shop" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-col gap-2">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-accent">Catalog</span>
        <h2 className="text-3xl font-bold sm:text-4xl">리뷰를 읽은 AI가 사이즈를 먼저 알려드려요</h2>
        <p className="max-w-2xl text-sm text-muted">
          상품 카드의 사이즈 배지와 한 줄 요약은 LLM이 리뷰 수백 개를 읽고 정리한 결과예요. 사이즈로 바로 걸러 보세요.
        </p>
      </div>

      <div className="sticky top-16 z-30 -mx-4 mb-8 flex flex-col gap-3 border-y border-line bg-bg/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5" role="group" aria-label="카테고리">
          <button className={chip(cat === "all")} onClick={() => setCat("all")}>
            전체
          </button>
          {categories.map((c) => (
            <button key={c} className={chip(cat === c)} onClick={() => setCat(c)}>
              {CATEGORY_KO[c]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-dim">Fit</span>
          {SIZE_FILTERS.map((s) => (
            <button key={s.key} className={chip(size === s.key)} onClick={() => setSize(s.key)}>
              {s.label}
            </button>
          ))}
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={onlyAi}
              onChange={(e) => setOnlyAi(e.target.checked)}
              className="h-3.5 w-3.5 accent-[#4f8cff]"
            />
            AI 요약 있는 상품만
          </label>
        </div>
      </div>

      <p className="mb-4 font-mono text-xs text-dim">{list.length} items</p>
      {list.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line p-12 text-center text-sm text-muted">
          조건에 맞는 상품이 없어요. 필터를 바꿔 보세요.
        </div>
      )}
    </section>
  );
}
