/* resize */
const sidebar = document.querySelector(".sidebar");
const resizer = document.querySelector(".resizer");
const editor = document.querySelector(".editor");

let isResizing = false;

// 드래그 시작
resizer.addEventListener("mousedown", (e) => {
  e.preventDefault(); // 텍스트 선택 방지
  isResizing = true;
  document.body.style.cursor = "col-resize";

  // 드래그 중 선택 방지
  document.body.style.userSelect = "none";
});

// 드래그 중
document.addEventListener("mousemove", (e) => {
  if (!isResizing) return;

  const newWidth = e.clientX;
  const minWidth = 245;
  const maxWidth = 475;

  if (newWidth >= minWidth && newWidth <= maxWidth) {
    sidebar.style.width = `${newWidth}px`;
  }
});

// 드래그 종료
document.addEventListener("mouseup", () => {
  if (isResizing) {
    isResizing = false;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }
});

/* document CRUD */
