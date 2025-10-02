"use client"
import { createContext, useContext, useState, ReactNode } from "react"

interface ProgramData {
  id: string
  title: string
  duration: string
  price: number
  originalPrice: number
}

interface EnrollmentContextType {
  programData: ProgramData | null
  setProgramData: (data: ProgramData) => void
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined)

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [programData, setProgramData] = useState<ProgramData | null>(null)

  return (
    <EnrollmentContext.Provider value={{ programData, setProgramData }}>
      {children}
    </EnrollmentContext.Provider>
  )
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext)
  if (!context) throw new Error("useEnrollment must be used within EnrollmentProvider")
  return context
}