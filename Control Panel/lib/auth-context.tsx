"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI } from "@/lib/api"

interface User {
  id: string
  username?: string
  phone?: string
  email?: string
  role: string
  isSuper?: boolean
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("access_token")
      const storedRefreshToken = localStorage.getItem("refresh_token")

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))

        // Check if token needs refresh
        const tokenExpiry = localStorage.getItem("token_expiry")
        if (tokenExpiry && new Date(tokenExpiry) < new Date() && storedRefreshToken) {
          try {
            const { access_token, refresh_token } = await authAPI.refreshToken(storedRefreshToken)
            localStorage.setItem("access_token", access_token)
            localStorage.setItem("refresh_token", refresh_token)

            // Set new expiry (15 minutes from now)
            const newExpiry = new Date()
            newExpiry.setMinutes(newExpiry.getMinutes() + 15)
            localStorage.setItem("token_expiry", newExpiry.toISOString())
          } catch (error) {
            // If refresh fails, log out
            handleLogout()
          }
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: any) => {
    setIsLoading(true)
    try {
      const { user, access_token, refresh_token } = await authAPI.login(credentials)

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)

      // Set token expiry (15 minutes from now)
      const expiry = new Date()
      expiry.setMinutes(expiry.getMinutes() + 15)
      localStorage.setItem("token_expiry", expiry.toISOString())
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("token_expiry")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout: handleLogout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
