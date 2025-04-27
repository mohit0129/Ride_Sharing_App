"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface GenerateReportButtonProps {
  onClick: () => void
  isLoading?: boolean
}

export function GenerateReportButton({ onClick, isLoading = false }: GenerateReportButtonProps) {
  return (
    <Button onClick={onClick} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
      <FileText className="mr-2 h-4 w-4" />
      Generate Report
    </Button>
  )
}
