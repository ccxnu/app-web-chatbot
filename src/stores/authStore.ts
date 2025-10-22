import Cookies from 'js-cookie'
import { create } from 'zustand'
import type { AdminUserInfo } from '@/api/frontend-types/admin.types'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN_KEY'
const ADMIN_USER_KEY = 'ADMIN_USER_INFO'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
  adminAuth: {
    user: AdminUserInfo | null
    setUser: (user: AdminUserInfo | null) => void
    refreshToken: string | null
    setTokens: (accessToken: string, refreshToken: string) => void
    clearAuth: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''

  // Initialize admin user from localStorage
  const savedAdminUser = localStorage.getItem(ADMIN_USER_KEY)
  const initAdminUser = savedAdminUser ? JSON.parse(savedAdminUser) : null
  const initRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
    adminAuth: {
      user: initAdminUser,
      refreshToken: initRefreshToken,
      setUser: (user) =>
        set((state) => {
          if (user) {
            localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
          } else {
            localStorage.removeItem(ADMIN_USER_KEY)
          }
          return { ...state, adminAuth: { ...state.adminAuth, user } }
        }),
      setTokens: (accessToken, refreshToken) =>
        set((state) => {
          // Store tokens in localStorage
          localStorage.setItem('ACCESS_TOKEN_KEY', accessToken)
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)

          // Also update the old auth accessToken for compatibility
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))

          return {
            ...state,
            adminAuth: { ...state.adminAuth, refreshToken },
            auth: { ...state.auth, accessToken },
          }
        }),
      clearAuth: () =>
        set((state) => {
          localStorage.removeItem('ACCESS_TOKEN_KEY')
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          localStorage.removeItem(ADMIN_USER_KEY)
          Cookies.remove(ACCESS_TOKEN)

          return {
            ...state,
            adminAuth: { ...state.adminAuth, user: null, refreshToken: null },
            auth: { ...state.auth, accessToken: '' },
          }
        }),
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
