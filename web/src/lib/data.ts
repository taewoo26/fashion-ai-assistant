import productsJson from "@/data/products.json";
import demosJson from "@/data/chat-demos.json";
import metricsJson from "@/data/metrics.json";
import metaJson from "@/data/meta.json";
import type { Category, ChatDemo, Meta, Metrics, Product, SizeFit } from "./types";

export const products = productsJson as Product[];
export const chatDemos = demosJson as ChatDemo[];
export const metrics = metricsJson as Metrics;
export const meta = metaJson as Meta;

const byId = new Map(products.map((p) => [p.id, p]));
export const getProduct = (id: string) => byId.get(id);

// 상세 페이지/카탈로그에 보여줄 상품: 요약이 있는 상품 우선
export const catalog = [...products].sort(
  (a, b) => Number(!!b.summary) - Number(!!a.summary) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
);

export const CATEGORY_KO: Record<Category, string> = {
  dress: "원피스",
  jeans: "청바지",
  blouse: "블라우스",
  leggings: "레깅스",
  pajamas: "잠옷",
  crossbody: "크로스백",
  ring: "반지",
  watch: "시계",
};

export const SIZE_KO: Record<SizeFit, string> = {
  runs_small: "작게 나와요",
  true_to_size: "정사이즈",
  runs_large: "크게 나와요",
  mixed: "의견 갈림",
  unknown: "정보 없음",
};

export const firstSentence = (s: string) => {
  const m = s.match(/^.+?(요\.|다\.|\.)(\s|$)/);
  return m ? m[0].trim() : s;
};

export const formatPrice = (p: number | null) => (p == null ? null : `$${p.toFixed(2)}`);

export const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
