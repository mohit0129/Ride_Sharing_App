"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDashboardStats } from "@/lib/api"
import { DashboardChart } from "@/components/dashboard-chart"
import { Users, Car, AlertTriangle, CreditCard, DollarSign, Tag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { GenerateReportButton } from "@/components/generate-report-button"
import { generateDashboardPDF } from "@/lib/pdf-generator"

export default function DashboardPage() {
  const { toast } = useToast()
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleGenerateReport = async () => {
    if (!stats) return

    setIsGeneratingPDF(true)
    try {
      // Small delay to allow the UI to update
      await new Promise((resolve) => setTimeout(resolve, 100))
      generateDashboardPDF(stats)
      toast({
        title: "Success",
        description: "Dashboard report generated successfully",
      })
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate dashboard report",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
        toast({
          title: "Error",
          description: "Failed to fetch dashboard statistics",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <GenerateReportButton onClick={handleGenerateReport} isLoading={isGeneratingPDF} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.newUsers || 0} new users this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRides || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.completedRides || 0} completed rides</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Complaints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeComplaints || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.resolvedComplaints || 0} resolved complaints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPayments || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.pendingPayments || 0} pending payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalRevenue || 0}</div>
            <p className="text-xs text-muted-foreground">₹{stats?.monthlyRevenue || 0} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Promo Codes</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activePromoCodes || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.expiredPromoCodes || 0} expired codes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="rides">Rides</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="mt-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardChart data={stats?.revenueData || []} type="bar" xField="month" yField="amount" height={350} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardChart data={stats?.userData || []} type="line" xField="month" yField="count" height={350} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rides" className="mt-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Rides by Vehicle Type</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardChart
                data={stats?.rideData || []}
                type="pie"
                nameField="type"
                valueField="count"
                height={350}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="mt-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardChart
                data={stats?.paymentData || []}
                type="pie"
                nameField="method"
                valueField="count"
                height={350}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
