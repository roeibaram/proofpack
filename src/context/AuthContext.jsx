import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, loginUser, registerUser } from '../api/authApi.js'

const TOKEN_STORAGE_KEY = 'proofpack_token'
const AuthContext = createContext(null)

function getInitialToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getInitialToken)
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(getInitialToken()))
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)

  useEffect(() => {
    if (!token || user) {
      return
    }

    let ignore = false

    async function restoreSession() {
      setIsCheckingAuth(true)

      try {
        const nextUser = await getCurrentUser(token)

        if (!ignore) {
          setUser(nextUser)
          setAuthError('')
        }
      } catch (error) {
        if (!ignore) {
          window.localStorage.removeItem(TOKEN_STORAGE_KEY)
          setToken('')
          setUser(null)
          setAuthError(error.message || 'Your session expired. Please sign in again.')
        }
      } finally {
        if (!ignore) {
          setIsCheckingAuth(false)
        }
      }
    }

    restoreSession()

    return () => {
      ignore = true
    }
  }, [token, user])

  function persistToken(nextToken) {
    if (nextToken) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    setToken(nextToken)
  }

  async function register(credentials) {
    setIsSubmittingAuth(true)

    try {
      const payload = await registerUser(credentials)
      persistToken(payload.token)
      setUser(payload.user)
      setAuthError('')
    } catch (error) {
      setAuthError(error.message || 'Unable to create your account right now.')
      throw error
    } finally {
      setIsSubmittingAuth(false)
    }
  }

  async function login(credentials) {
    setIsSubmittingAuth(true)

    try {
      const payload = await loginUser(credentials)
      persistToken(payload.token)
      setUser(payload.user)
      setAuthError('')
    } catch (error) {
      setAuthError(error.message || 'Unable to sign you in right now.')
      throw error
    } finally {
      setIsSubmittingAuth(false)
    }
  }

  function logout() {
    persistToken('')
    setUser(null)
    setAuthError('')
  }

  const value = {
    authError,
    clearAuthError: () => setAuthError(''),
    isAuthenticated: Boolean(user),
    isCheckingAuth,
    isSubmittingAuth,
    login,
    logout,
    register,
    token,
    user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
