"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { getAnalyticsData } from "@/lib/api"
import { DashboardChart } from "@/components/dashboard-chart"
import { LoadingSpinner } from "@/components/loading-spinner"
import { GenerateReportButton } from "@/components/generate-report-button"
import { generateAnalyticsPDF } from "@/lib/pdf-generator"

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsData = await getAnalyticsData()
        setData(analyticsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch analytics data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleGenerateReport = async () => {
    if (!data) return

    setIsGeneratingPDF(true)
    try {
      // Small delay to allow the UI to update
      await new Promise((resolve) => setTimeout(resolve, 100))
      generateAnalyticsPDF(data)
      toast({
        title: "Success",
        description: "Analytics report generated successfully",
      })
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate analytics report",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
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
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <GenerateReportButton onClick={handleGenerateReport} isLoading={isGeneratingPDF} />
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="rides">Rides</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="completion">Completion</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue generated over the past months</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardChart data={data?.revenueData || []} type="bar" xField="month" yField="amount" height={400} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Cumulative user registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardChart data={data?.userData || []} type="line" xField="month" yField="count" height={400} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rides" className="mt-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Rides by Vehicle Type</CardTitle>
              <CardDescription>Distribution of rides by vehicle type</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardChart data={data?.rideData || []} type="pie" nameField="type" valueField="count" height={400} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Distribution of payment methods used</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardChart
                data={data?.paymentData || []}
                type="pie"
                nameField="method"
                valueField="count"
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completion" className="mt-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Ride Completion Rate</CardTitle>
              <CardDescription>Percentage of rides completed successfully</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardChart data={data?.completionData || []} type="bar" xField="month" yField="rate" height={400} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
