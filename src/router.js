import { EditPage } from "./components/Editor.js";

const $content = document.getElementById("content");

// 라우팅 처리 함수
function matchRoute(path) {
  if (path === "/") return routes["/"];
  if (path === "/documents") return routes["/documents"];

  // 동적 경로: /documents/:id
  if (path.startsWith("/documents/")) {
    const id = path.split("/")[2]; // "123" 부분 추출
    return () => routes["/documents/:id"](id);
  }

  return routes["/404"];
}

// 라우팅 테이블
const routes = {
  "/": () => {
    $content.innerHTML = "";
  },
  "/documents": () => {
    $content.innerHTML = "<h1>문서 목록</h1>";
    // 예시: 목록을 클릭하면 특정 id 문서로 이동
    const link = document.createElement("a");
    link.href = "/documents/123";
    link.textContent = "문서 123 보기";
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo("/documents/123");
    });
    $content.appendChild(link);
  },
  "/documents/:id": (id) => {
    $content.innerHTML = "";
    // id를 EditPage에 전달 (실제라면 API로 문서 로드)
    EditPage($content, id);
  },
  "/404": () => {
    $content.innerHTML = "<p>404 - 페이지를 찾을 수 없습니다.</p>";
  },
};

export function navigateTo(path) {
  history.pushState({ path }, "", path);
  loadContent(path);
}

export function loadContent(path) {
  const handler = matchRoute(path);
  handler();
}

// popstate
window.addEventListener("popstate", (e) => {
  const path = e.state?.path || "/";
  loadContent(path);
});

// 첫 로딩
window.addEventListener("DOMContentLoaded", () => {
  loadContent(location.pathname);
});