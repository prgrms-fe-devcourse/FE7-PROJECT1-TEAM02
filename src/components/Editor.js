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
        this.pageTitle.el.setAttribute("id", "page-title")
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
        this.pageHeaderTitle.el.addEventListener("click", () =>
            this._toggleTitleModal(),
        )
        this._commitTitleFromModal = () => {
            const next = inputEl.textContent.trim()
            this.pageTitle.el.value = next
            this._applyTitleSync()
            this.pageTitle.el.dispatchEvent(
                new Event("input", { bubbles: true }),
            )
            if (this._docId)
                this._emitTitleChange(this._docId, next || "제목 없음")
        }
        this.pageTitle.el.addEventListener("input", () => {
            if (this._docId) {
                const t = (this.pageTitle.el.value || "").trim() || "제목 없음"
                this._emitTitleChange(this._docId, t)
            }
        })
    }

    setEditedAt(date) {
        this._editedAt = date instanceof Date ? date : new Date(date)
        this._refreshEditedTimeLabel()
        this._startEditedTicker()
    }

    _emitTitleChange(id, title) {
        window.dispatchEvent(
            new CustomEvent("doc:title-change", { detail: { id, title } }),
        )
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

    _toggleTitleModal() {
        if (this._titleModalOpen) {
            this._closeTitleModal()
        } else {
            this._openTitleModal()
        }
    }
    _openTitleModal() {
        this._titleModalOpen = true

        this._modal = document.createElement("div")
        this._modal.className = "title-modal"

        const pageSvg = `<svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16.2"
        height="16.2"
        fill="rgba(71, 70, 68, 0.6)"
        aria-hidden="true"
        role="img">
        <path d="M4.35645 15.4678H11.6367C13.0996 15.4678 13.8584 14.6953 13.8584 13.2256V7.02539C13.8584 6.0752 13.7354 5.6377 13.1406 5.03613L9.55176 1.38574C8.97754 0.804688 8.50586 0.667969 7.65137 0.667969H4.35645C2.89355 0.667969 2.13477 1.44043 2.13477 2.91016V13.2256C2.13477 14.7021 2.89355 15.4678 4.35645 15.4678ZM4.46582 14.1279C3.80273 14.1279 3.47461 13.7793 3.47461 13.1436V2.99219C3.47461 2.36328 3.80273 2.00781 4.46582 2.00781H7.37793V5.75391C7.37793 6.73145 7.86328 7.20312 8.83398 7.20312H12.5186V13.1436C12.5186 13.7793 12.1836 14.1279 11.5205 14.1279H4.46582ZM8.95703 6.02734C8.67676 6.02734 8.56055 5.9043 8.56055 5.62402V2.19238L12.334 6.02734H8.95703Z"/>
        </svg>`

        this._modal.innerHTML = `
            <div class="title-modal_icon">${pageSvg}</div>
            <div class="title-modal_input" contenteditable="true"></div>
        `

        const inputEl = this._modal.querySelector(".title-modal_input")
        const currentTitle = (this.pageTitle.el.value || "").trim()

        inputEl.textContent = ""
        inputEl.setAttribute("data-placeholder", currentTitle || "제목 없음")
        inputEl.focus()
        this.pageHeaderTitle.el.insertAdjacentElement("afterend", this._modal)

        this._commitTitleFromModal = () => {
            const next = inputEl.textContent.trim()
            this.pageTitle.el.value = next
            this._applyTitleSync()

            this.pageTitle.el.dispatchEvent(
                new Event("input", { bubbles: true }),
            )
        }

        this._handleModalKeydown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                this._commitTitleFromModal()
                this._closeTitleModal()
            } else if (e.key === "Escape") {
                this._closeTitleModal()
            }
        }
        inputEl.addEventListener("keydown", this._handleModalKeydown)

        this._handleModalBlur = (e) => {
            this._commitTitleFromModal()
            this._closeTitleModal()
        }
        inputEl.addEventListener("blur", this._handleModalBlur)

        this._handleOutsideClick = (evt) => {
            if (
                !this._modal.contains(evt.target) &&
                !this.pageHeaderTitle.el.contains(evt.target)
            ) {
                this._closeTitleModal()
            }
        }

        this._handleEsc = (evt) => {
            if (evt.key === "Escape") this._closeTitleModal()
        }

        setTimeout(() => {
            document.addEventListener("mousedown", this._handleOutsideClick)
            document.addEventListener("keydown", this._handleEsc)
        }, 0)
    }

    _closeTitleModal() {
        this._titleModalOpen = false
        document.removeEventListener("mousedown", this._handleOutsideClick)
        document.removeEventListener("keydown", this._handleEsc)

        if (this._modal?.parentNode)
            this._modal.parentNode.removeChild(this._modal)
        this._modal = null
    }

    _emitTitleChange(id, title) {
        window.dispatchEvent(
            new CustomEvent("doc:title-change", { detail: { id, title } }),
        )
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
        if (this._applyTitleSync) {
            this.pageTitle.el.removeEventListener("input", this._applyTitleSync)
        }
        this._stopEditedTicker()
    }
}

export async function EditPage(containerEl, id, { wait = 700, onChange } = {}) {
    const data = await getDocument(id)
    const page = new Page(containerEl)
    page._docId = id
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
