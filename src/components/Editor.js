import { Dom } from "./Dom.js"
import { getDocument, updateDocument } from "/src/api/temp.js"
import { debounce } from "../utils/debounce.js"

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
        this.pageHeaderTitle = new Dom("div", "page-header_title", "제목")

        this.pageMain = new Dom("div", "page-main")
        this.pageTitle = new Dom("input", "page-title")
        this.pageTitle.el.setAttribute("placeholder", "새 페이지")

        this.pageMenus = new Dom("div", "page-menus")
        this.pageIcon = new Dom("div", "page-icon", "아이콘 추가")

        this.introduce = new Dom("div", "page-introduce")
        this.introduce.el.setAttribute(
            "data-placeholder",
            "AI 기능을 사용하려면 입력 후 스페이스 키를 누르세요. 명령어 사용 시에는 '/'를 누르세요...",
        )
        this.introduce.el.setAttribute("contenteditable", "true")

        this.header.append(this.pageHeaderTitle)
        this.pageMenus.append(this.pageIcon)
        this.page.append(this.header)
        this.pageMain.append(this.pageMenus)
        this.pageMain.append(this.pageTitle)
        this.pageMain.append(this.introduce)
        this.page.append(this.pageMain)
        this.main.append(this.page)

        // ✅ 입력 변화 → 헤더/탭 제목 즉시 동기화
        this._applyTitleSync = () => {
            const t = (this.pageTitle.el.value || "").trim()
            this.pageHeaderTitle.el.textContent = t || "제목"
            document.title = (t || "Untitled") + " — Notion Clone"
        }
        this.pageTitle.el.addEventListener("input", this._applyTitleSync)
    }

    update(data = {}) {
        const { title, content } = data
        if (typeof title !== "undefined") {
            this.pageTitle.el.value = title ?? ""
            this._applyTitleSync() // ✅ 프로그램적 변경에도 동기화
        }
        if (typeof content !== "undefined") {
            this.introduce.el.innerHTML = content ?? ""
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
    }
}

export async function EditPage(containerEl, id, { wait = 700, onChange } = {}) {
    // 1) 초기 데이터 로드
    const data = await getDocument(id)

    // 2) 페이지 스켈레톤 렌더 + 초기 값 주입
    const page = new Page(containerEl)
    page.update(data)

    // 3) 디바운스 자동저장
    const debounced = debounce(async ({ title, content }) => {
        try {
            await updateDocument(id, { title, content }) // PUT 호출
            onChange?.({ id, title, content }) // 선택 콜백
            // TODO: 필요하면 저장 상태 UI 갱신 (예: "저장 완료")
        } catch (e) {
            console.error("autosave failed:", e)
            // TODO: "저장 실패" 표시 등
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
