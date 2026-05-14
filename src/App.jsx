import { useEffect, useMemo, useState } from 'react'
import { createCase, createDocument, deleteCase, deleteDocument, getCases, updateCase, updateDocument } from './api/casesApi.js'
import { AuthPanel } from './components/AuthPanel/AuthPanel.jsx'
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader.jsx'
import { FilterBar } from './components/FilterBar/FilterBar.jsx'
import { PackageDetails } from './components/PackageDetails/PackageDetails.jsx'
import { PackageForm } from './components/PackageForm/PackageForm.jsx'
import { PackageList } from './components/PackageList/PackageList.jsx'
import { StatsBar } from './components/StatsBar/StatsBar.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { getDashboardStats, getVisibleCases } from './utils/caseStats.js'
import './App.css'

function App() {
  const {
    authError,
    clearAuthError,
    isAuthenticated,
    isCheckingAuth,
    isSubmittingAuth,
    login,
    logout,
    register,
    user
  } = useAuth()
  const [cases, setCases] = useState([])
  const [selectedCaseId, setSelectedCaseId] = useState('')
  const [editingDocument, setEditingDocument] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [caseTypeFilter, setCaseTypeFilter] = useState('all')
  const [sortMode, setSortMode] = useState('recent')
  const [loadingCases, setLoadingCases] = useState(false)
  const [isSavingCase, setIsSavingCase] = useState(false)
  const [isSavingDocument, setIsSavingDocument] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const selectedCase = useMemo(() => {
    return cases.find((caseItem) => caseItem.id === selectedCaseId) ?? null
  }, [cases, selectedCaseId])

  useEffect(() => {
    if (isAuthenticated) {
      loadCases()
    }
  }, [isAuthenticated])

  const activeDocument = useMemo(() => {
    if (!selectedCase || !editingDocument) {
      return null
    }

    return selectedCase.documents.find((document) => document.id === editingDocument.id) ?? null
  }, [editingDocument, selectedCase])

  async function loadCases(showLoader = true) {
    if (showLoader) {
      setLoadingCases(true)
    }

    try {
      const nextCases = await getCases()
      setCases(nextCases)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.message || 'Unable to open your folder drawer right now.')
    } finally {
      if (showLoader) {
        setLoadingCases(false)
      }
    }
  }

  async function handleSaveCase(formValues) {
    setIsSavingCase(true)
    setErrorMessage('')

    try {
      const savedCase = selectedCase
        ? await updateCase(selectedCase.id, formValues)
        : await createCase(formValues)

      await loadCases(false)
      setSelectedCaseId(savedCase.id)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save the folder cover right now.')
      throw error
    } finally {
      setIsSavingCase(false)
    }
  }

  async function handleDeleteCase(caseId) {
    const confirmed = window.confirm('Delete this folder and every evidence slip inside it?')

    if (!confirmed) {
      return
    }

    try {
      await deleteCase(caseId)
      await loadCases(false)

      if (selectedCaseId === caseId) {
        setSelectedCaseId('')
        setEditingDocument(null)
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to remove this folder right now.')
    }
  }

  async function handleSaveDocument(formValues) {
    if (!selectedCase) {
      return
    }

    setIsSavingDocument(true)
    setErrorMessage('')

    try {
      const updatedCase = editingDocument
        ? await updateDocument(selectedCase.id, editingDocument.id, formValues)
        : await createDocument(selectedCase.id, formValues)

      await loadCases(false)
      setSelectedCaseId(updatedCase.id)
      setEditingDocument(null)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save this evidence slip right now.')
      throw error
    } finally {
      setIsSavingDocument(false)
    }
  }

  async function handleDeleteDocument(documentId) {
    if (!selectedCase) {
      return
    }

    const confirmed = window.confirm('Delete this evidence slip?')

    if (!confirmed) {
      return
    }

    try {
      await deleteDocument(selectedCase.id, documentId)
      await loadCases(false)

      if (editingDocument?.id === documentId) {
        setEditingDocument(null)
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to remove this evidence slip right now.')
    }
  }

  function handleNewCase() {
    setSelectedCaseId('')
    setEditingDocument(null)
    setErrorMessage('')
  }

  function handleLogout() {
    setCases([])
    setSelectedCaseId('')
    setEditingDocument(null)
    setErrorMessage('')
    setLoadingCases(false)
    logout()
  }

  function handleEditDocument(document) {
    setEditingDocument(document)
  }

  function handleCancelDocumentEdit() {
    setEditingDocument(null)
  }

  function handleClearFilters() {
    setSearchQuery('')
    setStatusFilter('all')
    setCaseTypeFilter('all')
    setSortMode('recent')
  }

  const stats = useMemo(() => getDashboardStats(cases), [cases])
  const visibleCases = useMemo(
    () => getVisibleCases(cases, searchQuery, statusFilter, caseTypeFilter, sortMode),
    [cases, searchQuery, statusFilter, caseTypeFilter, sortMode]
  )
  const hasActiveFilters = Boolean(searchQuery.trim()) || statusFilter !== 'all' || caseTypeFilter !== 'all'

  if (isCheckingAuth) {
    return (
      <div className="app app--shell">
        <div className="app__shell-card">
          <p className="app__eyebrow">ProofPack</p>
          <h1 className="app__shell-title">Reopening your case binder</h1>
          <p className="app__shell-copy">Checking your session and pulling your latest folders back into view.</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="app__backdrop app__backdrop--top" />
        <div className="app__backdrop app__backdrop--bottom" />
        <div className="app__container app__container--auth">
          <AuthPanel
            errorMessage={authError}
            isSubmitting={isSubmittingAuth}
            onClearError={clearAuthError}
            onLogin={login}
            onRegister={register}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="app__backdrop app__backdrop--top" />
      <div className="app__backdrop app__backdrop--bottom" />

      <div className="app__container">
        <DashboardHeader
          caseCount={cases.length}
          onLogout={handleLogout}
          onNewCase={handleNewCase}
          user={user}
        />

        <StatsBar stats={stats} />

        <div className="app__dashboard">
          <main className="app__main">
            <FilterBar
              caseTypeFilter={caseTypeFilter}
              hasActiveFilters={hasActiveFilters}
              onCaseTypeChange={setCaseTypeFilter}
              onClearFilters={handleClearFilters}
              onSearchChange={setSearchQuery}
              onSortModeChange={setSortMode}
              onStatusChange={setStatusFilter}
              searchQuery={searchQuery}
              sortMode={sortMode}
              statusFilter={statusFilter}
            />

            {errorMessage ? <div className="app__feedback app__feedback--error">{errorMessage}</div> : null}

            {loadingCases ? (
              <div className="panel panel--loading">
                <h2>Opening folders</h2>
                <p>Pulling together your file drawer, packet progress, and recent evidence activity.</p>
              </div>
            ) : (
              <PackageList
                cases={visibleCases}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={handleClearFilters}
                onDeleteCase={handleDeleteCase}
                onSelectCase={setSelectedCaseId}
                selectedCaseId={selectedCaseId}
              />
            )}
          </main>

          <aside className="app__sidebar">
            <PackageForm
              key={selectedCase?.id ?? 'new-case'}
              caseToEdit={selectedCase}
              isSubmitting={isSavingCase}
              onCancelSelection={handleNewCase}
              onSubmit={handleSaveCase}
            />

            <PackageDetails
              caseItem={selectedCase}
              documentToEdit={activeDocument}
              isSavingDocument={isSavingDocument}
              onCancelDocumentEdit={handleCancelDocumentEdit}
              onDeleteDocument={handleDeleteDocument}
              onEditDocument={handleEditDocument}
              onSaveDocument={handleSaveDocument}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}

export default App
