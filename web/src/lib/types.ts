// 06_export_demo_data.ipynb 가 만드는 JSON과 같은 형식이에요.

export type SizeFit = "runs_small" | "true_to_size" | "runs_large" | "mixed" | "unknown";

export type Category =
  | "dress"
  | "jeans"
  | "blouse"
  | "leggings"
  | "pajamas"
  | "crossbody"
  | "ring"
  | "watch";

export interface ReviewSummary {
  summary: string;
  pros: string[];
  cons: string[];
  sizeFit: SizeFit;
  sizeEvidence: string;
  productType: string;
  materials: string[];
  seasons: string[];
  occasions: string[];
  styleTags: string[];
}

export interface Product {
  id: string; // parent_asin
  title: string;
  store: string | null;
  price: number | null;
  rating: number | null;
  ratingCount: number | null;
  image: string | null;
  category: Category | null;
  reviewCount: number | null;
  summary: ReviewSummary | null; // 04에서 요약한 상품만 있음
  similar: {
    content: string[]; // 03 콘텐츠 기반 (임베딩)
    itemcf: string[]; // 02 ItemCF (함께 구매)
  };
}

export interface ParsedQuery {
  intent: "search" | "product_qa" | "compare" | "other";
  productType: string;
  searchText: string;
  sizeFit: SizeFit | "any";
  maxPrice: number;
  refs: number[];
}

export interface ChatTurn {
  user: string;
  parsed: ParsedQuery;
  products: string[]; // 상품 id
  numbers: number[]; // 화면에 보여준 번호 [1]..[5]
  answer: string;
  latencyMs: number;
}

export interface ChatDemo {
  id: string;
  title: string;
  turns: ChatTurn[];
}

export interface Metrics {
  dataset: {
    name: string;
    reviews: number;
    users: number;
    products: number;
    singleReviewUserRate: number;
    emptyDescriptionRate: number;
  };
  recommendation: { model: string; recall10: number; coldRecall10: number }[];
  queryUnderstanding: { method: string; categoryP5: number }[];
  summary: { count: number; supportedRate: number; sizeAgreement: number; costUsd: number };
  groundedness: { supportedRate: number; unknownAdmitRate: number; judgeModel: string; n: number };
  latency: { medianMs: number; meanMs: number };
}
