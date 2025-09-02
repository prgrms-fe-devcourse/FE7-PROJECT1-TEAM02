export function navigateTo(page) {
    // 브라우저 URL을 변경 (pushState)
    history.pushState({ page }, "", `/${page}`)
    loadContent(page)
}

// 페이지 콘텐츠 로드
export function loadContent(page) {
    const contentDiv = document.getElementById("content")
    contentDiv.innerHTML = "111"
    contentDiv.appendChild(page)
}
