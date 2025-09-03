import { Dom } from "./Dom.js"
import { getDocument, updateDocument } from "/src/api/temp.js"
import { debounce } from "../utils/debounce.js"
import { formatRelative } from "../utils/time.js"
export class Page {
    constructor(containerEl) {
        this.containerEl = containerEl
        this.main = new Dom("div", "edit-main")
        this.containerEl.appendChild(this.main.el)
        this.render()
    }

    render() {
        this.page = new Dom("div", "page")

        this.header = new Dom("header", "page-header")
        this.pageHeaderMenus = new Dom("div", "page-header_menus")

        this.pageHeaderTitle = new Dom("div", "page-header_title", "제목")

        this.pageHeaderUser = new Dom(
            "div",
            "page-header_user",
            "전공 무관 페이지",
        )
        const lockSvg = `<svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="16" height="16"
            fill="rgba(81, 73, 60, 0.32)"
            aria-hidden="true" role="img">
        <path d="M6 5.95a4 4 0 1 1 8 0v1.433a2.426 2.426 0 0 1 2.025 2.392v5.4A2.425 2.425 0 0 1 13.6 17.6H6.4a2.425 2.425 0 0 1-2.425-2.425v-5.4c0-1.203.876-2.201 2.025-2.392zm6.75 1.4v-1.4a2.75 2.75 0 1 0-5.5 0v1.4zm-2.2 5.458a1.35 1.35 0 1 0-1.1 0v1.242a.55.55 0 0 0 1.1 0z"/>
        </svg>`
        const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="11"
            height="11"
            fill="rgba(81, 73, 60, 0.32)"
            aria-hidden="true"
            role="img"
            class="arrowChevronSingleDownFill">
        <path d="M9.381 13.619a.875.875 0 0 0 1.238 0l5.4-5.4A.875.875 0 1 0 14.78 6.98L10 11.763 5.219 6.98A.875.875 0 1 0 3.98 8.22z"/>
        </svg>`
        this.pageHeaderUser.el.insertAdjacentHTML("afterbegin", lockSvg)
        this.pageHeaderUser.el.insertAdjacentHTML("beforeend", chevronSvg)
        this.pageHeaderEdittime = new Dom(
            "div",
            "page-header_edittime",
            "편집 기록 없음",
        )

        this.pageMain = new Dom("div", "page-main")
        this.pageTitle = new Dom("input", "page-title")
        this.pageTitle.el.setAttribute("placeholder", "새 페이지")
        this._applyTitleSync = () => {
            const t = (this.pageTitle.el.value || "").trim()
            this.pageHeaderTitle.el.textContent = t || "제목"
            document.title = (t || "Untitled") + " — Notion Clone"
        }
        this.pageTitle.el.addEventListener("input", this._applyTitleSync)
        this.pageMenus = new Dom("div", "page-menus")
        this.pageIcon = new Dom("div", "page-icon", "아이콘 추가")
        const smileSvg = `<svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
            width="14"
            height="14"
            fill="currentColor"
            aria-hidden="true"
            role="img"
            class="addPage">
        <path fill-rule="evenodd" clip-rule="evenodd"
                d="M7 0c3.861 0 7 3.139 7 7s-3.139 7-7 7-7-3.139-7-7 3.139-7 7-7zM3.561 5.295a1.027 1.027 0 1 0 2.054 0 1.027 1.027 0 0 0-2.054 0zm5.557 1.027a1.027 1.027 0 1 1 0-2.054 1.027 1.027 0 0 1 0 2.054zm1.211 2.816a.77.77 0 0 0-.124-1.087.786.786 0 0 0-1.098.107c-.273.407-1.16.958-2.254.958-1.093 0-1.981-.55-2.244-.945a.788.788 0 0 0-1.107-.135.786.786 0 0 0-.126 1.101c.55.734 1.81 1.542 3.477 1.542 1.668 0 2.848-.755 3.476-1.541z"/>
        </svg>`
        this.pageIcon.el.insertAdjacentHTML("afterbegin", smileSvg)
        this.introduce = new Dom("div", "page-introduce")
        this.introduce.el.setAttribute(
            "data-placeholder",
            "AI 기능을 사용하려면 입력 후 스페이스 키를 누르세요. 명령어 사용 시에는 '/'를 누르세요...",
        )
        this.introduce.el.setAttribute("contenteditable", "true")
        this.pageHeaderMenus.append(this.pageHeaderTitle)
        this.pageHeaderMenus.append(this.pageHeaderUser)
        this.header.append(this.pageHeaderMenus)
        this.header.append(this.pageHeaderEdittime)
        this.pageMenus.append(this.pageIcon)

        this._setIcon = (icon) => {
            this.icon = icon || ""
            this.pageIcon.el.textContent = this.icon ? this.icon : "아이콘 추가"

            if (this.icon) {
                this.pageIcon.el.classList.add("has-icon")
            } else {
                this.pageIcon.el.classList.remove("has-icon")
            }
        }

        this.pageIcon.el.addEventListener("click", () => {
            const emoji = window.prompt("이모지를 하나 입력하세요 (예: 😀)", "")
            if (emoji && emoji.trim()) this._setIcon(emoji.trim())
        })

        this.page.append(this.header)
        this.pageMain.append(this.pageMenus)
        this.pageMain.append(this.pageTitle)
        this.pageMain.append(this.introduce)
        this.page.append(this.pageMain)

        this.main.append(this.page)
        this.pageTitle.el.addEventListener("input", this._applyTitleSync)
    }

    setEditedAt(date) {
        this._editedAt = date instanceof Date ? date : new Date(date)
        this._refreshEditedTimeLabel()
        this._startEditedTicker()
    }

    _refreshEditedTimeLabel() {
        const text = this._editedAt
            ? `${formatRelative(this._editedAt)} 편집`
            : "편집 기록 없음"
        this.pageHeaderEdittime.el.textContent = text
    }

    _startEditedTicker() {
        this._stopEditedTicker()
        this._editedTimer = setInterval(
            () => this._refreshEditedTimeLabel(),
            60_000,
        )
    }

    _stopEditedTicker() {
        if (this._editedTimer) {
            clearInterval(this._editedTimer)
            this._editedTimer = null
        }
    }

    update(data = {}) {
        const { title, content, updated_at } = data
        if (typeof title !== "undefined") {
            this.pageTitle.el.value = title ?? ""
            this._applyTitleSync() 
        }
        if (typeof content !== "undefined") {
            this.introduce.el.innerHTML = content ?? ""
        }
        if (typeof updated_at !== "undefined" && updated_at) {
            this.setEditedAt(new Date(updated_at))
        }
    }

    getValue() {
        return {
            title: this.pageTitle.el.value ?? "",
            content: this.introduce.el.innerHTML ?? "",
        }
    }

    bindOnChange(debouncedFn) {
        const onInput = () => debouncedFn(this.getValue())
        this._titleHandler = onInput
        this._contentHandler = onInput
        this.pageTitle.el.addEventListener("input", this._titleHandler)
        this.introduce.el.addEventListener("input", this._contentHandler)
    }

    unbindOnChange() {
        if (this._titleHandler) {
            this.pageTitle.el.removeEventListener("input", this._titleHandler)
            this._titleHandler = null
        }
        if (this._contentHandler) {
            this.introduce.el.removeEventListener("input", this._contentHandler)
            this._contentHandler = null
        }
        // (선택) 입력 동기화 리스너 제거
        if (this._applyTitleSync) {
            this.pageTitle.el.removeEventListener("input", this._applyTitleSync)
        }
        this._stopEditedTicker()
    }
}

export async function EditPage(containerEl, id, { wait = 700, onChange } = {}) {
    const data = await getDocument(id)
    const page = new Page(containerEl)
    page.update(data)

    const debounced = debounce(async ({ title, content }) => {
        try {
            await updateDocument(id, { title, content })
            const res = await updateDocument(id, { title, content })
            onChange?.({ id, title, content })
            if (res?.updated_at) page.setEditedAt(new Date(res.updated_at))
            else page.setEditedAt(new Date())
        } catch (e) {
            console.error("autosave failed:", e)
        }
    }, wait)

    page.bindOnChange(debounced)

    return {
        page,
        elements: {
            titleInput: page.pageTitle.el,
            contentArea: page.introduce.el,
        },
        get value() {
            return page.getValue()
        },
        destroy() {
            page.unbindOnChange()
        },
    }
}
