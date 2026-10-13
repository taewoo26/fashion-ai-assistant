# AXIS//WEAR — 패션 이커머스 AI 어시스턴트

리뷰를 읽고 사이즈를 먼저 알려주는 AI 패션 쇼핑몰 데모입니다.
아마존 패션 리뷰 데이터로 **추천 → 의미 검색 → LLM 리뷰 요약 → RAG 챗봇**을 차례로 만들고, Next.js 쇼핑몰 화면에 붙였습니다.

- 데모: https://taewoo26.github.io/fashion-ai-assistant/
- 데이터: [Amazon Reviews 2023](https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023) · Amazon Fashion (McAuley Lab)

## 왜 만들었나

패션 쇼핑에서 가장 자주 하는 질문은 "이거 작게 나와요?"입니다. 답은 이미 리뷰 수백 개 안에 있지만 다 읽기는 어렵습니다.
이 프로젝트는 리뷰를 LLM이 먼저 읽게 하고, 그 결과를 검색과 챗봇에서 근거로 쓰는 구조를 직접 만들어 보며 각 단계의 한계를 숫자로 확인하는 데 집중했습니다.

## 단계별 결과

| 단계 | 한 일 | 핵심 결과 |
|---|---|---|
| 01 EDA | 리뷰 · 상품 데이터 탐색, k-core 필터링 | 유저의 85.3%가 리뷰 1개, 상품 설명의 92.8%가 비어 있음 |
| 02 추천 | 인기 · ItemCF · ALS 비교, 유저 기록 길이별 분석 | 기록 1개 유저는 ItemCF, 2개 이상은 ALS가 가장 좋음 |
| 03 의미 검색 | 다국어 임베딩(e5) + FAISS, BM25 하이브리드 | 학습에 없는 신상품 Recall@10: CF 0% → 콘텐츠 기반 2.44% |
| 04 LLM 리뷰 요약 | Gemini 구조화 출력, LLM-as-judge 검증 | 요약 주장의 97.2%가 리뷰에 근거, 200개 요약 비용 $0.27 |
| 05 RAG 챗봇 | 검색어 이해 → 필터 + 의미 검색 → 근거 기반 답변 | 카테고리 정확도@5 0.70 → 0.98, 모르는 질문 100% "확인되지 않아요" |
| 06 웹 | Next.js 정적 쇼핑몰, 녹화된 챗봇 대화 재생 | GitHub Pages 배포 |

각 단계에서 발견한 한계가 다음 단계를 만든 이유가 됐습니다.

- 02: 구매 기록만으로는 카시오 시계와 "비슷한 상품"에 아동 블레이저가 나옴 → 03에서 상품 내용을 보는 임베딩 검색
- 03: 리뷰 원문을 통째로 넣자 "작게 나오는 청바지"에 청바지가 하나도 안 나옴 → 04에서 리뷰를 속성별로 요약
- 04: 임베딩은 "작게 나온다"와 "크게 나온다"를 구분하지 못함 → 05에서 LLM이 조건을 뽑아 필터로 처리

## 아쉬운 점과 다음 할 일

- 사이즈 라벨: LLM 라벨과 규칙 기반 라벨의 일치율이 43.9%에 그쳤습니다. 프롬프트에 넣을 리뷰를 고를 때 불만 리뷰를 일부러 늘린 것이 원인 중 하나였습니다. 사이즈 언급 수는 코드로 세고 LLM은 해석만 맡기는 방식으로 바꿀 계획입니다.
- 평가 규모: 검색어 10개, 근거성 평가 26개 주장으로 작습니다. 무료 등급 한도 때문에 챗봇 근거성은 답변 모델과 같은 모델이 채점했습니다.
- 데이터: 영어 아마존 리뷰를 썼고, 사이즈 정보는 요약한 200개 상품에만 있습니다.
- 웹 데모는 서버 없이 정적으로 동작합니다. 챗봇은 05 노트북에서 실제로 나눈 대화를 재생하고, 직접 입력하면 키워드 규칙으로 만든 오프라인 응답을 보여줍니다. 다음 단계로 FastAPI 서버를 붙여 실시간으로 동작하게 할 예정입니다.

## 폴더 구조

```
fashion-ai-assistant/
├─ notebooks/                    # Colab 노트북
│  ├─ 01_data_eda.ipynb
│  ├─ 02_recommendation.ipynb
│  ├─ 03_semantic_search.ipynb
│  ├─ 04_review_summary.ipynb
│  ├─ 05_rag_chatbot.ipynb
│  └─ 06_export_demo_data.ipynb  # 결과를 웹용 JSON으로 내보내기
├─ web/                          # Next.js 15 쇼핑몰 (정적 export)
│  ├─ src/app/                   # 홈, 상품 상세 페이지
│  ├─ src/components/            # 상품 카드, 필터, 리뷰 요약, AI 스타일리스트 채팅
│  ├─ src/data/                  # 06 노트북이 만든 JSON (products, chat-demos, metrics, meta)
│  └─ scripts/make_sample_data.py  # 화면 개발용 샘플 데이터
└─ .github/workflows/deploy-web.yml  # main에 push하면 GitHub Pages로 배포
```

## 웹 실행

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ 폴더에 정적 사이트 생성
```

### 실제 데이터로 바꾸기

1. Colab에서 `notebooks/06_export_demo_data.ipynb` 실행 → `web_data.zip` 다운로드
2. 압축을 풀어 JSON 4개를 `web/src/data/`에 덮어쓰기
3. `npm run build`로 확인 후 커밋

### GitHub Pages 배포

저장소 **Settings → Pages → Source**를 **GitHub Actions**로 바꾼 뒤 `main`에 push하면 자동으로 배포됩니다.
저장소 이름이 경로(`/fashion-ai-assistant`)로 자동 설정됩니다.

## 기술 스택

- 데이터 · 모델: Python, pandas, scipy, implicit(ALS), sentence-transformers(multilingual-e5-base), FAISS, rank-bm25
- LLM: Gemini API (gemini-3.5-flash-lite, gemini-3.8-flash), Pydantic 구조화 출력
- 웹: Next.js 15 (App Router, static export), React 19, TypeScript, Tailwind CSS 4
