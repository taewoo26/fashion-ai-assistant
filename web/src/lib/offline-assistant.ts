/**
 * 정적 데모용 "오프라인 어시스턴트".
 * 실제 챗봇(05 노트북)은 Gemini가 검색어를 해석하고 답을 만들지만,
 * GitHub Pages에는 서버도 API 키도 없으니 키워드 규칙으로 흉내만 내요.
 * 화면에는 "오프라인 데모 응답"으로 표시해서 실제 모델 결과와 구분합니다.
 */
import { CATEGORY_KO, SIZE_KO, catalog, getProduct } from "./data";
import type { Category, ParsedQuery, Product, SizeFit } from "./types";

const CATEGORY_WORDS: [Category, RegExp][] = [
  ["jeans", /청바지|데님|jeans?|denim/i],
  ["dress", /원피스|드레스|dress/i],
  ["blouse", /블라우스|셔츠|가디건|blouse|cardigan/i],
  ["leggings", /레깅스|요가\s*바지|leggings?|yoga/i],
  ["pajamas", /잠옷|파자마|슬립|pajamas?|sleepwear|nightgown/i],
  ["crossbody", /크로스백|가방|숄더백|crossbody|bag/i],
  ["ring", /반지|\bring/i],
  ["watch", /시계|워치|watch/i],
];

function detectSize(text: string): SizeFit | "any" {
  if (/작게\s*나|크게\s*사|업사이즈|size\s*up|runs?\s*small/i.test(text)) return "runs_small";
  if (/크게\s*나|작게\s*사|넉넉|오버핏|runs?\s*(large|big)/i.test(text)) return "runs_large";
  if (/정사이즈|true\s*to\s*size/i.test(text)) return "true_to_size";
  return "any";
}

export interface OfflineReply {
  parsed: ParsedQuery;
  products: string[];
  numbers: number[];
  answer: string;
}

export function offlineReply(text: string, lastShown: string[]): OfflineReply {
  const refs = [...text.matchAll(/(\d)\s*번/g)].map((m) => Number(m[1]));
  const pointsBack = refs.length > 0 || /이거|이 상품|그거|이 제품/.test(text);

  if (pointsBack && lastShown.length) {
    const nums = (refs.length ? refs : [1]).filter((n) => n >= 1 && n <= lastShown.length);
    const ids = nums.map((n) => lastShown[n - 1]);
    return {
      parsed: { intent: ids.length > 1 ? "compare" : "product_qa", productType: "", searchText: "", sizeFit: "any", maxPrice: 0, refs: nums },
      products: ids,
      numbers: nums,
      answer: answerAbout(text, ids.map((id) => getProduct(id)!), nums),
    };
  }

  const category = CATEGORY_WORDS.find(([, re]) => re.test(text))?.[0] ?? null;
  const size = detectSize(text);
  let found = catalog.filter((p) => (!category || p.category === category));
  if (size !== "any") {
    const exact = found.filter((p) => p.summary?.sizeFit === size);
    found = [...exact, ...found.filter((p) => !exact.includes(p))];
  }
  found = found.slice(0, 4);

  const parsed: ParsedQuery = {
    intent: category ? "search" : "other",
    productType: category ?? "",
    searchText: "",
    sizeFit: size,
    maxPrice: 0,
    refs: [],
  };
  if (!category) {
    return {
      parsed,
      products: [],
      numbers: [],
      answer:
        "데모 모드에서는 상품 종류(원피스, 청바지, 블라우스, 레깅스, 잠옷, 크로스백, 반지, 시계)와 사이즈 조건(작게/크게 나오는)만 알아들어요. 위의 시나리오 버튼을 누르면 05 노트북에서 녹화한 챗봇 대화를 다시 볼 수 있어요.",
    };
  }
  const nums = found.map((_, i) => i + 1);
  const sizeNote =
    size === "any"
      ? ""
      : ` 리뷰 요약 기준으로 '${SIZE_KO[size]}' 상품을 먼저 보여드려요.`;
  const lines = found.map((p, i) => {
    const s = p.summary ? `${SIZE_KO[p.summary.sizeFit]}` : "사이즈 정보 없음";
    return `[${i + 1}] ${s}`;
  });
  return {
    parsed,
    products: found.map((p) => p.id),
    numbers: nums,
    answer: `${CATEGORY_KO[category]} ${found.length}개를 찾았어요.${sizeNote} ${lines.join(" · ")}. 번호로 "2번 사이즈 어때?"처럼 물어보세요.`,
  };
}

function answerAbout(text: string, ps: Product[], nums: number[]): string {
  const parts = ps.map((p, i) => {
    const tag = `[${nums[i]}]`;
    const s = p.summary;
    if (!s) return `${tag}은 리뷰 요약이 없어서 자세한 답을 드리기 어려워요.`;
    if (/사이즈|핏|치수|크기/.test(text))
      return `${tag}은 리뷰 기준 '${SIZE_KO[s.sizeFit]}'. ${s.sizeEvidence}`;
    if (/단점|불만|별로|아쉬/.test(text)) return `${tag}의 아쉬운 점: ${s.cons.join(", ") || "특별히 반복된 불만이 없어요"}.`;
    if (/장점|좋은|추천/.test(text)) return `${tag}의 장점: ${s.pros.join(", ")}.`;
    if (/소재|재질|원단|착용감|편/.test(text))
      return `${tag}: ${s.materials.length ? `소재 ${s.materials.join(", ")}. ` : ""}${s.pros.slice(0, 2).join(", ")}.`;
    if (/배송|세일|할인|매장|재고|환불/.test(text))
      return `${tag}의 해당 내용은 리뷰나 상품 정보에서 확인되지 않아요.`;
    return `${tag} ${s.summary}`;
  });
  return parts.join(" ");
}
