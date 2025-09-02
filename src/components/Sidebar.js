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


/* ------------------------------------------------------------ */
const sidebarTree = document.querySelector(".document-tree");
const createRootBtn = document.getElementById("create-root-btn");
const username = "nygkshpdh";

/* -------------------------------------------- */
/*    1. fetch 사용                             */
/* -------------------------------------------- */
async function fetchDocuments() {
    const res = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
        headers: { "x-username": username },
    });
    return await res.json();
}

async function createDocument(title, parent = null) {
    const res = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
        method: "POST",
        headers: {
        "x-username": username,
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, parent }),
    });
    return await res.json();
}

async function deleteDocument(id) {
    const res = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
        method: "DELETE",
        headers: {
        "x-username": username,
        },
    });
    return await res.json();
}

/* -------------------------------------------- */
/*    2. 루트 Document 생성                      */
/* -------------------------------------------- */
createRootBtn.addEventListener("click", async () => {
    const newDoc = await createDocument("새 문서", null);
    loadTree();
    openDocument(newDoc.id);
    console.log("성공");
});

// 토글 동작 함수
function toggleChildren(ul, toggleBtn) {
  const isClosed = ul.style.display === "none";
  ul.style.display = isClosed ? "block" : "none";
  toggleBtn.textContent = isClosed ? "▼" : "▶";
  toggleBtn.style.fontSize = isClosed ? "1rem" : "0.9rem";
}

/* -------------------------------------------- */
/*    3. 트리 렌더링 (재귀)                      */
/* -------------------------------------------- */

function renderTree(documents, parentElement = sidebarTree, depth = 0) {
    parentElement.innerHTML = "";

    documents.forEach((doc) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.flexDirection = "column";

    const titleDiv = document.createElement("div");
    titleDiv.className = "title-div";
    titleDiv.style.display = "flex";
    titleDiv.style.alignItems = "center";
    titleDiv.style.justifyContent = "space-between";
    titleDiv.style.padding = "5px 6px";
    titleDiv.style.width = "100%";
    li.appendChild(titleDiv);

    const titleGroup = document.createElement("div");
    titleGroup.style.display = "flex";
    titleGroup.style.alignItems = "center";
    titleDiv.appendChild(titleGroup);

    // 여백
    const indent = document.createElement("span");
    indent.style.display = "inline-block";
    indent.style.width = `${depth * 8}px`;
    indent.style.flex = "0 0 auto";
    titleGroup.appendChild(indent);

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "toggle-btn";
    toggleBtn.type = "button";
    toggleBtn.textContent = "▶";
    toggleBtn.style.marginRight = "6px";
    toggleBtn.style.fontSize = "0.9rem";
    toggleBtn.style.lineHeight = "1";
    titleGroup.appendChild(toggleBtn);

    const titleSpan = document.createElement("span");
    titleSpan.textContent = doc.title;
    titleSpan.style.cursor = "pointer";
    titleSpan.style.fontSize = "14px";
    titleSpan.addEventListener("click", () => openDocument(doc.id));
    titleGroup.appendChild(titleSpan);

    const btnGroup = document.createElement("div");
    btnGroup.style.display = "flex";
    btnGroup.style.alignItems = "center";

    const addBtn = document.createElement("button");
    addBtn.textContent = "+";
    addBtn.style.width = "20px";
    addBtn.style.height = "20px";
    addBtn.className = "add-btn";
    addBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const newDoc = await createDocument("새 문서", doc.id);
        await loadTree(newDoc);
    });
    btnGroup.appendChild(addBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.style.marginLeft = "5px";
    deleteBtn.style.width = "20px";
    deleteBtn.style.height = "20px";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await deleteDocument(doc.id);
        loadTree();
    });
    btnGroup.appendChild(deleteBtn);

    titleDiv.appendChild(btnGroup);

    // 하위 페이지 컨테이너
    const ul = document.createElement("ul");
    ul.style.display = "none";
    ul.style.paddingLeft = "0px";
    ul.style.margin = "0";
    ul.style.listStyle = "none";

    if (doc.documents && doc.documents.length > 0) {
        renderTree(doc.documents, ul, depth + 1);
    } else {
        const emptyLi = document.createElement("li");
        emptyLi.className = "emptyLi"
        emptyLi.textContent = "하위페이지 없음";
        emptyLi.style.color = "#aeaeae";
        emptyLi.style.fontSize = "1.4rem";
        emptyLi.style.padding = "6px 6px";
        emptyLi.style.textAlign = "center";
        ul.appendChild(emptyLi);
    }
    li.appendChild(ul);

    // 토글 동작
    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleChildren(ul, toggleBtn);
    });

    // 행 전체 클릭 시에도 토글
    titleDiv.addEventListener("click", (e) => {
      // 오른쪽 add/delete 버튼 누를 때는 제외
        if (e.target.closest(".add-btn") || e.target.closest(".delete-btn")) {
            return; 
        }
        toggleChildren(ul, toggleBtn);
    });

    parentElement.appendChild(li);
    });
}

/* -------------------------------------------- */
/*   4. 초기 로드                                */
/* -------------------------------------------- */
async function loadTree(targetDocId = null) {
    const documents = await fetchDocuments();
    renderTree(documents);
    
    // targetDocId가 있으면 문서 열기
    if (targetDocId) {
        openDocument(targetDocId);
    }
}

loadTree();
