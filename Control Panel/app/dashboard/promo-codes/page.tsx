"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Eye, Loader2, Plus, Search } from "lucide-react"
import { getAllPromoCodes } from "@/lib/api"

export default function PromoCodesPage() {
  const { toast } = useToast()
  const [promoCodes, setPromoCodes] = useState<any[]>([])
  const [filteredPromoCodes, setFilteredPromoCodes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const data = await getAllPromoCodes()
        setPromoCodes(data.promoCodes)
        setFilteredPromoCodes(data.promoCodes)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch promo codes",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPromoCodes()
  }, [toast])

  useEffect(() => {
    let result = promoCodes

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((promoCode) => promoCode.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (promoCode) =>
          (promoCode.promoCode && promoCode.promoCode.toLowerCase().includes(term)) ||
          (promoCode.promoId && promoCode.promoId.toLowerCase().includes(term)),
      )
    }

    setFilteredPromoCodes(result)
  }, [promoCodes, searchTerm, statusFilter])

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const isExpired = (date: string) => {
    return new Date(date) < new Date()
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Promo Code Management</h1>
        <Button asChild>
          <Link href="/dashboard/promo-codes/add">
            <Plus className="mr-2 h-4 w-4" />
            Create Promo Code
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promo Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by promo code..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Promo ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromoCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No promo codes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPromoCodes.map((promoCode) => (
                    <TableRow key={promoCode._id}>
                      <TableCell>{promoCode.promoId}</TableCell>
                      <TableCell className="font-medium">{promoCode.promoCode}</TableCell>
                      <TableCell>{promoCode.discount}%</TableCell>
                      <TableCell>
                        {new Date(promoCode.expiryDate).toLocaleDateString()}
                        {isExpired(promoCode.expiryDate) && promoCode.status === "active" && (
                          <span className="ml-2 text-xs text-red-500">(Expired)</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(promoCode.status)}`}
                        >
                          {promoCode.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/promo-codes/${promoCode._id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
