"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Trash2, MapPin } from "lucide-react"
import { getRideById, updateRideStatus, deleteRide } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function RideDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const [ride, setRide] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const data = await getRideById(params.id)
        setRide(data.ride)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch ride details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRide()
  }, [params.id, toast])

  const handleStatusChange = async (status: string) => {
    setIsSaving(true)
    try {
      await updateRideStatus(params.id, status)
      setRide((prev) => ({ ...prev, status }))
      toast({
        title: "Success",
        description: `Ride status updated to ${status}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ride status",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteRide(params.id)
      toast({
        title: "Success",
        description: "Ride deleted successfully",
      })
      router.push("/dashboard/rides")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ride",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Ride Details</h1>
      </div>

      <div className="grid gap-6 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ride Information</CardTitle>
            <CardDescription>View ride details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Vehicle Type</h3>
                <p className="capitalize">{ride.vehicle}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Distance</h3>
                <p>{ride.distance?.toFixed(2) || "N/A"} km</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fare</h3>
              <p className="text-lg font-bold">₹{ride.fare}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Pickup Location</h3>
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p>{ride.pickup?.address || "N/A"}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Drop Location</h3>
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p>{ride.drop?.address || "N/A"}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
              <p>{new Date(ride.createdAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ride Status</CardTitle>
            <CardDescription>Manage ride status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
              <p>{ride.customer?.phone || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Rider</h3>
              <p>{ride.rider?.phone || "Not assigned"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">OTP</h3>
              <p>{ride.otp || "N/A"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Select value={ride.status} onValueChange={handleStatusChange} disabled={isSaving}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEARCHING_FOR_RIDER">Searching for Rider</SelectItem>
                  <SelectItem value="START">Started</SelectItem>
                  <SelectItem value="ARRIVED">Arrived</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Ride
            </Button>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the ride and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? <LoadingSpinner size="small" className="mr-2" /> : null}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
