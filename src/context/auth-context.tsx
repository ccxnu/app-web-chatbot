import React, { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import type { AdminUserInfo } from '@/api/frontend-types/admin.types'
import { STORAGE_KEYS } from '@/api/http/types'

interface AuthContextType {
  user: AdminUserInfo | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshToken } = useAuthStore((state) => state.adminAuth)
  const [isLoading, setIsLoading] = React.useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

    // If we have tokens but no user in store, load user from localStorage
    if (accessToken && storedRefreshToken && !user) {
      const storedUser = localStorage.getItem(STORAGE_KEYS.ADMIN_USER_INFO)
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          useAuthStore.getState().adminAuth.setUser(parsedUser)
        } catch (error) {
          console.error('Failed to parse stored user:', error)
        }
      }
    }

    setIsLoading(false)
  }, [user])

  const isAuthenticated = !!user && !!refreshToken && !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
