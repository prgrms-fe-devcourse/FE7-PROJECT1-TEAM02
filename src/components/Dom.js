export class Dom {
    constructor(tag, className, content = "") {
        this.el = document.createElement(tag)
        if (className) this.el.className = className
        if (content) this.el.textContent = content
    }

    append(element) {
        this.el.append(element)
    }

    appendChild(element) {
        this.el.appendChild(element)
    }
}
