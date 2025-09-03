export function formatRelative(from, to = new Date()) {
    const diff = Math.max(0, Math.floor((to - from) / 1000))
    if (diff < 5) return "방금 전"
    if (diff < 60) return `${diff}초 전`
    const m = Math.floor(diff / 60)
    if (m < 60) return `${m}분 전`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}시간 전`
    const d = Math.floor(h / 24)
    if (d === 1) return "어제"
    return `${d}일 전`
}
