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
  summary: {
    count: number;
    supportedRate: number;
    costUsd: number;
    excluded?: number; // 패션 상품이 아니라 뺀 개수
    sizeShown?: number; // 사이즈 배지가 붙은 상품 수
    sizeMinVotes?: number; // 배지를 붙이는 최소 의견 수
    sizeAgreement?: number; // v1 형식
  };
  groundedness: { supportedRate: number; unknownAdmitRate: number; judgeModel: string; n: number };
  latency: { medianMs: number; meanMs: number };
  evaluation?: Evaluation; // 07~09 평가 결과 (v2)
}

export type QType = "simple" | "attribute" | "occasion" | "size" | "english";

// before/after 는 모두 test 세트 기준 0~1
export interface Evaluation {
  search: {
    nQueries: { dev: number; test: number };
    method: string;
    before: number; // 한국어 원문 검색
    after: number; // 영어 재작성 + 하이브리드
    byQtype: { qtype: QType; before: number; after: number; n: number }[];
  };
  size: {
    nGold: number;
    nTest: number;
    before: number; // 04 LLM 라벨
    rule04: number; // 04 규칙 라벨
    after: number; // 08 최종
    method: string;
  };
}

export interface Meta {
  mode: "sample" | "real";
  generatedAt: string;
  note?: string;
  version?: number;
}
