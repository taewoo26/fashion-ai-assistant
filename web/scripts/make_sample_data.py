"""화면 개발용 샘플 데이터를 만들어요.

실제 데이터는 노트북 06_export_demo_data.ipynb 가 같은 형식으로 src/data/ 에 덮어씁니다.
샘플 상품 이름과 스토어는 모두 지어낸 것이에요.

    python scripts/make_sample_data.py
"""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "src" / "data"
OUT.mkdir(parents=True, exist_ok=True)


def S(summary, pros, cons, fit, evidence, ptype, materials=(), seasons=(), occasions=(), tags=()):
    return {"summary": summary, "pros": list(pros), "cons": list(cons), "sizeFit": fit,
            "sizeEvidence": evidence, "productType": ptype, "materials": list(materials),
            "seasons": list(seasons), "occasions": list(occasions), "styleTags": list(tags)}


P = [
    # id, title, store, price, rating, count, category, reviews, summary
    ("S-JEAN-01", "Women's Stretch Skinny Jeggings High Rise Denim", "Northline Denim", 24.99, 4.3, 3120, "jeans", 812,
     S("신축성이 좋아 편하지만 작게 나와서 한 치수 크게 사라는 리뷰가 많은 스키니 진이에요.",
       ["부드럽고 신축성 좋음", "허리를 잘 잡아줌", "가성비 좋음"], ["작게 나옴", "세탁 후 물빠짐", "기장이 짧은 편"],
       "runs_small", "작게 나와서 평소보다 한 치수 크게 주문했다는 리뷰가 반복돼요.", "skinny jeans",
       ["denim", "spandex"], ["fall", "spring"], ["casual", "daily"], ["skinny", "high rise"])),
    ("S-JEAN-02", "Women's Pull-On Bootcut Knit Denim Jeans", "Comfy Atelier", 39.5, 4.4, 5401, "jeans", 1240,
     S("잠옷처럼 편한 니트 데님 부츠컷이에요. 대체로 작게 나온다는 평이지만 입을수록 늘어난다는 의견도 있어요.",
       ["잠옷처럼 편한 착용감", "허리 밴딩", "체형 커버"], ["작게 나옴", "보풀", "입을수록 늘어남"],
       "runs_small", "한 사이즈 크게 샀다는 리뷰가 많지만, 늘어나서 커졌다는 의견도 일부 있어요.", "bootcut jeans",
       ["knit denim"], ["fall", "winter"], ["casual", "travel"], ["bootcut", "pull-on"])),
    ("S-JEAN-03", "Women's Curvy Bootcut Jeggings Vintage Wash", "Comfy Atelier", None, 4.2, 980, "jeans", 301,
     S("엉덩이와 허리가 타이트하다는 평이 있는 부츠컷 제깅스로, 편안함은 좋은 평가를 받아요.",
       ["부드러운 소재", "편안함", "빈티지한 워싱"], ["허리와 엉덩이가 타이트함", "작게 나옴"],
       "runs_small", "허리와 엉덩이가 끼어서 한 치수 크게 사라는 리뷰가 있어요.", "bootcut jeggings",
       ["cotton", "polyester"], ["fall"], ["casual"], ["curvy", "vintage"])),
    ("S-JEAN-04", "Women's Bell Bottom Jeans Elastic High Waist Flare", "Retro Lane", 29.99, 4.0, 2210, "jeans", None, None),
    ("S-DRESS-01", "Women V-Neck Polka Dot Spaghetti Strap Boho Maxi Dress", "Breeze Studio", 32.99, 4.2, 9870, "dress", 1714,
     S("가볍고 시원한 맥시 드레스로 주머니와 조절 가능한 스트랩이 좋다는 평이에요. 가슴 부분 핏은 호불호가 갈려요.",
       ["시원하고 편함", "실용적인 주머니", "조절 가능한 스트랩"], ["가슴 부분 핏", "비침", "생각보다 짧음"],
       "mixed", "대체로 잘 맞지만 체형에 따라 작거나 크다는 의견이 섞여 있어요.", "maxi dress",
       ["rayon"], ["summer"], ["vacation", "beach"], ["boho", "polka dot"])),
    ("S-DRESS-02", "Summer Wedding Guest Chiffon Floral Midi Dress", "Garden Party", 45.0, 4.5, 1880, "dress", 402,
     S("하객룩으로 입었다는 리뷰가 많은 쉬폰 플로럴 원피스예요. 정사이즈라는 평이 대부분이에요.",
       ["하객룩으로 칭찬받음", "가볍고 흐르는 소재", "사진보다 예쁨"], ["안감이 얇음", "구김"],
       "true_to_size", "평소 사이즈로 샀더니 잘 맞았다는 리뷰가 대부분이에요.", "midi dress",
       ["chiffon"], ["summer", "spring"], ["wedding guest", "party"], ["floral", "elegant"])),
    ("S-DRESS-03", "Women's Oversized T-Shirt Swing Dress with Pockets", "Daily Form", 22.99, 4.3, 4320, "dress", 655,
     S("넉넉한 티셔츠 원피스로, 크게 나오니 한 치수 작게 사도 된다는 리뷰가 많아요.",
       ["편하고 부드러움", "주머니", "집에서도 외출에도"], ["크게 나옴", "보풀"],
       "runs_large", "크게 나와서 한 치수 작게 샀다는 리뷰가 반복돼요.", "t-shirt dress",
       ["cotton", "spandex"], ["spring", "summer"], ["casual", "daily"], ["oversized", "swing"])),
    ("S-DRESS-04", "Linen Blend Button Front Midi Shirt Dress", "Breeze Studio", 36.0, 4.1, 760, "dress", 188,
     S("린넨 혼방이라 여름에 시원하다는 평이에요. 구김이 잘 간다는 단점이 있어요.",
       ["통기성이 좋음", "단정한 디자인"], ["구김이 많음", "비침"],
       "true_to_size", "정사이즈라는 의견이 많아요.", "shirt dress",
       ["linen", "cotton"], ["summer"], ["office", "daily"], ["minimal", "linen"])),
    ("S-BLOUSE-01", "Women's Bell Sleeve V-Neck Office Blouse", "Monday Office", 26.99, 4.3, 2140, "blouse", 389,
     S("출근룩으로 단정하게 입기 좋은 벨 슬리브 블라우스예요. 소재가 얇아 이너가 필요하다는 의견이 있어요.",
       ["단정한 출근룩", "구김이 적음", "색감이 고급스러움"], ["비침", "소매가 김"],
       "true_to_size", "정사이즈로 잘 맞았다는 리뷰가 많아요.", "blouse",
       ["polyester"], ["spring", "fall"], ["office"], ["elegant", "bell sleeve"])),
    ("S-BLOUSE-02", "Open Front Boho Kimono Cardigan Blouse", "Lumi Wear", 18.99, 3.9, 1530, "blouse", 647,
     S("사진과 달리 기장이 짧고 작게 나왔다는 평이 많은 얇은 오픈 가디건이에요.",
       ["저렴한 가격", "가벼운 소재", "화려한 색감"], ["기장이 짧음", "작게 나옴", "얇은 품질"],
       "runs_small", "작게 나와서 크게 샀다는 리뷰가 많아요.", "cardigan",
       ["rayon"], ["summer"], ["vacation"], ["boho", "kimono"])),
    ("S-LEG-01", "Women's High Waist Seamless Workout Leggings", "Core Motion", 27.99, 4.4, 15230, "leggings", 1514,
     S("체형을 잘 잡아주는 심리스 레깅스로, 땀 자국과 일부 색상의 비침이 단점이에요.",
       ["부드럽고 편함", "체형 보정", "흘러내리지 않음"], ["땀 자국", "일부 색상 비침", "허리 말림"],
       "mixed", "정사이즈라는 의견과 허리가 크거나 작다는 의견이 갈려요.", "leggings",
       ["nylon", "spandex"], ["all season"], ["workout", "yoga"], ["seamless", "high waist"])),
    ("S-PJ-01", "Women's Micro Fleece Pajama Set Long Sleeve", "Sleepy Cloud", 31.99, 4.6, 7420, "pajamas", 980,
     S("겨울에 따뜻하고 포근하다는 평이 많은 극세사 잠옷 세트예요.",
       ["매우 따뜻함", "부드러운 촉감", "선물용으로 좋음"], ["정전기", "보풀"],
       "true_to_size", "평소 사이즈로 잘 맞았다는 리뷰가 대부분이에요.", "pajama set",
       ["fleece"], ["winter"], ["home", "sleep"], ["cozy"])),
    ("S-PJ-02", "Satin Lace Chemise Slip Nightgown", "Velvet Night", 19.99, 4.1, 1930, "pajamas", 193,
     S("부드러운 새틴 슬립으로 예쁘지만 작게 나와서 한두 치수 크게 사라는 의견이 많아요.",
       ["부드럽고 가벼움", "예쁜 디자인", "신축성"], ["작게 나옴", "레이스 색상이 사진과 다름"],
       "runs_small", "작게 나와서 한두 치수 크게 주문하라는 리뷰가 많아요.", "nightgown",
       ["satin"], ["summer"], ["sleep"], ["lace", "romantic"])),
    ("S-BAG-01", "Small Vintage Canvas Crossbody Messenger Bag", "Trail & Co", 21.99, 4.3, 6210, "crossbody", 785,
     S("가볍고 빈티지한 캔버스 크로스백이에요. 입구가 좁고 벨크로 내구성이 아쉽다는 의견이 있어요.",
       ["가볍고 수납 편리", "빈티지한 디자인", "튼튼한 캔버스"], ["입구가 좁음", "벨크로 내구성", "지퍼 고장"],
       "unknown", "가방이라 사이즈 핏 대신 용량 이야기가 많아요.", "crossbody bag",
       ["canvas", "leather"], ["all season"], ["travel", "daily"], ["vintage"])),
    ("S-BAG-02", "Genuine Leather Black Crossbody Phone Purse", "Maison Noir", 34.99, 4.4, 3880, "crossbody", 512,
     S("작지만 휴대폰과 카드가 들어가는 가죽 크로스백이에요. 가죽 냄새가 처음에 난다는 의견이 있어요.",
       ["부드러운 가죽", "깔끔한 블랙", "카드 수납"], ["처음에 가죽 냄새", "스트랩이 짧음"],
       "unknown", "사이즈 핏 정보는 없어요.", "crossbody bag",
       ["leather"], ["all season"], ["daily", "night out"], ["minimal", "black"])),
    ("S-RING-01", "925 Sterling Silver Oval Turquoise Gemstone Ring", "Silver Path", 28.0, 4.5, 690, "ring", 214,
     S("은 테두리 장식이 섬세한 터키석 원석 반지로, 사진보다 실물이 예쁘다는 평이 많아요.",
       ["실물이 더 예쁨", "선물용으로 좋음", "튼튼한 마감"], ["변색", "사이즈가 작은 편"],
       "runs_small", "평소보다 반 사이즈 크게 사라는 리뷰가 있어요.", "gemstone ring",
       ["sterling silver", "turquoise"], ["all season"], ["gift"], ["bohemian", "gemstone"])),
    ("S-WATCH-01", "Classic Resin Strap Digital Sport Watch", "Timeline", 17.95, 4.7, 48210, "watch", 2310,
     S("가볍고 배터리가 오래가는 클래식 디지털 시계예요. 방수는 생활 방수 수준이라는 평이에요.",
       ["가볍고 편함", "배터리가 오래감", "가성비"], ["생활 방수 수준", "백라이트가 어두움"],
       "unknown", "사이즈 핏 정보는 없어요.", "digital watch",
       ["resin"], ["all season"], ["daily", "sport"], ["retro", "digital"])),
    ("S-WATCH-02", "Men's Solar Tough Digital Sports Watch 200M", "Timeline", 89.0, 4.6, 6120, "watch", 840,
     S("태양광 충전과 200m 방수로 아웃도어에서 믿고 쓴다는 평이 많아요.",
       ["태양광 충전", "강한 방수", "튼튼함"], ["크고 두꺼움", "버튼이 뻑뻑함"],
       "unknown", "사이즈 핏 정보는 없어요.", "sports watch",
       ["resin", "stainless steel"], ["all season"], ["outdoor", "sport"], ["rugged"])),
]

products = []
for pid, title, store, price, rating, cnt, cat, nrev, summ in P:
    products.append({"id": pid, "title": title, "store": store, "price": price, "rating": rating,
                     "ratingCount": cnt, "image": None, "category": cat, "reviewCount": nrev,
                     "summary": summ, "similar": {"content": [], "itemcf": []}})

by_cat = {}
for p in products:
    by_cat.setdefault(p["category"], []).append(p["id"])
ids = [p["id"] for p in products]
for i, p in enumerate(products):
    same = [x for x in by_cat[p["category"]] if x != p["id"]]
    others = [x for x in ids if x not in same and x != p["id"]]
    p["similar"]["content"] = (same + others[i % 5:i % 5 + 3])[:6]
    p["similar"]["itemcf"] = [others[(i * 3 + k) % len(others)] for k in range(4)]


def parsed(intent, ptype="", text="", fit="any", refs=()):
    return {"intent": intent, "productType": ptype, "searchText": text, "sizeFit": fit,
            "maxPrice": 0, "refs": list(refs)}


demos = [
    {"id": "small-jeans", "title": "작게 나오는 청바지 찾기", "turns": [
        {"user": "작게 나와서 한 치수 크게 사야 하는 청바지 추천해줘",
         "parsed": parsed("search", "jeans", "jeans", "runs_small"),
         "products": ["S-JEAN-01", "S-JEAN-02", "S-JEAN-03", "S-JEAN-04"], "numbers": [1, 2, 3, 4],
         "answer": "리뷰에 따르면 [1], [2], [3] 상품은 모두 작게 나와서 평소보다 한 치수 크게 사라는 의견이 많아요. [3]은 특히 허리와 엉덩이가 타이트하다는 평이 있어요. [4]는 사이즈 정보가 없어서 핏을 단정하기 어려워요.",
         "latencyMs": 2080},
        {"user": "2번 상품 사이즈 어때? 평소보다 한 치수 크게 사면 될까?",
         "parsed": parsed("product_qa", refs=[2]),
         "products": ["S-JEAN-02"], "numbers": [2],
         "answer": "리뷰에 따르면 [2]는 작게 나와서 한 사이즈 크게 주문했다는 구매자가 많아요. 다만 입을수록 늘어난다는 평도 있으니, 딱 맞게 입고 싶다면 평소 사이즈와 한 치수 위 사이에서 고민해 보세요.",
         "latencyMs": 3990},
        {"user": "1번이랑 3번 중에 뭐가 더 편해?",
         "parsed": parsed("compare", refs=[1, 3]),
         "products": ["S-JEAN-01", "S-JEAN-03"], "numbers": [1, 3],
         "answer": "두 상품 모두 리뷰에서 편하다는 평가를 받아요. [1]은 신축성이 좋고 허리를 잘 잡아준다는 의견이 많고, [3]은 소재는 부드럽지만 허리와 엉덩이가 타이트하다는 평이 있어요. 편안함만 보면 [1]이 조금 더 무난해 보여요.",
         "latencyMs": 1640},
    ]},
    {"id": "wedding-guest", "title": "여름 하객룩 + 모르는 질문", "turns": [
        {"user": "여름 결혼식에 하객으로 입을 원피스 찾아줘",
         "parsed": parsed("search", "dress", "summer wedding guest dress"),
         "products": ["S-DRESS-02", "S-DRESS-04", "S-DRESS-01"], "numbers": [1, 2, 3],
         "answer": "[1]은 리뷰에서 하객룩으로 칭찬받았다는 평이 많은 쉬폰 플로럴 원피스예요. [2]는 린넨 혼방이라 시원하고 단정해요. [3]은 시원한 맥시 드레스지만 가슴 부분 핏은 호불호가 갈려요.",
         "latencyMs": 2210},
        {"user": "이거 한국으로 배송돼?",
         "parsed": parsed("product_qa", refs=[1]),
         "products": ["S-DRESS-02"], "numbers": [1],
         "answer": "[1] 상품의 한국 배송 여부는 리뷰나 상품 정보에서 확인되지 않아요. 판매처의 배송 안내를 확인해 주세요.",
         "latencyMs": 1710},
    ]},
]

metrics = {
    "dataset": {"name": "Amazon Reviews 2023 · Amazon Fashion", "reviews": 289897, "users": 118869,
                "products": 70641, "singleReviewUserRate": 0.853, "emptyDescriptionRate": 0.928},
    "recommendation": [
        {"model": "인기 상품", "recall10": 0.0158, "coldRecall10": 0.0},
        {"model": "ItemCF", "recall10": 0.0167, "coldRecall10": 0.0},
        {"model": "ALS", "recall10": 0.0152, "coldRecall10": 0.0},
        {"model": "콘텐츠 기반", "recall10": 0.0320, "coldRecall10": 0.0244},
    ],
    "queryUnderstanding": [
        {"method": "한국어 그대로 검색", "categoryP5": 0.70},
        {"method": "+ LLM 검색어 재작성", "categoryP5": 0.98},
        {"method": "+ 재작성 + 필터", "categoryP5": 0.98},
    ],
    "summary": {"count": 200, "supportedRate": 0.972, "sizeAgreement": 0.439, "costUsd": 0.27},
    "groundedness": {"supportedRate": 1.0, "unknownAdmitRate": 1.0, "judgeModel": "gemini-3.5-flash-lite", "n": 26},
    "latency": {"medianMs": 1690, "meanMs": 3560},
}

for name, obj in [("products", products), ("chat-demos", demos), ("metrics", metrics)]:
    (OUT / f"{name}.json").write_text(json.dumps(obj, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"{len(products)} products, {len(demos)} demos → {OUT}")
