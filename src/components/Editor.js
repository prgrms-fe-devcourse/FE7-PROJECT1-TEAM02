import { Dom } from "./Dom.js"
import { $editorContent } from "../index.js"
export class Page {
    constructor() {
        this.main = new Dom("div", "edit-main")
        $editorContent.appendChild(this.main.el)
        this.render()
    }

    render() {
        this.page = new Dom("div", "page")
        this.pageTitle = new Dom("input", "page-title", "제목없음")
        this.pageIcon = new Dom("div", "page-icon", "아이콘 추가")
        this.introduce = new Dom(
            "div",
            "page-introduce",
            "Enter 키를 눌러 빈 페이지로 시작하거나, 원하는 템플릿을 선택하세요.",
        )
        this.page.append(this.pageTitle)
        this.page.append(this.pageIcon)
        this.page.append(this.introduce)
        this.main.append(this.page)
    }
}

export function EditPage() {
    const Page = new Page()
    console.log("EDIT")
}
