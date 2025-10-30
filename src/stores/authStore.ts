import Cookies from 'js-cookie'
import { create } from 'zustand'
import type { AdminUserInfo } from '@/api/frontend-types/admin.types'
import { STORAGE_KEYS } from '@/api/http/types'

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
  const cookieState = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''

  // Initialize admin user from localStorage
  const savedAdminUser = localStorage.getItem(STORAGE_KEYS.ADMIN_USER_INFO)
  const initAdminUser = savedAdminUser ? JSON.parse(savedAdminUser) : null
  const initRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(STORAGE_KEYS.ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN)
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
            localStorage.setItem(STORAGE_KEYS.ADMIN_USER_INFO, JSON.stringify(user))
          } else {
            localStorage.removeItem(STORAGE_KEYS.ADMIN_USER_INFO)
          }
          return { ...state, adminAuth: { ...state.adminAuth, user } }
        }),
      setTokens: (accessToken, refreshToken) =>
        set((state) => {
          // Store tokens in localStorage
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)

          // Also update the old auth accessToken for compatibility
          Cookies.set(STORAGE_KEYS.ACCESS_TOKEN, JSON.stringify(accessToken))

          return {
            ...state,
            adminAuth: { ...state.adminAuth, refreshToken },
            auth: { ...state.auth, accessToken },
          }
        }),
      clearAuth: () =>
        set((state) => {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.ADMIN_USER_INFO)
          Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN)

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
