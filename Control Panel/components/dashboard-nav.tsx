"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LayoutDashboard, Users, Car, AlertTriangle, CreditCard, Tag, BarChart, LogOut, User } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6" />
          <span className="font-bold">Ride Admin</span>
        </div>
        <ModeToggle />
      </div>

      <nav className="flex-1 overflow-auto p-3">
        <div className="space-y-6">
          {/* Dashboard Section */}
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Dashboard</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    pathname === "/dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/analytics"
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive("/dashboard/analytics") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <BarChart className="h-4 w-4" />
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Management Section */}
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Management</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard/users"
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive("/dashboard/users") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Users
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/rides"
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive("/dashboard/rides") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <Car className="h-4 w-4" />
                  Rides
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/complaints"
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive("/dashboard/complaints") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Complaints
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/payments"
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive("/dashboard/payments") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Payments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/promo-codes"
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive("/dashboard/promo-codes") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <Tag className="h-4 w-4" />
                  Promo Codes
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.username || "Admin"}</span>
            <span className="text-xs text-muted-foreground">{user?.email || user?.phone || ""}</span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
