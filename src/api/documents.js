const username = "nygkshpdh" // 사용자명

// 모든 문서 가져오기
export async function fetchDocuments() {
    const res = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
        headers: { "x-username": username },
    })
    return await res.json()
}

// 단일 문서 내용 가져오기
export async function fetchDocumentContent(id) {
    const res = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
        headers: { "x-username": username },
    })
    return await res.json()
}

// 문서 생성
export async function createDocument(title, parent = null) {
    const res = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
        method: "POST",
        headers: { "x-username": username, "Content-Type": "application/json" },
        body: JSON.stringify({ title, parent }),
    })
    return await res.json()
}

// 문서 삭제
export async function deleteDocument(id) {
    const res = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
        method: "DELETE",
        headers: { "x-username": username },
    })
    return await res.json()
}

export async function getDocument(documentId) {
    try {
        const response = await fetch(
            `https://kdt-api.fe.dev-cos.com/documents/${documentId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-username": username,
                },
            },
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Document:", data)
        return data
    } catch (error) {
        console.error("Failed to fetch document:", error)
    }
}

export async function updateDocument(id, { title, content }) {
    try {
        const res = await fetch(
            `https://kdt-api.fe.dev-cos.com/documents/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-username": username,
                },
                body: JSON.stringify({ title, content }),
            },
        )
        if (!res.ok) throw new Error(`PUT /documents/${id} ${res.status}`)
        return res.json()
    } catch (error) {
        console.error("Failed to fetch document:", error)
    }
}
