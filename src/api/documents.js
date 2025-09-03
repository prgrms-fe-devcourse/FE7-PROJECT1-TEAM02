const username = "nygkshpdh"   // 사용자명

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
