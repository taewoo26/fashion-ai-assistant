"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_KO } from "@/lib/data";
import type { Category, Product } from "@/lib/types";

const CAT_HUE: Record<Category, string> = {
  dress: "from-fuchsia-500/25",
  jeans: "from-blue-500/30",
  blouse: "from-sky-400/25",
  leggings: "from-emerald-400/20",
  pajamas: "from-indigo-400/25",
  crossbody: "from-amber-400/20",
  ring: "from-cyan-300/25",
  watch: "from-slate-300/20",
};

export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 정적 HTML에서는 하이드레이션 전에 이미 로딩이 실패했을 수 있어요
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (product.image && failed) {
    return (
      <div
        role="img"
        aria-label={`${product.category ? CATEGORY_KO[product.category] : "상품"} 이미지를 불러오지 못했어요`}
        className={`flex h-full w-full items-center justify-center bg-surface-2 ${className}`}
      >
        <span className="text-sm font-medium text-dim">{product.category ? CATEGORY_KO[product.category] : "상품"}</span>
      </div>
    );
  }

  if (product.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={imgRef}
        src={product.image}
        alt={product.title}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full bg-white object-contain p-3 ${className}`}
      />
    );
  }

  const hue = product.category ? CAT_HUE[product.category] : "from-slate-400/20";
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${hue} via-surface-2 to-surface ${className}`}
      aria-label={`${product.title} 이미지 자리`}
    >
      <div className="grid-bg absolute inset-0 opacity-60" />
      <span className="relative font-display text-xs font-bold uppercase tracking-[0.35em] text-ink/60">
        {product.category ?? "item"}
      </span>
    </div>
  );
}
