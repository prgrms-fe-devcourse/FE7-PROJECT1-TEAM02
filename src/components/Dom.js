export class Dom {
  constructor(tag, className, content = "") {
    this.el = document.createElement(tag);
    if (className) this.el.className = className;
    if (tag === "input" || tag === "textarea") {
      if (content) this.el.value = content;
    } else if (content) {
      this.el.textContent = content;
    }
  }

  append(child) {
    const node = child && child.el ? child.el : child; 
    this.el.append(node);
  }

  appendChild(child) {
    const node = child && child.el ? child.el : child;
    this.el.appendChild(node);
  }
}