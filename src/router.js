/**
 * SPA 라우터 네비게이션 함수
 *
 * @param {string | number} path - 이동할 경로.
 *   - 문자열: 이동할 URL 경로 (예: "/documents/1")
 *   - 숫자 -1: 브라우저 뒤로 가기
 * @param {boolean} [replace=false] - true면 `replaceState`, false면 `pushState` 사용
 * @returns {void}
 */
export const navigate = (path, replace = false) => {
    if (path === "-1" || path === -1) {
        return window.history.back()
    }

    const url = new URL(path, window.location.origin)

    if (replace) {
        window.history.replaceState({}, "", url)
    } else {
        window.history.pushState({}, "", url)
    }

    window.dispatchEvent(new PopStateEvent("popstate"))
}
