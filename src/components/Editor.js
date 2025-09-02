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
    }

    update(data = {}) {
        const { title, content } = data

        if (typeof title !== "undefined") {
            const t = title ?? ""
            this.pageTitle.el.value = t
            this.pageHeaderTitle.el.textContent = t || "제목"
            document.title = (t || "Untitled") + " — Notion Clone"
        }

        if (typeof content !== "undefined") {
            const c = content ?? ""
            if (c === "") {
                this.introduce.el.innerHTML = ""
            } else {
                this.introduce.el.textContent = c
            }
        }
    }

    getValue() {
        return {
            title: this.pageTitle.el.value ?? "",
            content: this.introduce.el.textContent ?? "",
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
    }
}

export async function EditPage(containerEl, id) {
    // 1) 기본 골격은 Page가 만든다
    const data = await getDocument(id)
    const page = new Page(containerEl)
    page.update(data)

    const debounced = debounce(async ({ title, content }) => {
        // onChange가 있으면 호출(예: PUT 저장)
        if (typeof onChange === "function") {
            try {
                await updateDocument(id, { title, content })
                // ex) 저장 상태 UI가 있다면 여기서 "저장 완료" 갱신
            } catch (e) {
                console.error("autosave failed:", e)
                // ex) "저장 실패" 표시
            }
        } else {
            // onChange 미지정 시, 콘솔로만 확인
            console.log("debounced change:", { id, title, content })
        }
    }, wait)

    // 입력 이벤트에 디바운스 콜백 바인딩
    page.bindOnChange(debounced)
    return {
        page,
        elements: {
            titleInput: titleInput.el,
            contentArea: contentArea.el,
        },
        get value() {
            return { title: titleInput.el.value, content: contentArea.el.value }
        },
    }
}
