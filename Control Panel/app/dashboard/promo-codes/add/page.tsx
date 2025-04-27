"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import { createPromoCode } from "@/lib/api"

export default function AddPromoCodePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const promoCode = formData.get("promoCode") as string
    const discount = Number.parseFloat(formData.get("discount") as string)
    const expiryDate = formData.get("expiryDate") as string

    try {
      await createPromoCode({
        promoCode: promoCode.toUpperCase(),
        discount,
        expiryDate,
      })
      toast({
        title: "Success",
        description: "Promo code created successfully",
      })
      router.push("/dashboard/promo-codes")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create promo code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create Promo Code</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Promo Code Information</CardTitle>
            <CardDescription>Create a new promo code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promoCode">Promo Code</Label>
              <Input id="promoCode" name="promoCode" placeholder="e.g. SUMMER2023" required />
              <p className="text-xs text-muted-foreground">Promo code will be automatically converted to uppercase</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Percentage</Label>
              <Input id="discount" name="discount" type="number" min="1" max="100" placeholder="e.g. 20" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Promo Code
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
