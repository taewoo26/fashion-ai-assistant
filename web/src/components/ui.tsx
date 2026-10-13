import { CATEGORY_KO, SIZE_KO } from "@/lib/data";
import type { Category, Product, SizeFit } from "@/lib/types";

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
  if (product.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image}
        alt={product.title}
        loading="lazy"
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

const SIZE_STYLE: Record<SizeFit, string> = {
  runs_small: "text-small border-small/40 bg-small/10",
  true_to_size: "text-true border-true/40 bg-true/10",
  runs_large: "text-large border-large/40 bg-large/10",
  mixed: "text-mixed border-mixed/40 bg-mixed/10",
  unknown: "text-dim border-line bg-transparent",
};

export function SizeBadge({ fit, className = "" }: { fit: SizeFit | null | undefined; className?: string }) {
  const f = fit ?? "unknown";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${SIZE_STYLE[f]} ${className}`}
    >
      <span aria-hidden>📏</span>
      {SIZE_KO[f]}
    </span>
  );
}

export function Rating({ value, count }: { value: number | null; count?: number | null }) {
  if (value == null) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <span className="text-accent-2" aria-hidden>
        ★
      </span>
      <span className="text-ink">{value.toFixed(1)}</span>
      {count != null && <span>({count.toLocaleString()})</span>}
    </span>
  );
}

export function CategoryLabel({ category }: { category: Category | null }) {
  if (!category) return null;
  return (
    <span className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
      {category} · {CATEGORY_KO[category]}
    </span>
  );
}

export function AiTag() {
  return (
    <span className="rounded border border-accent/50 px-1 font-display text-[9px] font-bold tracking-widest text-accent">
      AI
    </span>
  );
}

/** "[1] 상품은..." 의 번호를 강조 */
export function NumberedText({ text }: { text: string }) {
  const parts = text.split(/(\[\d+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[\d+\]$/.test(p) ? (
          <span
            key={i}
            className="mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded bg-accent/20 px-1 font-mono text-[11px] text-accent"
          >
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
