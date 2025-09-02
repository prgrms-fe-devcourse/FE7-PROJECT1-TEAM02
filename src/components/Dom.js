export class Dom {
  constructor(tag, className, content = "") {
    this.el = document.createElement(tag);
    if (className) this.el.className = className;

    // input/textarea 초기값은 value로
    if (tag === "input" || tag === "textarea") {
      if (content) this.el.value = content;
    } else if (content) {
      this.el.textContent = content;
    }
  }

  append(child) {
    const node = child && child.el ? child.el : child; // ← Dom 인스턴스면 .el 사용
    this.el.append(node);
  }

  appendChild(child) {
    const node = child && child.el ? child.el : child;
    this.el.appendChild(node);
  }
}