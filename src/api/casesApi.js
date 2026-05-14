import { request } from './http.js'

const tokenStorageKey = 'proofpack_token'

function getStoredToken() {
  return window.localStorage.getItem(tokenStorageKey) ?? ''
}

export async function getCases() {
  const payload = await request('/api/cases', {
    method: 'GET',
    token: getStoredToken()
  })

  return payload.cases
}

export async function createCase(casePayload) {
  const payload = await request('/api/cases', {
    method: 'POST',
    token: getStoredToken(),
    body: casePayload
  })

  return payload.case
}

export async function updateCase(caseId, casePayload) {
  const payload = await request(`/api/cases/${caseId}`, {
    method: 'PUT',
    token: getStoredToken(),
    body: casePayload
  })

  return payload.case
}

export async function deleteCase(caseId) {
  return request(`/api/cases/${caseId}`, {
    method: 'DELETE',
    token: getStoredToken()
  })
}

export async function createDocument(caseId, documentPayload) {
  const payload = await request(`/api/cases/${caseId}/documents`, {
    method: 'POST',
    token: getStoredToken(),
    body: documentPayload
  })

  return payload.case
}

export async function updateDocument(caseId, documentId, documentPayload) {
  const payload = await request(`/api/cases/${caseId}/documents/${documentId}`, {
    method: 'PUT',
    token: getStoredToken(),
    body: documentPayload
  })

  return payload.case
}

export async function deleteDocument(caseId, documentId) {
  const payload = await request(`/api/cases/${caseId}/documents/${documentId}`, {
    method: 'DELETE',
    token: getStoredToken()
  })

  return payload.case
}
