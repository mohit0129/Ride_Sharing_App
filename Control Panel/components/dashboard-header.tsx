"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardHeader() {
  const pathname = usePathname()
  const [title, setTitle] = useState("Dashboard")

  useEffect(() => {
    const getTitle = () => {
      if (pathname === "/dashboard") return "Dashboard"

      const path = pathname.split("/").pop()
      if (!path) return "Dashboard"

      // Handle specific paths
      if (path === "users") return "User Management"
      if (path === "rides") return "Ride Management"
      if (path === "complaints") return "Complaint Management"
      if (path === "payments") return "Payment Management"
      if (path === "promo-codes") return "Promo Code Management"
      if (path === "analytics") return "Analytics"

      // Handle dynamic paths
      if (pathname.includes("/users/")) {
        if (path === "add") return "Add User"
        return "User Details"
      }
      if (pathname.includes("/rides/")) return "Ride Details"
      if (pathname.includes("/complaints/")) return "Complaint Details"
      if (pathname.includes("/payments/")) return "Payment Details"
      if (pathname.includes("/promo-codes/")) {
        if (path === "add") return "Create Promo Code"
        return "Promo Code Details"
      }

      // Fallback
      return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
    }

    setTitle(getTitle())
  }, [pathname])

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  )
}
