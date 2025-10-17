"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle2, CheckCircle, Gift, CreditCard, User, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CourseEnrollPage() {
  const router = useRouter();
  const { programId } = useParams();
    const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    linkedin: "",
    city: "",
    state: "",
    education: "",
    experience: "",
    motivation: "",
    agreeTerms: false,
    agreeMarketing: false,
  });


  // Simulated courses list
  const allCourses = [
    {
      id: "adv-java",
      title: "Advanced Java Programming",
      price: 999,
      description: "Take your Java skills to the next level.",
      includes: ["10+ hours of lectures", "Assignments", "Certificate"],
    },
    {
      id: "ml",
      title: "Machine Learning Fundamentals",
      price: 1499,
      description: "Introduction to ML concepts and algorithms.",
      includes: ["Projects", "Doubt Support", "Certificate"],
    },
    {
      id: "webdev",
      title: "Web Development Bootcamp",
      price: 1999,
      description: "Full-stack web development with modern technologies.",
      includes: ["Live Projects", "Community Access", "Certificate"],
    },
    {
      id: "dbms",
      title: "Database Management Systems",
      price: 799,
      description: "Learn the fundamentals of database design and management.",
      includes: ["Hands-on Labs", "Project Work", "Certificate"],
    },
    {
      id: "adv-algo",
      title: "Advanced Algorithms",
      price: 1299,
      description: "Deep dive into advanced algorithms and data structures.",
      includes: ["Live Projects", "Community Access", "Certificate"],
    },
  ];

  useEffect(() => {
    const found = allCourses.find((c) => c.id === programId);
    if (found) setCourse(found);
  }, [programId]);

  if (!course)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin" /> Loading course...
      </div>
    );

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePayment = async (e: any) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      toast.error("You must agree to the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Send email first (non-blocking, don’t wait for Razorpay)
      fetch("/api/courses/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(() => {
          console.log("Email sent");
        })
        .catch((err) => {
          console.error("Email failed", err);
        });

      // 1️⃣ Create Razorpay order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: course.price,
          programId: programId,
        }),
      });

      const { order } = await orderRes.json();

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Enginow",
        description: course.title,
        order_id: order.id,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              programId,
              enrollmentId: `ENR_${Date.now()}`,
              formData,
              amount: course.price,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success("Enrollment successful!");
            router.push("/user/dashboard");
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#6366f1" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    const handleInputChange = (field: string, value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

      const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        formData.city &&
        formData.state &&
        formData.education &&
        formData.experience &&
        formData.agreeTerms;

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/courses"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
        <h1 className="text-3xl font-bold">Enroll in {course?.title}</h1>
        <p className="text-muted-foreground mt-2">
          Complete your enrollment to start your journey in {course?.title}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Enrollment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Please provide your details to complete the enrollment process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          handleInputChange("whatsapp", e.target.value)
                        }
                        placeholder="Same as phone if different"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) =>
                        handleInputChange("linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Background Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="education">Highest Education *</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("education", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bachelors">
                          Bachelor's Degree
                        </SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Work Experience *</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("experience", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fresher">
                          Fresher (0 years)
                        </SelectItem>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="motivation">
                      Why do you want to join this program?
                    </Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) =>
                        handleInputChange("motivation", e.target.value)
                      }
                      placeholder="Tell us about your goals and motivation..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeTerms", checked as boolean)
                      }
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:underline"
                      >
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      *
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={formData.agreeMarketing}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeMarketing", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="marketing"
                      className="text-sm leading-relaxed"
                    >
                      I agree to receive marketing communications and course
                      updates
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Enrollment
                      <CreditCard className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Program Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">{course?.title}</CardTitle>
              <CardDescription>
                {course.duration} • Comprehensive Training
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold`}>₹{course?.price.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              {/* What's Included */}
              {/* <div>
                <h4 className="font-medium mb-3">What's Included:</h4>
                <div className="space-y-2">
                  {course.highlights.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div> */}

              <Separator />

              {/* Technologies */}
              {/* <div>
                <h4 className="font-medium mb-3">Technologies You'll Learn:</h4>
                <div className="flex flex-wrap gap-2">
                  {course.features.map((tech: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div> */}

              {/* Referral Benefits */}
              {/* <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Referral Benefits
                </h4>
                <p className="text-sm text-purple-700 mb-2">
                  Have a referral code? Get instant benefits!
                </p>
                <ul className="text-xs text-purple-600 space-y-1">
                  <li>• 10% instant discount on course fee</li>
                  <li>• Priority support during enrollment</li>
                  <li>• Exclusive community access</li>
                  <li>• Fast-track admission process</li>
                </ul>
              </div> */}

              {/* Support */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Have questions about the program? Our counselors are here to
                  help.
                </p>
                <a
                  href="https://wa.me/918935069570?text=Hey%20*Enginow*%20!%20I%20need%20a%20help"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Chat with Counselor
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    // <div className="container max-w-6xl py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
    //   {/* Left: Enrollment Form */}
    //   <div className="md:col-span-2">
    //     <h1 className="text-2xl font-semibold mb-2">
    //       Enroll in {course.title}
    //     </h1>
    //     <p className="text-muted-foreground mb-6">
    //       Complete your enrollment details below.
    //     </p>

    //     <form onSubmit={handlePayment} className="space-y-6">
    //       <Card>
    //         <CardHeader>
    //           <CardTitle>🧍 Personal Information</CardTitle>
    //         </CardHeader>
    //         <CardContent className="grid gap-4 md:grid-cols-2">
    //           <div>
    //             <Label>First Name</Label>
    //             <Input
    //               name="firstName"
    //               value={formData.firstName}
    //               onChange={handleChange}
    //               required
    //             />
    //           </div>
    //           <div>
    //             <Label>Last Name</Label>
    //             <Input
    //               name="lastName"
    //               value={formData.lastName}
    //               onChange={handleChange}
    //               required
    //             />
    //           </div>
    //           <div>
    //             <Label>Email Address</Label>
    //             <Input
    //               name="email"
    //               type="email"
    //               value={formData.email}
    //               onChange={handleChange}
    //               required
    //             />
    //           </div>
    //           <div>
    //             <Label>Phone Number</Label>
    //             <Input
    //               name="phone"
    //               value={formData.phone}
    //               onChange={handleChange}
    //               required
    //             />
    //           </div>
    //           <div>
    //             <Label>WhatsApp Number</Label>
    //             <Input
    //               name="whatsapp"
    //               value={formData.whatsapp}
    //               onChange={handleChange}
    //             />
    //           </div>
    //           <div>
    //             <Label>LinkedIn Profile</Label>
    //             <Input
    //               name="linkedin"
    //               placeholder="https://linkedin.com/in/username"
    //               value={formData.linkedin}
    //               onChange={handleChange}
    //             />
    //           </div>
    //           <div>
    //             <Label>City</Label>
    //             <Input
    //               name="city"
    //               value={formData.city}
    //               onChange={handleChange}
    //               required
    //             />
    //           </div>
    //           <div>
    //             <Label>State</Label>
    //             <Input
    //               name="state"
    //               value={formData.state}
    //               onChange={handleChange}
    //               required
    //             />
    //           </div>
    //           <div>
    //             <Label>Highest Education</Label>
    //             <Input
    //               name="education"
    //               placeholder="e.g. Bachelors, Masters"
    //               value={formData.education}
    //               onChange={handleChange}
    //               required
    //             />
    //           </div>
    //           <div>
    //             <Label>Work Experience</Label>
    //             <Input
    //               name="experience"
    //               placeholder="e.g. Fresher, 1-2 years"
    //               value={formData.experience}
    //               onChange={handleChange}
    //               required
    //             />
    //           </div>
    //           <div className="md:col-span-2">
    //             <Label>Motivation</Label>
    //             <Textarea
    //               name="motivation"
    //               placeholder="Why do you want to join this course?"
    //               value={formData.motivation}
    //               onChange={handleChange}
    //             />
    //           </div>
    //         </CardContent>
    //       </Card>

    //       {/* Terms & Submit */}
    //       <div className="space-y-3">
    //         <div className="flex items-start gap-2">
    //           <Checkbox
    //             name="agreeTerms"
    //             checked={formData.agreeTerms}
    //             onCheckedChange={(v) =>
    //               setFormData((prev) => ({ ...prev, agreeTerms: v as boolean }))
    //             }
    //           />
    //           <Label>
    //             I agree to the Terms and Conditions and Privacy Policy.
    //           </Label>
    //         </div>

    //         <div className="flex items-start gap-2">
    //           <Checkbox
    //             name="agreeMarketing"
    //             checked={formData.agreeMarketing}
    //             onCheckedChange={(v) =>
    //               setFormData((prev) => ({
    //                 ...prev,
    //                 agreeMarketing: v as boolean,
    //               }))
    //             }
    //           />
    //           <Label>
    //             I agree to receive marketing communications and updates.
    //           </Label>
    //         </div>

    //         <Button
    //           type="submit"
    //           className="w-full"
    //           size="lg"
    //           disabled={loading}
    //         >
    //           {loading ? (
    //             <>
    //               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
    //               Processing...
    //             </>
    //           ) : (
    //             <>
    //               Pay ₹{course.price.toLocaleString()}{" "}
    //               <CheckCircle2 className="h-4 w-4 ml-2" />
    //             </>
    //           )}
    //         </Button>
    //       </div>
    //     </form>
    //   </div>

    //   {/* Right: Summary Card */}
    //   <div>
    //     <Card className="sticky top-20">
    //       <CardHeader>
    //         <CardTitle>{course.title}</CardTitle>
    //         <p className="text-sm text-muted-foreground">
    //           {course.description}
    //         </p>
    //       </CardHeader>
    //       <CardContent>
    //         <Separator className="my-3" />
    //         <p className="text-3xl font-semibold mb-2">
    //           ₹{course.price.toLocaleString()}
    //         </p>
    //         <p className="text-sm mb-3 text-muted-foreground">
    //           What’s included:
    //         </p>
    //         <ul className="list-disc list-inside text-sm space-y-1 mb-4">
    //           {course.includes.map((item: string, i: number) => (
    //             <li key={i}>{item}</li>
    //           ))}
    //         </ul>
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   ArrowLeft,
//   CreditCard,
//   Loader2,
//   User,
//   CheckCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import { toast } from "sonner";
// import { loadScript } from "@/lib/utils";

// interface Course {
//   id: string;
//   title: string;
//   duration: string;
//   price: number;
//   highlights: string[];
//   features: string[];
// }

// export default function CourseEnrollmentPage() {
//   const router = useRouter();
//   const { programId } = useParams();
//   const [course, setCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     city: "",
//     state: "",
//     education: "",
//     experience: "",
//     motivation: "",
//     agreeTerms: false,
//     agreeMarketing: false,
//   });

//   const handleInputChange = (field: string, value: string | boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // 🔹 Fetch course details
//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const res = await fetch(`/api/courses/programs/${programId}`);
//         const data = await res.json();
//         // console.log("Program ID:", programId);
//         if (data.success) {
//           setCourse(data.data);
//         } else {
//           toast.error("Course not found");
//           router.push("/courses");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load course details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourse();
//   }, [programId, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const res = await fetch("/api/razorpay/order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: course?.price,
//           programId,
//           formData,
//         }),
//       });

//       const data = await res.json();
//       if (!data.success) throw new Error("Failed to create Razorpay order");

//       const resRzp = await loadScript(
//         "https://checkout.razorpay.com/v1/checkout.js"
//       );
//       if (!resRzp) {
//         toast.error("Razorpay SDK failed to load.");
//         return;
//       }

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: data.order.amount,
//         currency: "INR",
//         name: "Mr. White Gloves",
//         description: `Enrollment for ${course?.title}`,
//         order_id: data.order.id,
//         handler: async function (response: any) {
//           const verifyRes = await fetch("/api/razorpay/verify", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               ...response,
//               programId,
//               formData,
//               amount: course?.price,
//             }),
//           });
//           const verifyData = await verifyRes.json();
//           if (verifyData.success) {
//             toast.success("Enrollment successful!");
//             router.push("/dashboard");
//           } else {
//             toast.error("Payment verification failed.");
//           }
//         },
//         theme: { color: "#6C63FF" },
//       };

//       const paymentObject = new (window as any).Razorpay(options);
//       paymentObject.open();
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container py-8 max-w-6xl">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
//         </div>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="container py-8 max-w-6xl text-center">
//         <p className="text-red-500 mb-4">Course not found</p>
//         <Link href="/courses">
//           <Button>Back to Courses</Button>
//         </Link>
//       </div>
//     );
//   }

//   const isFormValid =
//     formData.firstName &&
//     formData.lastName &&
//     formData.email &&
//     formData.phone &&
//     formData.city &&
//     formData.state &&
//     formData.education &&
//     formData.experience &&
//     formData.agreeTerms;

//   return (
//     <div className="container py-8 max-w-6xl">
//       {/* Header */}
//       <div className="mb-8">
//         <Link
//           href="/courses"
//           className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Courses
//         </Link>
//         <h1 className="text-3xl font-bold">Enroll in {course?.title}</h1>
//         <p className="text-muted-foreground mt-2">
//           Complete your enrollment and start learning today.
//         </p>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Enrollment Form */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Personal Information
//               </CardTitle>
//               <CardDescription>
//                 Fill in your details to proceed with enrollment
//               </CardDescription>
//             </CardHeader>

//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Basic Info */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="firstName">First Name *</Label>
//                     <Input
//                       id="firstName"
//                       value={formData.firstName}
//                       onChange={(e) =>
//                         handleInputChange("firstName", e.target.value)
//                       }
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="lastName">Last Name *</Label>
//                     <Input
//                       id="lastName"
//                       value={formData.lastName}
//                       onChange={(e) =>
//                         handleInputChange("lastName", e.target.value)
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Contact */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="email">Email *</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) =>
//                         handleInputChange("email", e.target.value)
//                       }
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="phone">Phone *</Label>
//                     <Input
//                       id="phone"
//                       type="tel"
//                       value={formData.phone}
//                       onChange={(e) =>
//                         handleInputChange("phone", e.target.value)
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Location */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="city">City *</Label>
//                     <Input
//                       id="city"
//                       value={formData.city}
//                       onChange={(e) =>
//                         handleInputChange("city", e.target.value)
//                       }
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="state">State *</Label>
//                     <Input
//                       id="state"
//                       value={formData.state}
//                       onChange={(e) =>
//                         handleInputChange("state", e.target.value)
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Education & Experience */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="education">Education *</Label>
//                     <Select
//                       onValueChange={(value) =>
//                         handleInputChange("education", value)
//                       }
//                       required
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select your education" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="high-school">High School</SelectItem>
//                         <SelectItem value="diploma">Diploma</SelectItem>
//                         <SelectItem value="bachelors">
//                           Bachelor's Degree
//                         </SelectItem>
//                         <SelectItem value="masters">Master's Degree</SelectItem>
//                         <SelectItem value="phd">PhD</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label htmlFor="experience">Experience *</Label>
//                     <Select
//                       onValueChange={(value) =>
//                         handleInputChange("experience", value)
//                       }
//                       required
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select experience" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="fresher">
//                           Fresher (0 years)
//                         </SelectItem>
//                         <SelectItem value="1-2">1–2 years</SelectItem>
//                         <SelectItem value="3-5">3–5 years</SelectItem>
//                         <SelectItem value="5+">5+ years</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Motivation */}
//                 <div>
//                   <Label htmlFor="motivation">Motivation</Label>
//                   <Textarea
//                     id="motivation"
//                     value={formData.motivation}
//                     onChange={(e) =>
//                       handleInputChange("motivation", e.target.value)
//                     }
//                     placeholder="Why do you want to join this course?"
//                     rows={3}
//                   />
//                 </div>

//                 {/* Terms */}
//                 <div className="space-y-3">
//                   <div className="flex items-start space-x-2">
//                     <Checkbox
//                       id="terms"
//                       checked={formData.agreeTerms}
//                       onCheckedChange={(checked) =>
//                         handleInputChange("agreeTerms", checked as boolean)
//                       }
//                     />
//                     <Label htmlFor="terms" className="text-sm leading-relaxed">
//                       I agree to the{" "}
//                       <Link
//                         href="/terms"
//                         className="text-primary hover:underline"
//                       >
//                         Terms & Conditions
//                       </Link>{" "}
//                       and{" "}
//                       <Link
//                         href="/privacy"
//                         className="text-primary hover:underline"
//                       >
//                         Privacy Policy
//                       </Link>
//                       *
//                     </Label>
//                   </div>

//                   <div className="flex items-start space-x-2">
//                     <Checkbox
//                       id="marketing"
//                       checked={formData.agreeMarketing}
//                       onCheckedChange={(checked) =>
//                         handleInputChange("agreeMarketing", checked as boolean)
//                       }
//                     />
//                     <Label
//                       htmlFor="marketing"
//                       className="text-sm leading-relaxed"
//                     >
//                       I agree to receive course updates and notifications
//                     </Label>
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   size="lg"
//                   disabled={!isFormValid || isSubmitting}
//                   onClick={(e) => {
//                     if (!isFormValid) {
//                       e.preventDefault();
//                     } else {
//                       // handleProceed();
//                       router.push(`/courses/payment/${course.id}`);
//                     }
//                   }}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       Pay {course.price.toLocaleString()}{" "}
//                       <CreditCard className="h-4 w-4 ml-2" />
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Course Summary */}
//         <div className="lg:col-span-1">
//           <Card className="sticky top-8">
//             <CardHeader>
//               <CardTitle>{course.title}</CardTitle>
//               <CardDescription>{course.duration}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-2xl font-bold text-primary">
//                     {course.price.toLocaleString()}
//                   </span>
//                 </div>
//               </div>

//               <Separator />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// // "use client"

// // import { useEffect, useState } from "react"
// // import { useRouter, useParams } from "next/navigation"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { toast } from "sonner"
// // import { loadScript } from "@/lib/utils"

// // export default function CourseEnrollmentPage() {
// //   const router = useRouter()
// //   const { programId } = useParams()

// //   const [formData, setFormData] = useState({
// //     firstName: "",
// //     lastName: "",
// //     email: "",
// //     phone: "",
// //     city: "",
// //     state: "",
// //     education: "",
// //     experience: "",
// //     motivation: "",
// //     agreeTerms: false,
// //   })

// //   const [isSubmitting, setIsSubmitting] = useState(false)
// //   const [finalAmount, setFinalAmount] = useState(49900) // 499 Rs (in paise)

// //   // 🔹 Handle form inputs
// //   const handleChange = (e: any) => {
// //     const { name, value, type, checked } = e.target
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }))
// //   }

// //   // 🔹 Handle Razorpay Payment
// //   const handleSubmit = async (e: any) => {
// //     e.preventDefault()
// //     setIsSubmitting(true)

// //     try {
// //       const res = await fetch("/api/razorpay/order", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           amount: finalAmount,
// //           programId,
// //           formData,
// //         }),
// //       })

// //       const data = await res.json()
// //       if (!data.success) throw new Error("Failed to create Razorpay order")

// //       const resRzp = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
// //       if (!resRzp) {
// //         toast.error("Razorpay SDK failed to load.")
// //         return
// //       }

// //       const options = {
// //         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
// //         amount: data.order.amount,
// //         currency: "INR",
// //         name: "Mr. White Gloves",
// //         description: "Course Enrollment",
// //         order_id: data.order.id,
// //         handler: async function (response: any) {
// //           const verifyRes = await fetch("/api/razorpay/verify", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({
// //               ...response,
// //               programId,
// //               formData,
// //               amount: finalAmount,
// //             }),
// //           })
// //           const verifyData = await verifyRes.json()
// //           if (verifyData.success) {
// //             toast.success("Enrollment successful!")
// //             router.push("/dashboard")
// //           } else {
// //             toast.error("Payment verification failed.")
// //           }
// //         },
// //         theme: { color: "#6C63FF" },
// //       }

// //       const paymentObject = new (window as any).Razorpay(options)
// //       paymentObject.open()
// //     } catch (err) {
// //       console.error(err)
// //       toast.error("Something went wrong.")
// //     } finally {
// //       setIsSubmitting(false)
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
// //       <form
// //         onSubmit={handleSubmit}
// //         className="max-w-2xl w-full bg-white shadow-lg p-8 rounded-2xl space-y-6"
// //       >
// //         <h2 className="text-2xl font-bold text-gray-800 mb-4">
// //           Enroll for {programId?.toString().toUpperCase()} Course
// //         </h2>

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <Input name="firstName" placeholder="First Name" onChange={handleChange} required />
// //           <Input name="lastName" placeholder="Last Name" onChange={handleChange} required />
// //           <Input name="email" placeholder="Email" onChange={handleChange} required />
// //           <Input name="phone" placeholder="Phone" onChange={handleChange} required />
// //           <Input name="city" placeholder="City" onChange={handleChange} />
// //           <Input name="state" placeholder="State" onChange={handleChange} />
// //         </div>

// //         <Input name="education" placeholder="Education" onChange={handleChange} />
// //         <Input name="experience" placeholder="Experience" onChange={handleChange} />
// //         <Input name="motivation" placeholder="Why do you want to join?" onChange={handleChange} />

// //         <div className="flex items-center gap-2">
// //           <input
// //             type="checkbox"
// //             name="agreeTerms"
// //             checked={formData.agreeTerms}
// //             onChange={handleChange}
// //             required
// //           />
// //           <p className="text-sm text-gray-600">
// //             I agree to the Terms & Conditions
// //           </p>
// //         </div>

// //         <Button type="submit" disabled={isSubmitting} className="w-full">
// //           {isSubmitting ? "Processing..." : `Pay ₹${finalAmount / 100}`}
// //         </Button>
// //       </form>
// //     </div>
// //   )
// // }

// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useParams, useRouter } from "next/navigation";
// // // import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardDescription,
// // //   CardHeader,
// // //   CardTitle,
// // // } from "@/components/ui/card";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Textarea } from "@/components/ui/textarea";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import { Badge } from "@/components/ui/badge";
// // // import { Separator } from "@/components/ui/separator";
// // // import { useToast } from "@/hooks/use-toast";
// // // import Link from "next/link";

// // // interface CourseProgram {
// // //   id: string;
// // //   title: string;
// // //   category: string;
// // //   isFree: boolean;
// // //   image: string;
// // //   price?: string;
// // // }

// // // export default function CourseEnrollmentPage() {
// // //   const params = useParams<{ programId: string }>();
// // //   const router = useRouter();
// // //   const { toast } = useToast();

// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [courseLoading, setCourseLoading] = useState(true);
// // //   const [course, setCourse] = useState<CourseProgram | null>(null);

// // //   const [referralCodeValid, setReferralCodeValid] = useState<boolean | null>(
// // //     null
// // //   );
// // //   const [checkingReferral, setCheckingReferral] = useState(false);

// // // const [formData, setFormData] = useState({
// // //   firstName: "",
// // //   lastName: "",
// // //   email: "",
// // //   phone: "",
// // //   city: "",
// // //   state: "",
// // //   education: "",
// // //   experience: "",
// // //   motivation: "",
// // //   referralCode: "",
// // //   agreeTerms: false,
// // //   discountApplied: 0, // ✅ New
// // // });

// // //   // ✅ Fetch course when component mounts or param changes
// // //   useEffect(() => {
// // //     if (params?.programId) {
// // //       fetchCourse();
// // //     }
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [params?.programId]);

// // //   const fetchCourse = async () => {
// // //     try {
// // //       setCourseLoading(true);
// // //       const response = await fetch(`/api/courses/programs/${params.programId}`);
// // //       const result = await response.json();

// // //       if (result.success) {
// // //         setCourse(result.data);
// // //       } else {
// // //         toast({
// // //           title: "Error",
// // //           description: result.error || "Course not found",
// // //           variant: "destructive",
// // //         });
// // //         router.push("/courses");
// // //       }
// // //     } catch (error) {
// // //       toast({
// // //         title: "Error",
// // //         description: "Failed to load course details",
// // //         variant: "destructive",
// // //       });
// // //       router.push("/courses");
// // //     } finally {
// // //       setCourseLoading(false);
// // //     }
// // //   };

// // //   const handleInputChange = (field: string, value: string | boolean) => {
// // //     setFormData((prev) => ({ ...prev, [field]: value }));
// // //     if (field === "referralCode") setReferralCodeValid(null);
// // //   };

// // //   const validateReferralCode = async (code: string) => {
// // //     if (!code.trim()) {
// // //       setReferralCodeValid(null);
// // //       return;
// // //     }
// // //     setCheckingReferral(true);

// // //     // Mock validation delay
// // //     await new Promise((resolve) => setTimeout(resolve, 1000));

// // //     const validCodes = ["COURSE50", "LEARN10", "SAVE20", "FRIEND30"];
// // //     const isValid = validCodes.includes(code.toUpperCase());
// // //     setReferralCodeValid(isValid);

// // //     toast({
// // //       title: isValid ? "✅ Referral Applied" : "❌ Invalid Referral",
// // //       description: isValid
// // //         ? "You’ve unlocked a special discount!"
// // //         : "This referral code is invalid or expired.",
// // //       variant: isValid ? "default" : "destructive",
// // //     });

// // //     setCheckingReferral(false);
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();

// // //     if (!isFormValid) {
// // //       toast({
// // //         title: "Form Incomplete",
// // //         description: "Please fill all required fields.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     setIsLoading(true);

// // //     try {
// // //       // Step 1: create Razorpay order
// // //       const orderRes = await fetch("/api/razorpay/order", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({
// // //           amount: course?.price ? Number(course.price) * 100 : 0, // in paise
// // //           programId: params.programId,
// // //           formData,
// // //         }),
// // //       });

// // //       const { order } = await orderRes.json();

// // //       if (!order) throw new Error("Failed to create Razorpay order");

// // //       // Step 2: Open Razorpay checkout
// // //       const options = {
// // //         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
// // //         amount: order.amount,
// // //         currency: "INR",
// // //         name: "Mr. White Gloves Academy",
// // //         description: course?.title || "Course Enrollment",
// // //         order_id: order.id,
// // //         handler: async (response: any) => {
// // //           // Step 3: verify payment
// // //           const verifyRes = await fetch("/api/razorpay/verify", {
// // //             method: "POST",
// // //             headers: { "Content-Type": "application/json" },
// // //             body: JSON.stringify({
// // //               razorpay_order_id: response.razorpay_order_id,
// // //               razorpay_payment_id: response.razorpay_payment_id,
// // //               razorpay_signature: response.razorpay_signature,
// // //               programId: params.programId,
// // //               formData,
// // //               amount: order.amount,
// // //             }),
// // //           });

// // //           const verifyData = await verifyRes.json();

// // //           if (verifyData.success) {
// // //             toast({
// // //               title: "🎉 Payment Successful!",
// // //               description: "Enrollment confirmed. Check your dashboard.",
// // //             });
// // //             router.push("/dashboard");
// // //           } else {
// // //             toast({
// // //               title: "Verification Failed",
// // //               description: verifyData.message || "Please contact support.",
// // //               variant: "destructive",
// // //             });
// // //           }
// // //         },
// // //         prefill: {
// // //           name: `${formData.firstName} ${formData.lastName}`,
// // //           email: formData.email,
// // //           contact: formData.phone,
// // //         },
// // //         theme: { color: "#6C47FF" },
// // //       };

// // //       const rzp = new (window as any).Razorpay(options);
// // //       rzp.open();
// // //     } catch (error: any) {
// // //       toast({
// // //         title: "Error",
// // //         description: error.message || "Payment initialization failed.",
// // //         variant: "destructive",
// // //       });
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   // ✅ Validation
// // //   const isFormValid =
// // //     formData.firstName &&
// // //     formData.lastName &&
// // //     formData.email &&
// // //     formData.phone &&
// // //     formData.city &&
// // //     formData.state &&
// // //     formData.education &&
// // //     formData.experience &&
// // //     formData.agreeTerms;

// // //   // ✅ Dynamic pricing

// // //   // ✅ Loader
// // //   if (courseLoading) {
// // //     return (
// // //       <div className="flex justify-center items-center min-h-[400px]">
// // //         <Loader2 className="h-8 w-8 animate-spin text-primary" />
// // //       </div>
// // //     );
// // //   }

// // //   // ✅ Not found
// // //   if (!course) {
// // //     return (
// // //       <div className="text-center py-12">
// // //         <p className="text-red-500 mb-4">Course not found</p>
// // //         <Link href="/courses">
// // //           <Button>Back to Courses</Button>
// // //         </Link>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="container py-8 max-w-6xl">
// // //       {/* Back Link */}
// // //       <Link
// // //         href="/courses"
// // //         className="flex items-center text-muted-foreground hover:text-foreground mb-4"
// // //       >
// // //         <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
// // //       </Link>

// // //       <h1 className="text-3xl font-bold mb-6">Enroll in {course.title}</h1>

// // //       <div className="grid lg:grid-cols-3 gap-8">
// // //         {/* Form Section */}
// // //         <div className="lg:col-span-2">
// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle className="flex items-center gap-2">
// // //                 Enrollment Details
// // //               </CardTitle>
// // //               <CardDescription>
// // //                 Fill out your details to enroll in this course.
// // //               </CardDescription>
// // //             </CardHeader>
// // //             <CardContent>
// // //               <form onSubmit={handleSubmit} className="space-y-6">
// // //                 {/* Basic Info */}
// // //                 <div className="grid md:grid-cols-2 gap-4">
// // //                   <div>
// // //                     <Label>First Name *</Label>
// // //                     <Input
// // //                       value={formData.firstName}
// // //                       onChange={(e) =>
// // //                         handleInputChange("firstName", e.target.value)
// // //                       }
// // //                       required
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <Label>Last Name *</Label>
// // //                     <Input
// // //                       value={formData.lastName}
// // //                       onChange={(e) =>
// // //                         handleInputChange("lastName", e.target.value)
// // //                       }
// // //                       required
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div>
// // //                   <Label>Email *</Label>
// // //                   <Input
// // //                     type="email"
// // //                     value={formData.email}
// // //                     onChange={(e) => handleInputChange("email", e.target.value)}
// // //                     required
// // //                   />
// // //                 </div>

// // //                 <div className="grid md:grid-cols-2 gap-4">
// // //                   <div>
// // //                     <Label>Phone *</Label>
// // //                     <Input
// // //                       type="tel"
// // //                       value={formData.phone}
// // //                       onChange={(e) =>
// // //                         handleInputChange("phone", e.target.value)
// // //                       }
// // //                       required
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <Label>City *</Label>
// // //                     <Input
// // //                       value={formData.city}
// // //                       onChange={(e) =>
// // //                         handleInputChange("city", e.target.value)
// // //                       }
// // //                       required
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div className="grid md:grid-cols-2 gap-4">
// // //                   <div>
// // //                     <Label>State *</Label>
// // //                     <Input
// // //                       value={formData.state}
// // //                       onChange={(e) =>
// // //                         handleInputChange("state", e.target.value)
// // //                       }
// // //                       required
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <Label>Education *</Label>
// // //                     <Select
// // //                       onValueChange={(val) =>
// // //                         handleInputChange("education", val)
// // //                       }
// // //                     >
// // //                       <SelectTrigger>
// // //                         <SelectValue placeholder="Select education" />
// // //                       </SelectTrigger>
// // //                       <SelectContent>
// // //                         <SelectItem value="bachelors">Bachelor’s</SelectItem>
// // //                         <SelectItem value="masters">Master’s</SelectItem>
// // //                         <SelectItem value="phd">PhD</SelectItem>
// // //                       </SelectContent>
// // //                     </Select>
// // //                   </div>
// // //                 </div>

// // //                 <div>
// // //                   <Label>Experience *</Label>
// // //                   <Select
// // //                     onValueChange={(val) =>
// // //                       handleInputChange("experience", val)
// // //                     }
// // //                   >
// // //                     <SelectTrigger>
// // //                       <SelectValue placeholder="Select experience" />
// // //                     </SelectTrigger>
// // //                     <SelectContent>
// // //                       <SelectItem value="fresher">Fresher</SelectItem>
// // //                       <SelectItem value="1-2">1–2 years</SelectItem>
// // //                       <SelectItem value="3-5">3–5 years</SelectItem>
// // //                       <SelectItem value="5+">5+ years</SelectItem>
// // //                     </SelectContent>
// // //                   </Select>
// // //                 </div>

// // //                 <div>
// // //                   <Label>Motivation</Label>
// // //                   <Textarea
// // //                     rows={3}
// // //                     value={formData.motivation}
// // //                     onChange={(e) =>
// // //                       handleInputChange("motivation", e.target.value)
// // //                     }
// // //                     placeholder="Why do you want to take this course?"
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <Label>Referral Code</Label>
// // //                   <Input
// // //                     value={formData.referralCode}
// // //                     onChange={(e) =>
// // //                       handleInputChange("referralCode", e.target.value)
// // //                     }
// // //                     onBlur={() => validateReferralCode(formData.referralCode)}
// // //                     placeholder="Optional"
// // //                     className={
// // //                       referralCodeValid === true
// // //                         ? "border-green-500"
// // //                         : referralCodeValid === false
// // //                         ? "border-red-500"
// // //                         : ""
// // //                     }
// // //                   />
// // //                   {checkingReferral && (
// // //                     <p className="text-xs text-muted-foreground mt-1">
// // //                       Checking referral...
// // //                     </p>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex items-start gap-2">
// // //                   <Checkbox
// // //                     checked={formData.agreeTerms}
// // //                     onCheckedChange={(checked) =>
// // //                       handleInputChange("agreeTerms", checked as boolean)
// // //                     }
// // //                   />
// // //                   <Label>I agree to the Terms & Conditions *</Label>
// // //                 </div>

// // //                 <Button
// // //                   type="submit"
// // //                   className="w-full"
// // //                   size="lg"
// // //                   disabled={!isFormValid || isLoading}
// // //                 >
// // //                   {isLoading ? (
// // //                     <Loader2 className="h-4 w-4 animate-spin" />
// // //                   ) : (
// // //                     "Submit Enrollment"
// // //                   )}
// // //                 </Button>
// // //               </form>
// // //             </CardContent>
// // //           </Card>
// // //         </div>

// // //         {/* Summary Section */}
// // //         <div>
// // //           <Card className="sticky top-8">
// // //             <CardHeader>
// // //               <CardTitle>{course.title}</CardTitle>
// // //             </CardHeader>
// // //             <CardContent className="space-y-4">
// // //               {!course.isFree && (
// // //                 <div>
// // //                   <div className="flex justify-between items-center">
// // //                     <span className="text-2xl font-bold">{course.price}</span>
// // //                     <Badge variant="secondary">Premium</Badge>
// // //                   </div>
// // //                   {referralCodeValid && (
// // //                     <p className="text-green-600 text-sm">You saved ₹100</p>
// // //                   )}
// // //                 </div>
// // //               )}

// // //               <Separator />
// // //             </CardContent>
// // //           </Card>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // "use client"

// // // // import type React from "react"
// // // // import { useState, useEffect } from "react"
// // // // import { useParams, useRouter } from "next/navigation"
// // // // import { ArrowLeft, CheckCircle, CreditCard, User, Loader2, Gift } from "lucide-react"
// // // // import { Button } from "@/components/ui/button"
// // // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // // // import { Input } from "@/components/ui/input"
// // // // import { Label } from "@/components/ui/label"
// // // // import { Textarea } from "@/components/ui/textarea"
// // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // // // import { Checkbox } from "@/components/ui/checkbox"
// // // // import { Badge } from "@/components/ui/badge"
// // // // import { Separator } from "@/components/ui/separator"
// // // // import { useToast } from "@/hooks/use-toast"
// // // // import Link from "next/link"

// // // // interface CourseProgram {
// // // //   id: string
// // // //   title: string
// // // //   category: string
// // // //   duration: string
// // // //   price: number
// // // //   originalPrice: number
// // // //   isFree: boolean
// // // //   features: string[]
// // // //   highlights: string[]
// // // //   image: string
// // // // }

// // // // export default function CourseEnrollmentPage() {
// // // //   const params = useParams()
// // // //   const router = useRouter()
// // // //   const { toast } = useToast()

// // // //   const [isLoading, setIsLoading] = useState(false)
// // // //   const [courseLoading, setCourseLoading] = useState(true)
// // // //   const [course, setCourse] = useState<CourseProgram | null>(null)

// // // //   const [referralCodeValid, setReferralCodeValid] = useState<boolean | null>(null)
// // // //   const [checkingReferral, setCheckingReferral] = useState(false)

// // // //   const [formData, setFormData] = useState({
// // // //     firstName: "",
// // // //     lastName: "",
// // // //     email: "",
// // // //     phone: "",
// // // //     city: "",
// // // //     state: "",
// // // //     education: "",
// // // //     experience: "",
// // // //     motivation: "",
// // // //     referralCode: "",
// // // //     agreeTerms: false,
// // // //   })

// // // //   useEffect(() => {
// // // //     fetchCourse()
// // // //   }, [params.courseId])

// // // //   const fetchCourse = async () => {
// // // //     try {
// // // //       setCourseLoading(true)
// // // //       const response = await fetch(`/api/courses/${params.courseId}`)
// // // //       const result = await response.json()

// // // //       if (result.success) {
// // // //         setCourse(result.data)
// // // //       } else {
// // // //         toast({
// // // //           title: "Error",
// // // //           description: result.error || "Course not found",
// // // //           variant: "destructive",
// // // //         })
// // // //         router.push("/courses")
// // // //       }
// // // //     } catch (error) {
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Failed to load course details",
// // // //         variant: "destructive",
// // // //       })
// // // //       router.push("/courses")
// // // //     } finally {
// // // //       setCourseLoading(false)
// // // //     }
// // // //   }

// // // //   const handleInputChange = (field: string, value: string | boolean) => {
// // // //     setFormData((prev) => ({ ...prev, [field]: value }))
// // // //     if (field === "referralCode") setReferralCodeValid(null)
// // // //   }

// // // //   const validateReferralCode = async (code: string) => {
// // // //     if (!code.trim()) {
// // // //       setReferralCodeValid(null)
// // // //       return
// // // //     }
// // // //     setCheckingReferral(true)

// // // //     await new Promise((resolve) => setTimeout(resolve, 1000))

// // // //     const validCodes = ["COURSE50", "LEARN10", "SAVE20", "FRIEND30"]
// // // //     const isValid = validCodes.includes(code.toUpperCase())
// // // //     setReferralCodeValid(isValid)

// // // //     toast({
// // // //       title: isValid ? "✅ Referral Applied" : "❌ Invalid Referral",
// // // //       description: isValid
// // // //         ? "You’ll get a special discount!"
// // // //         : "This referral code is invalid or expired.",
// // // //       variant: isValid ? "default" : "destructive",
// // // //     })

// // // //     setCheckingReferral(false)
// // // //   }

// // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // //     e.preventDefault()
// // // //     setIsLoading(true)
// // // //     try {
// // // //       const enrollmentData = {
// // // //         ...formData,
// // // //         courseId: params.courseId as string,
// // // //         referralCodeValid,
// // // //       }

// // // //       const response = await fetch("/api/course-enrollments", {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify(enrollmentData),
// // // //       })

// // // //       const result = await response.json()

// // // //       if (result.success) {
// // // //         toast({
// // // //           title: "🎉 Enrollment Successful!",
// // // //           description: "You’ll get a confirmation email shortly.",
// // // //         })
// // // //         setTimeout(() => router.push("/courses"), 2000)
// // // //       } else {
// // // //         toast({
// // // //           title: "Enrollment Failed",
// // // //           description: result.error || "Please try again later",
// // // //           variant: "destructive",
// // // //         })
// // // //       }
// // // //     } catch (error) {
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Something went wrong",
// // // //         variant: "destructive",
// // // //       })
// // // //     } finally {
// // // //       setIsLoading(false)
// // // //     }
// // // //   }

// // // //   const isFormValid =
// // // //     formData.firstName &&
// // // //     formData.lastName &&
// // // //     formData.email &&
// // // //     formData.phone &&
// // // //     formData.city &&
// // // //     formData.state &&
// // // //     formData.education &&
// // // //     formData.experience &&
// // // //     formData.agreeTerms

// // // //   const getDiscountedPrice = () =>
// // // //     referralCodeValid && course ? Math.round(course.price * 0.9) : course?.price || 0

// // // //   const getDiscountAmount = () =>
// // // //     referralCodeValid && course ? Math.round(course.price * 0.1) : 0

// // // //   if (courseLoading) {
// // // //     return (
// // // //       <div className="flex justify-center items-center min-h-[400px]">
// // // //         <Loader2 className="h-8 w-8 animate-spin" />
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if (!course) {
// // // //     return (
// // // //       <div className="text-center py-12">
// // // //         <p className="text-red-500">Course not found</p>
// // // //         <Link href="/courses">
// // // //           <Button>Back to Courses</Button>
// // // //         </Link>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return (
// // // //     <div className="container py-8 max-w-6xl">
// // // //       {/* Back Link */}
// // // //       <Link href="/courses" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
// // // //         <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
// // // //       </Link>

// // // //       <h1 className="text-3xl font-bold mb-6">Enroll in {course.title}</h1>

// // // //       <div className="grid lg:grid-cols-3 gap-8">
// // // //         {/* Form */}
// // // //         <div className="lg:col-span-2">
// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <User className="h-5 w-5" /> Personal Information
// // // //               </CardTitle>
// // // //               <CardDescription>Fill out the form to enroll in this course</CardDescription>
// // // //             </CardHeader>
// // // //             <CardContent>
// // // //               <form onSubmit={handleSubmit} className="space-y-6">
// // // //                 <div className="grid md:grid-cols-2 gap-4">
// // // //                   <div>
// // // //                     <Label>First Name *</Label>
// // // //                     <Input
// // // //                       value={formData.firstName}
// // // //                       onChange={(e) => handleInputChange("firstName", e.target.value)}
// // // //                       required
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <Label>Last Name *</Label>
// // // //                     <Input
// // // //                       value={formData.lastName}
// // // //                       onChange={(e) => handleInputChange("lastName", e.target.value)}
// // // //                       required
// // // //                     />
// // // //                   </div>
// // // //                 </div>

// // // //                 <div>
// // // //                   <Label>Email *</Label>
// // // //                   <Input
// // // //                     type="email"
// // // //                     value={formData.email}
// // // //                     onChange={(e) => handleInputChange("email", e.target.value)}
// // // //                     required
// // // //                   />
// // // //                 </div>

// // // //                 <div className="grid md:grid-cols-2 gap-4">
// // // //                   <div>
// // // //                     <Label>Phone *</Label>
// // // //                     <Input
// // // //                       type="tel"
// // // //                       value={formData.phone}
// // // //                       onChange={(e) => handleInputChange("phone", e.target.value)}
// // // //                       required
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <Label>City *</Label>
// // // //                     <Input
// // // //                       value={formData.city}
// // // //                       onChange={(e) => handleInputChange("city", e.target.value)}
// // // //                       required
// // // //                     />
// // // //                   </div>
// // // //                 </div>

// // // //                 <div className="grid md:grid-cols-2 gap-4">
// // // //                   <div>
// // // //                     <Label>State *</Label>
// // // //                     <Input
// // // //                       value={formData.state}
// // // //                       onChange={(e) => handleInputChange("state", e.target.value)}
// // // //                       required
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <Label>Education *</Label>
// // // //                     <Select onValueChange={(val) => handleInputChange("education", val)} required>
// // // //                       <SelectTrigger>
// // // //                         <SelectValue placeholder="Select education" />
// // // //                       </SelectTrigger>
// // // //                       <SelectContent>
// // // //                         <SelectItem value="bachelors">Bachelor’s</SelectItem>
// // // //                         <SelectItem value="masters">Master’s</SelectItem>
// // // //                         <SelectItem value="phd">PhD</SelectItem>
// // // //                       </SelectContent>
// // // //                     </Select>
// // // //                   </div>
// // // //                 </div>

// // // //                 <div>
// // // //                   <Label>Experience *</Label>
// // // //                   <Select onValueChange={(val) => handleInputChange("experience", val)} required>
// // // //                     <SelectTrigger>
// // // //                       <SelectValue placeholder="Select experience" />
// // // //                     </SelectTrigger>
// // // //                     <SelectContent>
// // // //                       <SelectItem value="fresher">Fresher</SelectItem>
// // // //                       <SelectItem value="1-2">1–2 years</SelectItem>
// // // //                       <SelectItem value="3-5">3–5 years</SelectItem>
// // // //                       <SelectItem value="5+">5+ years</SelectItem>
// // // //                     </SelectContent>
// // // //                   </Select>
// // // //                 </div>

// // // //                 <div>
// // // //                   <Label>Motivation</Label>
// // // //                   <Textarea
// // // //                     rows={3}
// // // //                     value={formData.motivation}
// // // //                     onChange={(e) => handleInputChange("motivation", e.target.value)}
// // // //                     placeholder="Why do you want to take this course?"
// // // //                   />
// // // //                 </div>

// // // //                 <div>
// // // //                   <Label>Referral Code</Label>
// // // //                   <Input
// // // //                     value={formData.referralCode}
// // // //                     onChange={(e) => handleInputChange("referralCode", e.target.value)}
// // // //                     onBlur={() => validateReferralCode(formData.referralCode)}
// // // //                     placeholder="Optional"
// // // //                     className={
// // // //                       referralCodeValid === true
// // // //                         ? "border-green-500"
// // // //                         : referralCodeValid === false
// // // //                         ? "border-red-500"
// // // //                         : ""
// // // //                     }
// // // //                   />
// // // //                 </div>

// // // //                 <div className="flex items-start gap-2">
// // // //                   <Checkbox
// // // //                     checked={formData.agreeTerms}
// // // //                     onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
// // // //                   />
// // // //                   <Label>I agree to the Terms & Conditions *</Label>
// // // //                 </div>

// // // //                 <Button type="submit" className="w-full" size="lg" disabled={!isFormValid || isLoading}>
// // // //                   {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Enrollment"}
// // // //                 </Button>
// // // //               </form>
// // // //             </CardContent>
// // // //           </Card>
// // // //         </div>

// // // //         {/* Summary */}
// // // //         <div>
// // // //           <Card className="sticky top-8">
// // // //             <CardHeader>
// // // //               <CardTitle>{course.title}</CardTitle>
// // // //               <CardDescription>{course.duration}</CardDescription>
// // // //             </CardHeader>
// // // //             <CardContent className="space-y-4">
// // // //               {!course.isFree && (
// // // //                 <div>
// // // //                   <div className="flex justify-between items-center">
// // // //                     <span className={`text-2xl font-bold ${referralCodeValid ? "text-green-600" : ""}`}>
// // // //                       ₹{getDiscountedPrice().toLocaleString()}
// // // //                     </span>
// // // //                     <Badge variant="secondary">Premium</Badge>
// // // //                   </div>
// // // //                   {referralCodeValid && (
// // // //                     <p className="text-green-600 text-sm">You saved ₹{getDiscountAmount()}</p>
// // // //                   )}
// // // //                 </div>
// // // //               )}

// // // //               <Separator />

// // // //               <h4 className="font-medium">What you’ll learn:</h4>
// // // //               <ul className="space-y-1 text-sm">
// // // //                 {course.highlights.map((h, i) => (
// // // //                   <li key={i} className="flex items-center gap-1">
// // // //                     <CheckCircle className="h-4 w-4 text-green-500" /> {h}
// // // //                   </li>
// // // //                 ))}
// // // //               </ul>
// // // //             </CardContent>
// // // //           </Card>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }
