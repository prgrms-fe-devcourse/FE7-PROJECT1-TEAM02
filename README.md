# 노션 클로닝 프로젝트 (Vanilla JS) - TEAM02 전공무관

바닐라 JavaScript만 사용하여 노션(Notion)과 유사한 문서 편집/트리 UI를 구현합니다. History API로 SPA를 구성하고, 자동 저장(Auto‑save)과 트리 렌더링을 지원합니다.



# 목표

문서(Document) 트리: 좌측 사이드바에 루트 문서와 하위 문서를 트리로 렌더링

문서 편집기: 우측 영역에서 선택한 문서를 실시간 편집

자동 저장: 저장 버튼 없이 일정 간격/디바운스로 서버 저장

SPA 라우팅: History API로 /documents/:id 진입 시 해당 문서 로딩

API 연동: 제공된 REST API 사용 (모든 요청에 x-username 헤더 필수)

# 실행 방법
```
npm install             # 의존성 설치
npm run dev             # live-server index.html entry로 실행
```

# 폴더 구조
```
├─ index.html
├─ src/
│  ├─ index.js            # 앱 초기화
│  ├─ router.js           # History API 라우터
│  ├─ api/
│  │  └─ documents.js     # fetch 래퍼 및 문서 API 함수들
│  ├─ components/
│  │  ├─ Sidebar.js       # 트리 사이드바(루트/하위 문서 렌더)
│  │  └─ Editor.js        # 문서 편집기(Textarea or contentEditable)
│  ├─ utils/
│  │  ├─ debounce.js      # 디바운스 유틸(자동 저장용)
│  └─ styles/
│     └─ main.css
├─ README.md
├─ eslintrc.json          # eslint 설정 파일
└─ .prettierrc          # prettier 설정 파일

```
### 디렉터리 가이드
src/api: 외부 통신만. 컴포넌트 로직/DOM 접근 금지.

src/router: URL ↔ 화면 동기화만. 컴포넌트 직접 참조 금지.

src/components: 화면 조각. 입출력(파라미터/이벤트) 명확히.

src/styles: reset/normalize 후 공통 유틸과 레이아웃 우선.



# 커밋 메시지 컨벤션
<type>: <짧은 설명> (선택: #이슈번호)
feat: 사용자 기능 추가

fix: 버그 수정

chore: 설정/빌드/보일러플레이트

style: 코드 스타일(동작 무관)

refactor: 리팩토링

docs: 문서 변경

test: 테스트



# PR 규칙
PR 제목: [Feature] ..., [Fix] ..., [Chore] ...

본문 끝에 Closes #이슈번호로 자동 종료 연결

# 기능
좌측 트리: 루트/하위 문서 렌더, 각 문서 우측 + 로 하위 문서 생성

우측 편집기: 제목/내용 입력 시 디바운스 자동 저장

라우팅: /(미선택), /documents/:id(문서 로드), 뒤/앞 이동 지원



# API
API (모든 요청 헤더)

```
'x-username': '<고유 사용자명>' // nygkshpdh
```

GET  /documents                    : 루트 트리

GET  /documents/{id}               : 문서 상세

POST /documents                    : 생성 { title, parent|null }

PUT  /documents/{id}               : 수정 { title?, content? }

DELETE /documents/{id}             : 삭제(자식은 루트로 승격)
