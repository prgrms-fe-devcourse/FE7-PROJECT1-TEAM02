import {
    fetchDocuments,
    fetchDocumentContent,
    createDocument,
    deleteDocument,
} from "../api/documents.js"
import { navigateTo } from "../router.js"

/* sidebar hide */
const sidebar = document.querySelector(".sidebar")
const openBtn = document.querySelector(".open-btn")
const resizer = document.querySelector(".resizer")
const hideBtn = document.querySelector(".hide-btn")
hideBtn.addEventListener("click", (e) => {
    e.preventDefault()
    sidebar.style.display = "none"
    resizer.style.display = "none"
    openBtn.style.display = "block"
})

openBtn.addEventListener("click", (e) => {
    e.preventDefault()
    sidebar.style.display = "block"
    resizer.style.display = "block"
    openBtn.style.display = "none"
})

/* resize */
let isResizing = false

// 드래그 시작
resizer.addEventListener("mousedown", (e) => {
    e.preventDefault()
    isResizing = true
    document.body.style.cursor = "col-resize"

    // 드래그 중 선택 방지
    document.body.style.userSelect = "none"
})

// 드래그 중
document.addEventListener("mousemove", (e) => {
    if (!isResizing) return

    const newWidth = e.clientX
    const minWidth = 245
    const maxWidth = 475

    if (newWidth >= minWidth && newWidth <= maxWidth) {
        sidebar.style.width = `${newWidth}px`
    }
})

// 드래그 종료
document.addEventListener("mouseup", () => {
    if (isResizing) {
        isResizing = false
        document.body.style.cursor = "default"
        document.body.style.userSelect = "auto"
    }
})

/* ------------------------------------------------------------ */
const sidebarTree = document.querySelector(".document-tree")
const createRootBtn = document.getElementById("create-root-btn")

/* -----------------문서 열기------------------- */
async function openDocument(id) {
    const doc = await fetchDocumentContent(id)

    console.log(doc)
    navigateTo(`/documents/${id}`)
}

/* --------------활성 문서 표시----------------- */
function setActiveDocumentLi(id) {
    document
        .querySelectorAll(".title-div")
        .forEach((div) => div.classList.remove("on"))
    const li = sidebarTree.querySelector(`[data-id='${id}']`)
    if (li) li.querySelector(".title-div").classList.add("on")
}

/* -------------------토글--------------------- */
function toggleChildren(ul, toggleBtn) {
    const isClosed = ul.style.display === "none"
    ul.style.display = isClosed ? "block" : "none"
    toggleBtn.style.fontSize = isClosed ? "1rem" : "0.8rem"
}

/* -------------------검색--------------------- */
const searchFeature = document.querySelector(".sidebar-feature.search")
const searchPopup = document.querySelector(".search-popup")

searchFeature.addEventListener("click", (e) => {
    e.stopPropagation()
    searchPopup.style.display =
        searchPopup.style.display === "block" ? "none" : "block"
    if (searchPopup.style.display === "block") {
        searchInput.focus()
        renderSearchResults(cachedDocuments)
    }
})

// 검색 팝업 내부 HTML
searchPopup.innerHTML = `
    <input id="search-input" type="text" placeholder="제목 검색..." />
    <ul class="search-results"></ul>
`

const searchInput = searchPopup.querySelector("input")
const searchResults = searchPopup.querySelector(".search-results")

// 문서 데이터 가져오기
let cachedDocuments = []

async function cacheDocuments() {
    cachedDocuments = await fetchDocuments()
}

cacheDocuments()

// 결과 렌더링 함수
function renderSearchResults(docs, term = "") {
    searchResults.innerHTML = ""

    const results = []

    function flatten(docs) {
        for (const doc of docs) {
            results.push(doc)
            if (doc.documents) flatten(doc.documents)
        }
    }

    flatten(docs)

    const filtered = term
        ? results.filter((doc) =>
              doc.title.toLowerCase().includes(term.toLowerCase()),
          )
        : results

    filtered.forEach((doc) => {
        const li = document.createElement("li")
        li.textContent = doc.title
        li.dataset.id = doc.id
        li.addEventListener("click", () => {
            searchInput.value = doc.title
            searchPopup.style.display = "none"
            openDocument(doc.id)
            setActiveDocumentLi(doc.id)
        })
        searchResults.appendChild(li)
    })
}

// 입력 시 필터링
searchInput.addEventListener("input", (e) => {
    const term = e.target.value.trim()
    renderSearchResults(cachedDocuments, term)
})

// 외부 클릭 시 팝업 닫기
document.addEventListener("mousedown", (e) => {
    if (!searchPopup.contains(e.target) && !searchFeature.contains(e.target)) {
        searchPopup.style.display = "none"
    }
})

/* -------------------------------------------- */
/*    1. 트리 렌더링                             */
/* -------------------------------------------- */

function renderTree(documents, parentElement = sidebarTree, depth = 0) {
    parentElement.innerHTML = ""

    documents.forEach((doc) => {
        const li = document.createElement("li")
        li.setAttribute("data-id", doc.id)
        li.style.display = "flex"
        li.style.flexDirection = "column"

        const titleDiv = document.createElement("div")
        titleDiv.className = "title-div"
        titleDiv.style.display = "flex"
        titleDiv.style.alignItems = "center"
        titleDiv.style.justifyContent = "space-between"
        titleDiv.style.padding = "5px 6px"
        titleDiv.style.width = "100%"
        titleDiv.addEventListener("click", () => {
            setActiveDocumentLi(doc.id)
            openDocument(doc.id)
        })
        li.appendChild(titleDiv)

        const titleGroup = document.createElement("div")
        titleGroup.style.display = "flex"
        titleGroup.style.alignItems = "center"
        titleDiv.appendChild(titleGroup)

        // 여백
        const indent = document.createElement("span")
        indent.style.display = "inline-block"
        indent.style.width = `${depth * 8}px`
        indent.style.flex = "0 0 auto"
        titleGroup.appendChild(indent)

        const toggleBtn = document.createElement("button")
        toggleBtn.className = "toggle-btn"
        toggleBtn.type = "button"
        toggleBtn.style.marginRight = "6px"
        toggleBtn.style.fontSize = "0.8rem"
        toggleBtn.style.lineHeight = "1"
        toggleBtn.style.width = "21px"
        toggleBtn.style.height = "21px"
        toggleBtn.style.borderRadius = "4px"
        titleGroup.appendChild(toggleBtn)

        const titleSpan = document.createElement("span")
        titleSpan.textContent = doc.title
        titleSpan.style.cursor = "pointer"
        titleSpan.style.fontSize = "14px"
        titleGroup.appendChild(titleSpan)

        const btnGroup = document.createElement("div")
        btnGroup.style.display = "flex"
        btnGroup.style.alignItems = "center"

        const addBtn = document.createElement("button")
        addBtn.style.width = "20px"
        addBtn.style.height = "20px"
        addBtn.style.borderRadius = "4px"
        addBtn.className = "add-btn"
        addBtn.addEventListener("click", async (e) => {
            e.stopPropagation()
            const newDoc = await createDocument("새 문서", doc.id)
            await loadTree(newDoc.id)

            const li = sidebarTree.querySelector(`[data-id='${newDoc.id}']`)
            if (li) {
                const parentUl = li.parentElement
                if (parentUl.tagName === "UL") {
                    parentUl.style.display = "block"

                    const toggleBtn =
                        parentUl.previousElementSibling?.querySelector(
                            ".toggle-btn",
                        )
                    if (toggleBtn) toggleBtn.style.transform = "rotate(90deg)"
                }
            }
            openDocument(newDoc.id)
        })
        btnGroup.appendChild(addBtn)

        const deleteBtn = document.createElement("button")
        deleteBtn.style.marginLeft = "5px"
        deleteBtn.style.width = "20px"
        deleteBtn.style.height = "20px"
        deleteBtn.style.borderRadius = "4px"
        deleteBtn.className = "delete-btn"
        deleteBtn.addEventListener("click", async (e) => {
            e.stopPropagation()
            if (!confirm("정말 삭제하시겠습니까?")) return
            else {
                await deleteDocument(doc.id)
            }
            loadTree()
        })
        btnGroup.appendChild(deleteBtn)

        titleDiv.appendChild(btnGroup)

        // 하위 페이지 컨테이너
        const ul = document.createElement("ul")
        ul.style.display = "none"
        ul.style.paddingLeft = "0px"
        ul.style.margin = "0"
        ul.style.listStyle = "none"

        if (doc.documents && doc.documents.length > 0) {
            renderTree(doc.documents, ul, depth + 1)
        } else {
            const emptyLi = document.createElement("li")
            emptyLi.className = "emptyLi"
            emptyLi.textContent = "하위페이지 없음"
            emptyLi.style.color = "#aeaeae"
            emptyLi.style.fontSize = "1.4rem"
            emptyLi.style.padding = "6px 6px"
            emptyLi.style.textAlign = "center"
            ul.appendChild(emptyLi)
        }
        li.appendChild(ul)

        // 토글 회선 각 구하기
        function getRotationDegrees(element) {
            const style = window.getComputedStyle(element)
            const transform = style.getPropertyValue("transform")

            if (transform === "none") return 0

            const values = transform.split("(")[1].split(")")[0].split(",")
            const a = values[0]
            const b = values[1]
            const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))

            return angle < 0 ? angle + 360 : angle
        }
        // 토글 동작
        toggleBtn.addEventListener("click", (e) => {
            e.stopPropagation()

            let currentAngle = getRotationDegrees(toggleBtn)
            if (currentAngle === 90) {
                toggleBtn.style.transform = "rotate(0deg)"
            } else {
                toggleBtn.style.transform = "rotate(90deg)"
            }

            toggleChildren(ul, toggleBtn)
        })

        parentElement.appendChild(li)
    })
}

/* -------------------------------------------- */
/*    2. 루트 Document 생성                      */
/* -------------------------------------------- */
createRootBtn.addEventListener("click", async () => {
    const newDoc = await createDocument("새 문서", null)
    await loadTree(newDoc.id)
    openDocument(newDoc.id)
})

/* -------------------------------------------- */
/*   3. 초기 로드                                */
/* -------------------------------------------- */
export async function loadTree(targetDocId = null) {
    const documents = await fetchDocuments()
    renderTree(documents)
    if (targetDocId) setActiveDocumentLi(targetDocId)
}

window.addEventListener("doc:title-change", (e) => {
    const { id, title } = e.detail
    const items = document.querySelectorAll(`li[data-id="${id}"]`)

    items.forEach((li) => {
        const titleSpan = li.querySelector(
            ".title-div > div:first-child .toggle-btn + span",
        )
        if (titleSpan) {
            titleSpan.textContent = title || "제목"
            titleSpan.setAttribute("title", title || "제목")
        }
    })
})

/* 다크 모드 기능 */
const darkModeBtn = document.getElementById("darkmode-btn")

if (localStorage.getItem("dark-mode") === "true") {
    document.body.classList.add("dark-mode")
}

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")
    const isDark = document.body.classList.contains("dark-mode")
    localStorage.setItem("dark-mode", isDark)
})

const homeBtn = document.querySelector('.sidebar-feature_home');

if (homeBtn) {
  homeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/'); 
  });
}

loadTree()

