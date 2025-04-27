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
import { ArrowLeft, Trash2 } from "lucide-react"
import { getPromoCodeById, updatePromoCodeStatus, deletePromoCode } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function PromoCodeDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const [promoCode, setPromoCode] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchPromoCode = async () => {
      try {
        const data = await getPromoCodeById(params.id)
        setPromoCode(data.promo)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch promo code details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPromoCode()
  }, [params.id, toast])

  const handleStatusChange = async (status: string) => {
    setIsSaving(true)
    try {
      await updatePromoCodeStatus(params.id, status)
      setPromoCode((prev) => ({ ...prev, status }))
      toast({
        title: "Success",
        description: `Promo code status updated to ${status}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update promo code status",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePromoCode(params.id)
      toast({
        title: "Success",
        description: "Promo code deleted successfully",
      })
      router.push("/dashboard/promo-codes")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete promo code",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const isExpired = (date: string) => {
    return new Date(date) < new Date()
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
        <h1 className="text-3xl font-bold">Promo Code Details</h1>
      </div>

      <div className="grid gap-6 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Promo Code Information</CardTitle>
            <CardDescription>View promo code details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Promo ID</h3>
              <p>{promoCode.promoId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
              <p className="text-lg font-bold">{promoCode.promoCode}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Discount</h3>
              <p>{promoCode.discount}%</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Expiry Date</h3>
              <p>
                {new Date(promoCode.expiryDate).toLocaleDateString()}
                {isExpired(promoCode.expiryDate) && <span className="ml-2 text-xs text-red-500">(Expired)</span>}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
              <p>{new Date(promoCode.createdAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promo Code Status</CardTitle>
            <CardDescription>Manage promo code status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Select value={promoCode.status} onValueChange={handleStatusChange} disabled={isSaving}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Promo Code
            </Button>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the promo code.
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
