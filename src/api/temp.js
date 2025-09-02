export async function getDocument(documentId) {
    try {
        const response = await fetch(
            `https://kdt-api.fe.dev-cos.com/documents/${documentId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-username": "nygkshpdh", // 반드시 필요
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
            `https://kdt-api.fe.dev-cos.com/documents/documents/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-username": "nygkshpdh",
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
