"use client"

import Link from "next/link"
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
import { ArrowLeft, Trash2 } from "lucide-react"
import { getPaymentDetails, updatePaymentStatus, deletePayment } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function PaymentDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const [payment, setPayment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const data = await getPaymentDetails(params.id)
        setPayment(data.payment)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch payment details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayment()
  }, [params.id, toast])

  const handleStatusChange = async (status: string) => {
    setIsSaving(true)
    try {
      await updatePaymentStatus(params.id, status)
      setPayment((prev) => ({ ...prev, status }))
      toast({
        title: "Success",
        description: `Payment status updated to ${status}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePayment(params.id)
      toast({
        title: "Success",
        description: "Payment deleted successfully",
      })
      router.push("/dashboard/payments")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payment",
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
        <h1 className="text-3xl font-bold">Payment Details</h1>
      </div>

      <div className="grid gap-6 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>View payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Payment ID</h3>
              <p className="font-medium">{payment.paymentId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
              <p className="text-lg font-bold">₹{payment.amount}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
              <p className="capitalize">{payment.paymentMethod}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
              <p>{payment.customerId?.phone || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Rider</h3>
              <p>{payment.riderId?.phone || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
              <p>{new Date(payment.createdAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Manage payment status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Select value={payment.status} onValueChange={handleStatusChange} disabled={isSaving}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Ride Information</h3>
              {payment.rideId ? (
                <div className="mt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/rides/${payment.rideId._id}`}>View Ride Details</Link>
                  </Button>
                </div>
              ) : (
                <p>No ride information available</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Payment
            </Button>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the payment record.
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
