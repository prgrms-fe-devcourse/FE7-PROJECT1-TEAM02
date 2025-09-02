export const debounce = (fn, wait = 700) => {
    let timer = null
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), wait)
    }
}
