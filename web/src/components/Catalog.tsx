"use client";

import { useMemo, useState } from "react";
import { CATEGORY_KO, catalog, metrics } from "@/lib/data";
import type { Category, SizeFit } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const SIZE_FILTERS: { key: SizeFit | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "runs_small", label: "작게 나와요" },
  { key: "true_to_size", label: "정사이즈" },
  { key: "runs_large", label: "크게 나와요" },
];

const PAGE_SIZE = 24;

// 상품명이 사실상 같은 상품(색상/사이즈만 다른 등록 등)은 목록에서 하나만 보여줘요. 상세 페이지는 모두 있어요.
const titleKey = (title: string) => title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40);
const uniqueCatalog = (() => {
  const seen = new Set<string>();
  return catalog.filter((p) => {
    const k = titleKey(p.title);
    if (!k) return true;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
})();

export function Catalog() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [size, setSize] = useState<SizeFit | "all">("all");
  const [onlyAi, setOnlyAi] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // 필터가 바뀌면 처음 24개부터 다시 보여줘요
  const changeCat = (c: Category | "all") => {
    setCat(c);
    setVisible(PAGE_SIZE);
  };
  const changeSize = (s: SizeFit | "all") => {
    setSize(s);
    setVisible(PAGE_SIZE);
  };
  const changeOnlyAi = (v: boolean) => {
    setOnlyAi(v);
    setVisible(PAGE_SIZE);
  };

  const categories = useMemo(
    () => Array.from(new Set(catalog.map((p) => p.category).filter(Boolean))) as Category[],
    [],
  );

  const list = useMemo(
    () =>
      uniqueCatalog.filter(
        (p) =>
          (cat === "all" || p.category === cat) &&
          (size === "all" || p.summary?.sizeFit === size) &&
          (!onlyAi || !!p.summary),
      ),
    [cat, size, onlyAi],
  );
  const shown = list.slice(0, visible);
  const remaining = list.length - shown.length;

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
          상품 카드의 한 줄 요약은 LLM이 리뷰 수백 개를 읽고 정리한 결과예요. 사이즈 배지는 리뷰에서 작다 · 정사이즈 · 크다 의견을
          세어 다수결로 정했고, 의견이 {metrics.summary.sizeMinVotes ?? 5}개 미만이면 표시하지 않아요. 사이즈로 바로 걸러 보세요.
        </p>
      </div>

      <div className="sticky top-16 z-30 -mx-4 mb-8 flex flex-col gap-3 border-y border-line bg-bg/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5" role="group" aria-label="카테고리">
          <button className={chip(cat === "all")} onClick={() => changeCat("all")}>
            전체
          </button>
          {categories.map((c) => (
            <button key={c} className={chip(cat === c)} onClick={() => changeCat(c)}>
              {CATEGORY_KO[c]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-dim">Fit</span>
          {SIZE_FILTERS.map((s) => (
            <button key={s.key} className={chip(size === s.key)} onClick={() => changeSize(s.key)}>
              {s.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <span className="whitespace-nowrap font-mono text-[11px] text-dim" aria-live="polite">
              상품 {list.length.toLocaleString()}개
            </span>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={onlyAi}
                onChange={(e) => changeOnlyAi(e.target.checked)}
                className="h-3.5 w-3.5 accent-[#4f8cff]"
              />
              AI 요약 있는 상품만
            </label>
          </div>
        </div>
      </div>

      {list.length ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i % PAGE_SIZE} />
            ))}
          </div>
          {remaining > 0 && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-full border border-line px-6 py-2.5 text-sm text-muted transition hover:border-accent hover:text-ink"
              >
                더 보기 ({remaining.toLocaleString()}개 남음)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-line p-12 text-center text-sm text-muted">
          조건에 맞는 상품이 없어요. 필터를 바꿔 보세요.
        </div>
      )}
    </section>
  );
}
