// DOM 관련 변수
const $editorContent = document.querySelector(".editor-content")

// 라우팅 관련
function render() {
    const pathname = window.location.pathname

    if (pathname === "/") {
        $editorContent.textContent = "홈"
    } else if (path.startsWith("/documents/")) {
        $editorContent.textContent = "문서"
    }
}

window.addEventListener("popstate", render)
