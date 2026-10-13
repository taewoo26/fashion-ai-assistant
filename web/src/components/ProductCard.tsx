import Link from "next/link";
import { firstSentence, formatPrice } from "@/lib/data";
import type { Product } from "@/lib/types";
import { AiTag, CategoryLabel, ProductImage, Rating, SizeBadge } from "./ui";

export function ProductCard({ product, index }: { product: Product; index?: number }) {
  const price = formatPrice(product.price);
  return (
    <Link
      href={`/product/${product.id}/`}
      className="group rise flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_0_40px_-12px_rgb(79_140_255/0.5)]"
      style={index != null ? { animationDelay: `${Math.min(index, 12) * 40}ms` } : undefined}
    >
      <div className="relative aspect-[4/5] overflow-hidden border-b border-line">
        <ProductImage product={product} className="transition duration-500 group-hover:scale-[1.03]" />
        {product.summary && product.summary.sizeFit !== "unknown" && (
          <div className="absolute left-2 top-2">
            <SizeBadge fit={product.summary.sizeFit} className="bg-bg/80 backdrop-blur" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <CategoryLabel category={product.category} />
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink">{product.title}</h3>
        <div className="flex items-center justify-between gap-2">
          <Rating value={product.rating} count={product.ratingCount} />
          <span className="whitespace-nowrap font-mono text-sm text-ink">{price ?? <span className="text-[11px] text-dim">가격 없음</span>}</span>
        </div>
        {product.summary && (
          <p className="mt-auto flex gap-2 border-t border-line pt-3 text-xs leading-relaxed text-muted">
            <AiTag />
            <span className="line-clamp-2">{firstSentence(product.summary.summary)}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
