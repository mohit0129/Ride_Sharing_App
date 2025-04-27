// const API_BASE_URL = "https://ride-sharing-wnhj.onrender.com"
const API_BASE_URL = "http://192.168.1.4:5000"

// Helper function to handle API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token")

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.msg || `API request failed with status ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Auth API
export const authAPI = {
  register: (data: any) =>
    apiRequest("/auth/admin/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (credentials: any) =>
    apiRequest("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  refreshToken: (refresh_token: string) =>
    apiRequest("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    }),
}

// User API
export const userAPI = {
  getAll: () => apiRequest("/auth/users"),

  getById: (id: string) => apiRequest(`/auth/users/${id}`),

  create: (userData: any) =>
    apiRequest("/auth/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  update: (id: string, userData: any) =>
    apiRequest(`/auth/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/auth/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiRequest(`/auth/users/${id}`, {
      method: "DELETE",
    }),
}

// Ride API
export const rideAPI = {
  getAll: () => apiRequest("/ride"),

  getById: (id: string) => apiRequest(`/ride/${id}`),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/ride/update/status/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiRequest(`/ride/${id}`, {
      method: "DELETE",
    }),
}

// Complaint API
export const complaintAPI = {
  getAll: () => apiRequest("/complaint"),

  getById: (id: string) => apiRequest(`/complaint/${id}`),

  update: (id: string, data: any) =>
    apiRequest(`/complaint/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/complaint/${id}`, {
      method: "DELETE",
    }),
}

// Payment API
export const paymentAPI = {
  getAll: () => apiRequest("/payment"),

  getById: (id: string) => apiRequest(`/payment/${id}`),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/payment/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiRequest(`/payment/${id}`, {
      method: "DELETE",
    }),
}

// Promo Code API
export const promoAPI = {
  getAll: () => apiRequest("/promo"),

  getById: (id: string) => apiRequest(`/promo/${id}`),

  create: (data: any) =>
    apiRequest("/promo", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/promo/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiRequest(`/promo/${id}`, {
      method: "DELETE",
    }),
}

export const getAllComplaints = complaintAPI.getAll
export const getComplaintById = complaintAPI.getById
export const updateComplaint = complaintAPI.update
export const deleteComplaint = complaintAPI.delete

export const getAllPayments = paymentAPI.getAll
export const getPaymentDetails = paymentAPI.getById
export const updatePaymentStatus = paymentAPI.updateStatus
export const deletePayment = paymentAPI.delete

export const getAllPromoCodes = promoAPI.getAll
export const getPromoCodeById = promoAPI.getById
export const updatePromoCodeStatus = promoAPI.updateStatus
export const deletePromoCode = promoAPI.delete
export const createPromoCode = promoAPI.create

export const getAllRides = rideAPI.getAll
export const getRideById = rideAPI.getById
export const updateRideStatus = rideAPI.updateStatus
export const deleteRide = rideAPI.delete

export const getAllUsers = userAPI.getAll
export const getUserById = userAPI.getById
export const updateUser = userAPI.update
export const updateUserStatus = userAPI.updateStatus
export const deleteUser = userAPI.delete
export const createUser = userAPI.create

// Dashboard and Analytics API
export async function getDashboardStats() {
  // Fetch real data from multiple endpoints
  try {
    const [usersData, ridesData, complaintsData, paymentsData, promoCodesData] = await Promise.all([
      getAllUsers(),
      getAllRides(),
      getAllComplaints(),
      getAllPayments(),
      getAllPromoCodes(),
    ])

    // Process users data
    const users = usersData.users || []
    const totalUsers = users.length
    const newUsers = users.filter((user: any) => {
      const createdDate = new Date(user.createdAt)
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      return createdDate > oneMonthAgo
    }).length

    // Process rides data
    const rides = ridesData.rides || []
    const totalRides = rides.length
    const completedRides = rides.filter((ride: any) => ride.status === "COMPLETED").length

    // Process complaints data
    const complaints = complaintsData.complaints || []
    const activeComplaints = complaints.filter(
      (complaint: any) => complaint.status === "open" || complaint.status === "in_progress",
    ).length
    const resolvedComplaints = complaints.filter(
      (complaint: any) => complaint.status === "resolved" || complaint.status === "closed",
    ).length

    // Process payments data
    const payments = paymentsData.payments || []
    const totalPayments = payments.length
    const pendingPayments = payments.filter((payment: any) => payment.status === "pending").length

    // Calculate total revenue
    const totalRevenue = payments.reduce((sum: number, payment: any) => {
      return sum + (payment.amount || 0)
    }, 0)

    // Calculate monthly revenue
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyRevenue = payments.reduce((sum: number, payment: any) => {
      const paymentDate = new Date(payment.createdAt)
      if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
        return sum + (payment.amount || 0)
      }
      return sum
    }, 0)

    // Process promo codes data
    const promoCodes = promoCodesData.promoCodes || []
    const activePromoCodes = promoCodes.filter((promo: any) => promo.status === "active").length
    const expiredPromoCodes = promoCodes.filter((promo: any) => promo.status === "expired").length

    // Generate revenue data for the chart
    const revenueData = generateMonthlyRevenueData(payments)

    // Generate user growth data
    const userData = generateUserGrowthData(users)

    // Generate ride type data
    const rideData = generateRideTypeData(rides)

    // Generate payment method data
    const paymentData = generatePaymentMethodData(payments)

    return {
      totalUsers,
      newUsers,
      totalRides,
      completedRides,
      activeComplaints,
      resolvedComplaints,
      totalPayments,
      pendingPayments,
      totalRevenue: totalRevenue.toFixed(2),
      monthlyRevenue: monthlyRevenue.toFixed(2),
      activePromoCodes,
      expiredPromoCodes,
      revenueData,
      userData,
      rideData,
      paymentData,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw error
  }
}

export async function getAnalyticsData() {
  // Fetch real data from multiple endpoints
  try {
    const [usersData, ridesData, paymentsData] = await Promise.all([getAllUsers(), getAllRides(), getAllPayments()])

    const users = usersData.users || []
    const rides = ridesData.rides || []
    const payments = paymentsData.payments || []

    // Generate detailed analytics data
    const revenueData = generateMonthlyRevenueData(payments, 12) // Full year
    const userData = generateUserGrowthData(users, 12) // Full year
    const rideData = generateRideTypeData(rides)
    const paymentData = generatePaymentMethodData(payments)
    const completionData = generateCompletionRateData(rides)

    return {
      revenueData,
      userData,
      rideData,
      paymentData,
      completionData,
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    throw error
  }
}

// Helper functions for data processing

function generateMonthlyRevenueData(payments: any[], monthCount = 6) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Initialize data for the last n months
  const revenueData = []
  for (let i = monthCount - 1; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12 // Handle wrapping around to previous year
    revenueData.push({
      month: months[monthIndex],
      amount: 0,
    })
  }

  // Populate with actual payment data
  payments.forEach((payment: any) => {
    if (!payment.createdAt) return

    const paymentDate = new Date(payment.createdAt)
    const paymentMonth = paymentDate.getMonth()
    const paymentYear = paymentDate.getFullYear()

    // Only include payments from the last n months
    const monthDiff = (currentYear - paymentYear) * 12 + (currentMonth - paymentMonth)
    if (monthDiff >= 0 && monthDiff < monthCount) {
      const index = monthCount - 1 - monthDiff
      revenueData[index].amount += payment.amount || 0
    }
  })

  return revenueData
}

function generateUserGrowthData(users: any[], monthCount = 6) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Initialize data for the last n months
  const userData = []
  for (let i = monthCount - 1; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    userData.push({
      month: months[monthIndex],
      count: 0,
    })
  }

  // Count users registered in each month
  users.forEach((user: any) => {
    if (!user.createdAt) return

    const registrationDate = new Date(user.createdAt)
    const registrationMonth = registrationDate.getMonth()
    const registrationYear = registrationDate.getFullYear()

    const monthDiff = (currentYear - registrationYear) * 12 + (currentMonth - registrationMonth)
    if (monthDiff >= 0 && monthDiff < monthCount) {
      const index = monthCount - 1 - monthDiff
      userData[index].count += 1
    }
  })

  // Make it cumulative
  let cumulativeCount = 0
  for (let i = 0; i < userData.length; i++) {
    cumulativeCount += userData[i].count
    userData[i].count = cumulativeCount
  }

  return userData
}

function generateRideTypeData(rides: any[]) {
  const vehicleTypes: Record<string, number> = {}

  rides.forEach((ride: any) => {
    const vehicleType = ride.vehicle || "unknown"
    vehicleTypes[vehicleType] = (vehicleTypes[vehicleType] || 0) + 1
  })

  return Object.entries(vehicleTypes).map(([type, count]) => ({
    type: formatVehicleType(type),
    count,
  }))
}

function formatVehicleType(type: string) {
  switch (type) {
    case "bike":
      return "Bike"
    case "auto":
      return "Auto"
    case "cabEconomy":
      return "Cab Economy"
    case "cabPremium":
      return "Cab Premium"
    default:
      return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

function generatePaymentMethodData(payments: any[]) {
  const paymentMethods: Record<string, number> = {}

  payments.forEach((payment: any) => {
    const method = payment.paymentMethod || "unknown"
    paymentMethods[method] = (paymentMethods[method] || 0) + 1
  })

  return Object.entries(paymentMethods).map(([method, count]) => ({
    method: method.charAt(0).toUpperCase() + method.slice(1),
    count,
  }))
}

function generateCompletionRateData(rides: any[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Initialize data for the last 12 months
  const completionData = []
  for (let i = 11; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    completionData.push({
      month: months[monthIndex],
      rate: 0,
      total: 0,
      completed: 0,
    })
  }

  // Calculate completion rates for each month
  rides.forEach((ride: any) => {
    if (!ride.createdAt) return

    const rideDate = new Date(ride.createdAt)
    const rideMonth = rideDate.getMonth()
    const rideYear = rideDate.getFullYear()

    const monthDiff = (currentYear - rideYear) * 12 + (currentMonth - rideMonth)
    if (monthDiff >= 0 && monthDiff < 12) {
      const index = 11 - monthDiff
      completionData[index].total += 1
      if (ride.status === "COMPLETED") {
        completionData[index].completed += 1
      }
    }
  })

  // Calculate rates
  completionData.forEach((data) => {
    data.rate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
  })

  return completionData
}
