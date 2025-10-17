"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Script from "next/script";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface TrainingProgram {
  id: string;
  title: string;
  duration: string;
  price: number;
  originalPrice: number;
}

export default function PaymentPage() {
  const [programLoading, setProgramLoading] = useState(true);
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const enrollmentId = searchParams.get("enrollmentId");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // ✅ Tracks payment success

  useEffect(() => {
    fetchProgram();
  }, [params.programId]);

  const fetchProgram = async () => {
    try {
      setProgramLoading(true);
      const response = await fetch(
        `/api/training/programs/${params.programId}`
      );
      const result = await response.json();

      if (result.success) {
        setProgram(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Program not found",
          variant: "destructive",
        });
        router.push("/training");
      }
    } catch (error) {
      console.error("Error fetching program:", error);
      toast({
        title: "Error",
        description: "Failed to load program details",
        variant: "destructive",
      });
      router.push("/training");
    } finally {
      setProgramLoading(false);
    }
  };

// replace the existing handlePayment with this (client-side code in page.tsx)
const handlePayment = async () => {
  if (!program) return;
  setIsProcessing(true);

  try {
    // Call the existing order endpoint (same one used by courses)
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // razorpay/order route expects an 'amount' (in paise) or numeric value based on implementation.
      // program.price seems to be rupees in your code, so convert to paise.
      body: JSON.stringify({ amount: Math.round(program.price * 100), programId: program.id }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Failed to create order");
    }

    const data = await res.json();
    // your order route returns { success: true, order }
    const order = data?.order ?? data?.order?.id ? data.order : null;
    if (!order || !order.id) throw new Error("Order creation failed");

    // load razorpay sdk if needed (you already include Script in the file — this is safe as-is)
    if (!(window as any).Razorpay) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(s);
      });
    }

    const options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // ensure NEXT_PUBLIC_RAZORPAY_KEY_ID is set
      amount: Math.round(program.price * 100),
      currency: "INR",
      name: "Your Platform Name", // update as needed
      description: program.title || `Enrollment: ${program.id}`,
      order_id: order.id,
      handler: async function (response: any) {
        // response has razorpay_payment_id, razorpay_order_id, razorpay_signature
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              // If your verify route requires enrollment or user info, pass it here.
              // The existing verify route implementation in your repo expects to be able to deduce user via Clerk session server-side.
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData?.success) {
            throw new Error(verifyData?.message || "Payment verification failed");
          }

          // on success redirect to dashboard or trainings list
          router.push("/dashboard"); // or the path you prefer
        } catch (err: any) {
          console.error("Verification failed:", err);
          toast({
            title: "Payment Verification Failed",
            description: "Payment succeeded but verification failed. Contact support.",
            variant: "destructive",
          });
        }
      },
        prefill: {
        name: "", // Provide user name here if available
        email: "", // Provide user email here if available
        contact: "", // Provide user phone here if available
      },
      notes: { programId: program.id },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error: any) {
    console.error("Payment error:", error);
    toast({
      title: "Payment Error",
      description: error.message || "Payment initialization failed",
      variant: "destructive",
    });
  } finally {
    setIsProcessing(false);
  }
};


  if (!program) {
    return (
      <div className="container py-8 max-w-6xl">
        <div className="text-center">
          <p className="text-red-500 mb-4">Program not found</p>
          <Link href="/training">
            <Button>Back to Training Programs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/training"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Training Programs
        </Link>
        <h1 className="text-3xl font-bold">Complete Your Payment</h1>
        <p className="text-muted-foreground mt-2">
          Secure payment for {program.title}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
              <CardDescription>
                Choose your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Shield className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-medium mb-2">
                  Secure Payment Gateway
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your payment is processed securely through our trusted payment
                  partners
                </p>

                {/* ✅ Dynamic Button */}
                {paymentSuccess ? (
                  <>
                    <Link href={`/training/enroll/${program.id}`}>
                      <Button
                        size="lg"
                        className="w-full max-w-md bg-green-600 hover:bg-green-700"
                      >
                        Go to Course
                      </Button>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-2">
                      Redirecting to your course in 3 seconds...
                    </p>
                  </>
                ) : (
                  <Button
                    onClick={handlePayment}
                    size="lg"
                    disabled={isProcessing}
                    className="w-full max-w-md"
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Pay ₹${program.price.toLocaleString()}`}
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  SSL Encrypted
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Money Back Guarantee
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{program.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {program.duration} • Comprehensive Training
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Course Price</span>
                  <span className="line-through text-muted-foreground">
                    ₹{program.originalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">
                    -₹{(program.originalPrice - program.price).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{program.price.toLocaleString()}</span>
                </div>
              </div>

              <Badge variant="secondary" className="w-full justify-center">
                Save{" "}
                {Math.round(
                  ((program.originalPrice - program.price) /
                    program.originalPrice) *
                    100
                )}
                %
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// "use client"
// import React, {useEffect, useState} from "react"
// import { useParams, useSearchParams, useRouter } from "next/navigation"
// import { ArrowLeft, CreditCard, Shield, CheckCircle, Contact } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import Link from "next/link"
// import Script from "next/script"
// import { toast } from "@/hooks/use-toast"

//   declare global {
//     interface Window {
//       Razorpay: any
//     }
//   }

// interface TrainingProgram {
//   id: string
//   title: string
//   duration: string
//   price: number
//   originalPrice: number
// }

// export default function PaymentPage() {

//   const [programLoading, setProgramLoading] = useState(true)
//   const [program, setProgram] = useState<TrainingProgram | null>(null)
//   const params = useParams()
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const enrollmentId = searchParams.get("enrollmentId")
//   // const AMOUNT = 100;
//   const [isProcessing, setIsProcessing] = useState(false);

//   useEffect(() => {
//       fetchProgram()
//     }, [params.programId])

//     const fetchProgram = async () => {
//       try {
//         setProgramLoading(true)
//         const response = await fetch(`/api/training/programs/${params.programId}`)
//         const result = await response.json()

//         if (result.success) {
//           console.log("Fetched program:", result.data);
//           setProgram(result.data)
//         } else {
//           toast({
//             title: "Error",
//             description: result.error || "Program not found",
//             variant: "destructive",
//           })
//           router.push("/training")
//         }
//       } catch (error) {
//         console.error("Error fetching program:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load program details",
//           variant: "destructive",
//         })
//         router.push("/training")
//       } finally {
//         setProgramLoading(false)
//       }
//     }

//   // // Mock program data - in real app, fetch from database
//   // const program = {
//   //   title: "Full Stack Web Development",
//   //   duration: "6 months",
//   //   price: 15999,
//   //   originalPrice: 24999,
//   // }

//   const handlePayment = async () => {
//     if(!program) return;
//     // Here you would integrate with Razorpay or other payment gateway
//     // alert("Payment integration would be implemented here with Razorpay/Stripe")

//     setIsProcessing(true);

//     try {
//       const res = await fetch('/api/razorpay/create-order', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount: program.price * 100 }) // amount in paise
//       });
//       const orderData = await res.json();
//       // if (!res.ok) throw new Error(orderData.error || 'Failed to create order');

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Razorpay Key ID
//         amount: program.price * 100, // in paise
//         currency: "INR",
//         name: "Shivam Tiwari",
//         // description: program.title,
//         order_id: orderData.orderId,
//         handler: async function (response: any) {
//           alert(`Payment successful for ${program.title}`);
//         },
//         prefill: {
//           name:"Shivam Tiwari",
//           email: "thor@gmail.com",
//           contact: "1234567890",
//         },
//         theme: {
//           color: "#2563eb"
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on('payment.failed', function (response: any) {
//         alert('Payment failed: ' + response.error.description);
//       });
//       rzp.open();
//     }catch(err){
//       console.error("Payment failed", err);
//     } finally {
//       setIsProcessing(false);
//     }

//     // try {
//     //   // 1. Create order on the server
//     //   const orderRes = await fetch('/api/razorpay/create-order', {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify({ amount: AMOUNT * 100 }) // amount in paise
//     //   });
//     //   const orderData = await orderRes.json();
//     //   if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

//     //   // 2. Initialize Razorpay payment
//     //   const options = {
//     //     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Razorpay Key ID
//     //     amount: AMOUNT * 100, // in paise
//     //     currency: "INR",
//     //     name: "Enginow",
//     //     description: program.title,
//     //     order_id: orderData.orderId,
//     //     handler: async function (response: any) {
//     //       // 3. Verify payment on the server
//     //       const verifyRes = await fetch('/api/razorpay/verify', {
//     //         method: 'POST',
//     //         headers: { 'Content-Type': 'application/json' },
//     //         body: JSON.stringify({
//     //           razorpay_order_id: response.razorpay_order_id,
//     //           razorpay_payment_id: response.razorpay_payment_id,
//     //           razorpay_signature: response.razorpay_signature,
//     //           enrollmentData: { enrollmentId } // pass any additional data needed
//     //         })
//     //       });
//     //       const verifyData = await verifyRes.json();
//     //       if (verifyRes.ok && verifyData.success) {
//     //         alert('Payment successful! Enrollment ID: ' + verifyData.enrollment.id);
//     //         // Redirect or update UI as needed
//     //       } else {
//     //         throw new Error(verifyData.error || 'Payment verification failed');
//     //       }
//     //     },
//     //     prefill: {
//     //       name: "", // Add user's name if available
//     //       email: "", // Add user's email if available
//     //     },
//     //     theme: {
//     //       color: "#2563eb"
//     //     }
//     //   };

//     //   const rzp = new window.Razorpay(options);
//     //   rzp.on('payment.failed', function (response: any) {
//     //     alert('Payment failed: ' + response.error.description);
//     //   });
//     //   rzp.open();
//     // } catch (error: any) {
//     //   console.error("Payment error:", error);
//     //   alert("Error during payment: " + error.message);
//     // } finally {
//     //   setIsProcessing(false);
//     // }
//   }

//   if (!program) {
//     return (
//       <div className="container py-8 max-w-6xl">
//         <div className="text-center">
//           <p className="text-red-500 mb-4">Program not found</p>
//           <Link href="/training">
//             <Button>Back to Training Programs</Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container py-8 max-w-4xl">
//       <Script
//   src="https://checkout.razorpay.com/v1/checkout.js"
//   strategy="afterInteractive"
// />

//       {/* Header */}
//       <div className="mb-8">
//         <Link href="/training" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Training Programs
//         </Link>
//         <h1 className="text-3xl font-bold">Complete Your Payment</h1>
//         <p className="text-muted-foreground mt-2">Secure payment for {program.title}</p>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Payment Form */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CreditCard className="h-5 w-5" />
//                 Payment Details
//               </CardTitle>
//               <CardDescription>Choose your preferred payment method</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="text-center py-8">
//                 <Shield className="h-16 w-16 mx-auto mb-4 text-green-500" />
//                 <h3 className="text-lg font-medium mb-2">Secure Payment Gateway</h3>
//                 <p className="text-muted-foreground mb-6">
//                   Your payment is processed securely through our trusted payment partners
//                 </p>
//                 <Button onClick={handlePayment} size="lg" className="w-full max-w-md">
//                   Pay ₹{program.price.toLocaleString()}
//                 </Button>
//               </div>

//               <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
//                 <div className="flex items-center gap-1">
//                   <CheckCircle className="h-4 w-4 text-green-500" />
//                   SSL Encrypted
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <CheckCircle className="h-4 w-4 text-green-500" />
//                   Secure Payment
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <CheckCircle className="h-4 w-4 text-green-500" />
//                   Money Back Guarantee
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <h4 className="font-medium">{program.title}</h4>
//                 <p className="text-sm text-muted-foreground">{program.duration} • Comprehensive Training</p>
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>Course Price</span>
//                   <span className="line-through text-muted-foreground">₹{program.originalPrice.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Discount</span>
//                   <span className="text-green-600">-₹{(program.originalPrice - program.price).toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between font-medium text-lg">
//                   <span>Total</span>
//                   <span>₹{program.price.toLocaleString()}</span>
//                 </div>
//               </div>

//               <Badge variant="secondary" className="w-full justify-center">
//                 Save {Math.round(((program.originalPrice - program.price) / program.originalPrice) * 100)}%
//               </Badge>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
