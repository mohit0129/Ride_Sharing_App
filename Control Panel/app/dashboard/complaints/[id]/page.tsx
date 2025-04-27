"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
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
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { getComplaintById, updateComplaint, deleteComplaint } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ComplaintDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const [complaint, setComplaint] = useState<any>(null)
  const [adminRemarks, setAdminRemarks] = useState("")
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const data = await getComplaintById(params.id)
        setComplaint(data.complaint)
        setAdminRemarks(data.complaint.adminRemarks || "")
        setStatus(data.complaint.status)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch complaint details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchComplaint()
  }, [params.id, toast])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateComplaint(params.id, { status, adminRemarks })
      setComplaint((prev) => ({ ...prev, status, adminRemarks }))
      toast({
        title: "Success",
        description: "Complaint updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update complaint",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteComplaint(params.id)
      toast({
        title: "Success",
        description: "Complaint deleted successfully",
      })
      router.push("/dashboard/complaints")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete complaint",
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
        <h1 className="text-3xl font-bold">Complaint Details</h1>
      </div>

      <div className="grid gap-6 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Complaint Information</CardTitle>
            <CardDescription>View complaint details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Ticket ID</h3>
              <p className="font-medium">{complaint.ticketId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">User</h3>
              <p>{complaint.userId?.phone || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Issue Type</h3>
              <p className="capitalize">{complaint.issueType?.replace("_", " ") || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="whitespace-pre-wrap">{complaint.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
              <p>{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Response</CardTitle>
            <CardDescription>Update complaint status and add remarks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Admin Remarks</h3>
              <Textarea
                placeholder="Add your remarks here..."
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <LoadingSpinner size="small" className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the complaint.
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
