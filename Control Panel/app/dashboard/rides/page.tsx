"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Eye, Loader2, Search } from "lucide-react"
import { getAllRides } from "@/lib/api"

export default function RidesPage() {
  const { toast } = useToast()
  const [rides, setRides] = useState<any[]>([])
  const [filteredRides, setFilteredRides] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const data = await getAllRides()
        setRides(data.rides)
        setFilteredRides(data.rides)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch rides",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRides()
  }, [toast])

  useEffect(() => {
    let result = rides

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((ride) => ride.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (ride) =>
          (ride.customer?.phone && ride.customer.phone.includes(term)) ||
          (ride.rider?.phone && ride.rider.phone.includes(term)) ||
          (ride.pickup?.address && ride.pickup.address.toLowerCase().includes(term)) ||
          (ride.drop?.address && ride.drop.address.toLowerCase().includes(term)),
      )
    }

    setFilteredRides(result)
  }, [rides, searchTerm, statusFilter])

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "SEARCHING_FOR_RIDER":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "START":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "ARRIVED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "SEARCHING_FOR_RIDER":
        return "Searching"
      case "START":
        return "Started"
      case "ARRIVED":
        return "Arrived"
      case "COMPLETED":
        return "Completed"
      case "CANCELLED":
        return "Cancelled"
      default:
        return status
    }
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
      <h1 className="text-3xl font-bold">Ride Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, rider, or location..."
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
                <SelectItem value="SEARCHING_FOR_RIDER">Searching</SelectItem>
                <SelectItem value="START">Started</SelectItem>
                <SelectItem value="ARRIVED">Arrived</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRides.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No rides found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRides.map((ride) => (
                    <TableRow key={ride._id}>
                      <TableCell>{ride.customer?.phone || "N/A"}</TableCell>
                      <TableCell>{ride.rider?.phone || "Not assigned"}</TableCell>
                      <TableCell className="capitalize">{ride.vehicle}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{ride.pickup?.address}</TableCell>
                      <TableCell>₹{ride.fare}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(ride.status)}`}
                        >
                          {formatStatus(ride.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/rides/${ride._id}`}>
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
