import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"

export const generateDashboardPDF = (stats: any) => {
  // Create a new PDF document
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("Ride Sharing Admin Dashboard Report", pageWidth / 2, 20, { align: "center" })

  // Add date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${format(new Date(), "PPpp")}`, pageWidth / 2, 30, { align: "center" })

  // Add summary statistics
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Summary Statistics", 14, 45)

  // Create a table for summary stats
  const summaryData = [
    ["Total Users", stats?.totalUsers || 0, "New Users (This Month)", stats?.newUsers || 0],
    ["Total Rides", stats?.totalRides || 0, "Completed Rides", stats?.completedRides || 0],
    ["Active Complaints", stats?.activeComplaints || 0, "Resolved Complaints", stats?.resolvedComplaints || 0],
    ["Total Payments", stats?.totalPayments || 0, "Pending Payments", stats?.pendingPayments || 0],
    ["Total Revenue", `Rs. ${stats?.totalRevenue || 0}`, "Monthly Revenue", `Rs. ${stats?.monthlyRevenue || 0}`],
    ["Active Promo Codes", stats?.activePromoCodes || 0, "Expired Promo Codes", stats?.expiredPromoCodes || 0],
  ]

  autoTable(doc, {
    startY: 50,
    head: [["Metric", "Value", "Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 10 },
  })

  let finalY = (doc as any).lastAutoTable.finalY || 50

  // Add revenue data chart info
  if (stats?.revenueData && stats.revenueData.length > 0) {
    doc.setFontSize(14)
    doc.text("Monthly Revenue Data", 14, finalY + 15)

    const revenueTableData = stats.revenueData.map((item: any) => [item.month, `Rs. ${item.amount}`])

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Month", "Revenue"]],
      body: revenueTableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
    })

    finalY = (doc as any).lastAutoTable.finalY || finalY
  }

  // Add user growth data
  if (stats?.userData && stats.userData.length > 0) {
    doc.setFontSize(14)
    doc.text("User Growth Data", 14, finalY + 15)

    const userTableData = stats.userData.map((item: any) => [item.month, item.count])

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Month", "User Count"]],
      body: userTableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
    })

    finalY = (doc as any).lastAutoTable.finalY || finalY
  }

  // Add ride type distribution
  if (stats?.rideData && stats.rideData.length > 0) {
    doc.setFontSize(14)
    doc.text("Ride Type Distribution", 14, finalY + 15)

    const rideTableData = stats.rideData.map((item: any) => [item.type, item.count])

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Vehicle Type", "Count"]],
      body: rideTableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
    })

    finalY = (doc as any).lastAutoTable.finalY || finalY
  }

  // Add payment method distribution
  if (stats?.paymentData && stats.paymentData.length > 0) {
    doc.setFontSize(14)
    doc.text("Payment Method Distribution", 14, finalY + 15)

    const paymentTableData = stats.paymentData.map((item: any) => [item.method, item.count])

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Payment Method", "Count"]],
      body: paymentTableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
    })
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  doc.setFontSize(10)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" })
  }

  // Save the PDF
  doc.save("ride-sharing-dashboard-report.pdf")
}

export const generateAnalyticsPDF = (data: any) => {
  // Create a new PDF document
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("Ride Sharing Analytics Report", pageWidth / 2, 20, { align: "center" })

  // Add date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${format(new Date(), "PPpp")}`, pageWidth / 2, 30, { align: "center" })

  // Add revenue data
  if (data?.revenueData && data.revenueData.length > 0) {
    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text("Monthly Revenue Data", 14, 45)

    const revenueTableData = data.revenueData.map((item: any) => [item.month, `Rs. ${item.amount}`])

    autoTable(doc, {
      startY: 50,
      head: [["Month", "Revenue"]],
      body: revenueTableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
    })
  }

  let finalY = (doc as any).lastAutoTable.finalY || 50

  // Add user growth data
  if (data?.userData && data.userData.length > 0) {
    doc.setFontSize(14)
    doc.text("User Growth Data", 14, finalY + 15)

    const userTableData = data.userData.map((item: any) => [item.month, item.count])

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Month", "User Count"]],
      body: userTableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
    })

    finalY = (doc as any).lastAutoTable.finalY || finalY
  }

  // Add ride type distribution
  if (data?.rideData && data.rideData.length > 0) {
    doc.setFontSize(14)
    doc.text("Ride Type Distribution", 14, finalY + 15)

    const rideTableData = data.rideData.map((item: any) => [item.type, item.count])

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Vehicle Type", "Count"]],
      body: rideTableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
    })

    finalY = (doc as any).lastAutoTable.finalY || finalY
  }

  // Add payment method distribution
  if (data?.paymentData && data.paymentData.length > 0) {
    doc.setFontSize(14)
    doc.text("Payment Method Distribution", 14, finalY + 15)

    const paymentTableData = data.paymentData.map((item: any) => [item.method, item.count])

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Payment Method", "Count"]],
      body: paymentTableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
    })

    finalY = (doc as any).lastAutoTable.finalY || finalY
  }

  // Add completion rate data
  if (data?.completionData && data.completionData.length > 0) {
    doc.setFontSize(14)
    doc.text("Ride Completion Rate", 14, finalY + 15)

    const completionTableData = data.completionData.map((item: any) => [
      item.month,
      `${item.rate}%`,
      item.completed,
      item.total,
    ])

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Month", "Completion Rate", "Completed Rides", "Total Rides"]],
      body: completionTableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
    })
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  doc.setFontSize(10)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" })
  }

  // Save the PDF
  doc.save("ride-sharing-analytics-report.pdf")
}
