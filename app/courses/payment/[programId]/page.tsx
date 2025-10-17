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
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Script from "next/script";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CourseProgram {
  id: string;
  title: string;
  duration: string;
  price: number;
}

export default function CoursePaymentPage() {
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<CourseProgram | null>(null);
  const params = useParams<{ programId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const enrollmentId = searchParams.get("enrollmentId");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchProgram();
  }, [params.programId]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/programs/${params.programId}`);
      const result = await response.json();

      if (result.success) {
        setProgram(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Program not found",
          variant: "destructive",
        });
        router.push("/courses");
      }
    } catch (error) {
      console.error("Error fetching program:", error);
      toast({
        title: "Error",
        description: "Failed to load program details",
        variant: "destructive",
      });
      router.push("/courses");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!program) return;
    setIsProcessing(true);

    try {
      // Create order on backend
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: program.price * 100 }), // in paise
      });
      const orderData = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: program.price * 100,
        currency: "INR",
        name: "Shivam Tiwari Courses",
        description: program.title,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          toast({
            title: "Payment Successful 🎉",
            description: `You are now enrolled in ${program.title}`,
          });

          setPaymentSuccess(true);

          // redirect after success
          setTimeout(() => {
            router.push(`/courses`);
          }, 3000);
        },
        prefill: {
          name: "Shivam Tiwari",
          email: "thor@gmail.com",
          contact: "1234567890",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!program) {
    return (
      <div className="container py-8 max-w-6xl">
        <div className="text-center">
          <p className="text-red-500 mb-4">Program not found</p>
          <Link href="/courses">
            <Button>Back to Courses</Button>
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
          href="/courses"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
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

                {paymentSuccess ? (
                  <>
                    <Link href={`/courses/enroll/${program.id}`}>
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
                      : `Pay ${program.price.toLocaleString()}`}
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
                  {program.duration} • Comprehensive Course
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{program.price.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
