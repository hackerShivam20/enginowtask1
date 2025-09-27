"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, CreditCard, User, Loader2, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Course {
  id: string
  title: string
  category: string
  duration: string
  price: number
  originalPrice: number
  isFree: boolean
  features: string[]
  highlights: string[]
  image: string
}

export default function CourseEnrollmentPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [courseLoading, setCourseLoading] = useState(true)
  const [course, setCourse] = useState<Course | null>(null)

  const [referralCodeValid, setReferralCodeValid] = useState<boolean | null>(null)
  const [checkingReferral, setCheckingReferral] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    education: "",
    experience: "",
    motivation: "",
    referralCode: "",
    agreeTerms: false,
  })

  useEffect(() => {
    fetchCourse()
  }, [params.courseId])

  const fetchCourse = async () => {
    try {
      setCourseLoading(true)
      const response = await fetch(`/api/courses/${params.courseId}`)
      const result = await response.json()

      if (result.success) {
        setCourse(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Course not found",
          variant: "destructive",
        })
        router.push("/courses")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      })
      router.push("/courses")
    } finally {
      setCourseLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "referralCode") setReferralCodeValid(null)
  }

  const validateReferralCode = async (code: string) => {
    if (!code.trim()) {
      setReferralCodeValid(null)
      return
    }
    setCheckingReferral(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const validCodes = ["COURSE50", "LEARN10", "SAVE20", "FRIEND30"]
    const isValid = validCodes.includes(code.toUpperCase())
    setReferralCodeValid(isValid)

    toast({
      title: isValid ? "✅ Referral Applied" : "❌ Invalid Referral",
      description: isValid
        ? "You’ll get a special discount!"
        : "This referral code is invalid or expired.",
      variant: isValid ? "default" : "destructive",
    })

    setCheckingReferral(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const enrollmentData = {
        ...formData,
        courseId: params.courseId as string,
        referralCodeValid,
      }

      const response = await fetch("/api/course-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrollmentData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "🎉 Enrollment Successful!",
          description: "You’ll get a confirmation email shortly.",
        })
        setTimeout(() => router.push("/courses"), 2000)
      } else {
        toast({
          title: "Enrollment Failed",
          description: result.error || "Please try again later",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    formData.city &&
    formData.state &&
    formData.education &&
    formData.experience &&
    formData.agreeTerms

  const getDiscountedPrice = () =>
    referralCodeValid && course ? Math.round(course.price * 0.9) : course?.price || 0

  const getDiscountAmount = () =>
    referralCodeValid && course ? Math.round(course.price * 0.1) : 0

  if (courseLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Course not found</p>
        <Link href="/courses">
          <Button>Back to Courses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-6xl">
      {/* Back Link */}
      <Link href="/courses" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
      </Link>

      <h1 className="text-3xl font-bold mb-6">Enroll in {course.title}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Personal Information
              </CardTitle>
              <CardDescription>Fill out the form to enroll in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>State *</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Education *</Label>
                    <Select onValueChange={(val) => handleInputChange("education", val)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelors">Bachelor’s</SelectItem>
                        <SelectItem value="masters">Master’s</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Experience *</Label>
                  <Select onValueChange={(val) => handleInputChange("experience", val)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fresher">Fresher</SelectItem>
                      <SelectItem value="1-2">1–2 years</SelectItem>
                      <SelectItem value="3-5">3–5 years</SelectItem>
                      <SelectItem value="5+">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Motivation</Label>
                  <Textarea
                    rows={3}
                    value={formData.motivation}
                    onChange={(e) => handleInputChange("motivation", e.target.value)}
                    placeholder="Why do you want to take this course?"
                  />
                </div>

                <div>
                  <Label>Referral Code</Label>
                  <Input
                    value={formData.referralCode}
                    onChange={(e) => handleInputChange("referralCode", e.target.value)}
                    onBlur={() => validateReferralCode(formData.referralCode)}
                    placeholder="Optional"
                    className={
                      referralCodeValid === true
                        ? "border-green-500"
                        : referralCodeValid === false
                        ? "border-red-500"
                        : ""
                    }
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                  />
                  <Label>I agree to the Terms & Conditions *</Label>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={!isFormValid || isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Enrollment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.duration}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!course.isFree && (
                <div>
                  <div className="flex justify-between items-center">
                    <span className={`text-2xl font-bold ${referralCodeValid ? "text-green-600" : ""}`}>
                      ₹{getDiscountedPrice().toLocaleString()}
                    </span>
                    <Badge variant="secondary">Premium</Badge>
                  </div>
                  {referralCodeValid && (
                    <p className="text-green-600 text-sm">You saved ₹{getDiscountAmount()}</p>
                  )}
                </div>
              )}

              <Separator />

              <h4 className="font-medium">What you’ll learn:</h4>
              <ul className="space-y-1 text-sm">
                {course.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" /> {h}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
