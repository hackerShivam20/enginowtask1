"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, BookOpen } from "lucide-react";

export default function UserDashboardPage() {
  const { user, isLoaded } = useUser();
  const [enrolledPrograms, setEnrolledPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!isLoaded || !user) return;

  const fetchEnrollments = async () => {
    try {
      const res = await fetch("/api/enrollments/user");
      const result = await res.json();
      console.log("Fetch result:", result);

      if (result.success) {
        setEnrolledPrograms(result.data);
      } else {
        console.error("Error:", result.error);
      }
    } catch (err) {
      console.error("Error loading enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchEnrollments();
}, [isLoaded, user]);


  if (!isLoaded || loading)
    return <p className="p-6 text-gray-500">Loading your courses...</p>;

  if (enrolledPrograms.length === 0)
    return (
      <p className="p-6 text-gray-500">
        You have not enrolled in any course yet.
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Enrolled Courses</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrolledPrograms.map((item) => (
          <Card
            key={item._id}
            className="overflow-hidden shadow-md hover:shadow-lg transition-all"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {item.programId}
                {item.status === "completed" ? (
                  <CheckCircle className="text-green-500 w-5 h-5" />
                ) : (
                  <Clock className="text-yellow-500 w-5 h-5" />
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Status:</span>
                <Badge variant="secondary">{item.status}</Badge>
              </div>

              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Payment:</span>
                <Badge
                  className={`${
                    item.paymentStatus === "completed"
                      ? "bg-green-500"
                      : item.paymentStatus === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  } text-white`}
                >
                  {item.paymentStatus}
                </Badge>
              </div>

              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Enrolled:</span>
                <span>
                  {new Date(item.enrollmentDate).toLocaleDateString("en-IN")}
                </span>
              </div>

              <Button
                variant={item.status === "completed" ? "secondary" : "default"}
                className="w-full mt-3 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                {item.status === "completed"
                  ? "View Certificate"
                  : "Continue Learning"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { CheckCircle, Clock, BookOpen } from "lucide-react";

// export default function UserDashboardPage() {
//   // Dummy Courses Data
//   const courses = [
//     {
//       id: "react-bootcamp",
//       title: "React Bootcamp",
//       description: "Master modern React and hooks with hands-on projects.",
//       level: "Intermediate",
//       duration: "6 Weeks",
//       image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
//     },
//     {
//       id: "nextjs-masterclass",
//       title: "Next.js Masterclass",
//       description: "Build full-stack applications with Next.js 14.",
//       level: "Advanced",
//       duration: "8 Weeks",
//       image: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
//     },
//     {
//       id: "node-api-pro",
//       title: "Node.js API Pro",
//       description: "Create scalable backend APIs using Express and MongoDB.",
//       level: "Advanced",
//       duration: "5 Weeks",
//       image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
//     },
//     {
//       id: "python-datascience",
//       title: "Python for Data Science",
//       description: "Learn Python, Pandas, and visualization for data analysis.",
//       level: "Beginner",
//       duration: "4 Weeks",
//       image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
//     },
//     {
//       id: "uiux-design-fundamentals",
//       title: "UI/UX Design Fundamentals",
//       description: "Design beautiful and user-friendly interfaces.",
//       level: "Beginner",
//       duration: "5 Weeks",
//       image: "https://images.unsplash.com/photo-1605379399642-870262d3d051",
//     },
//   ];

//   // Dummy Enrollment Data
//   const dummyEnrollments = [
//     {
//       enrollmentId: "ENR001",
//       programId: "react-bootcamp",
//       firstName: "Shivam",
//       lastName: "Tiwari",
//       email: "shivam@example.com",
//       paymentStatus: "completed",
//       status: "confirmed",
//       progress: 90,
//       enrollmentDate: "2025-09-10",
//     },
//     {
//       enrollmentId: "ENR002",
//       programId: "nextjs-masterclass",
//       firstName: "Shivam",
//       lastName: "Tiwari",
//       email: "shivam@example.com",
//       paymentStatus: "pending",
//       status: "pending",
//       progress: 10,
//       enrollmentDate: "2025-09-25",
//     },
//     {
//       enrollmentId: "ENR003",
//       programId: "node-api-pro",
//       firstName: "Shivam",
//       lastName: "Tiwari",
//       email: "shivam@example.com",
//       paymentStatus: "completed",
//       status: "completed",
//       progress: 100,
//       enrollmentDate: "2025-08-18",
//     },
//     {
//       enrollmentId: "ENR004",
//       programId: "python-datascience",
//       firstName: "Shivam",
//       lastName: "Tiwari",
//       email: "shivam@example.com",
//       paymentStatus: "completed",
//       status: "confirmed",
//       progress: 70,
//       enrollmentDate: "2025-09-01",
//     },
//     {
//       enrollmentId: "ENR005",
//       programId: "uiux-design-fundamentals",
//       firstName: "Shivam",
//       lastName: "Tiwari",
//       email: "shivam@example.com",
//       paymentStatus: "failed",
//       status: "cancelled",
//       progress: 0,
//       enrollmentDate: "2025-07-15",
//     },
//   ];

//   const [enrolledPrograms, setEnrolledPrograms] = useState<any[]>([]);

//   useEffect(() => {
//     // Combine course details with enrollments
//     const mapped = dummyEnrollments.map((enr) => ({
//       ...enr,
//       course: courses.find((c) => c.id === enr.programId),
//     }));
//     setEnrolledPrograms(mapped);
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">My Enrolled Courses</h1>

//       {enrolledPrograms.length === 0 ? (
//         <p className="text-gray-500">
//           You have not enrolled in any course yet.
//         </p>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {enrolledPrograms.map((item) => (
//             <Card
//               key={item.enrollmentId}
//               className="overflow-hidden shadow-md hover:shadow-lg transition-all"
//             >
//               <img
//                 src={item.course?.image}
//                 alt={item.course?.title}
//                 className="w-full h-40 object-cover"
//               />
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   {item.course?.title}
//                   {item.status === "completed" ? (
//                     <CheckCircle className="text-green-500 w-5 h-5" />
//                   ) : (
//                     <Clock className="text-yellow-500 w-5 h-5" />
//                   )}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <p className="text-sm text-muted-foreground">
//                   {item.course?.description}
//                 </p>
//                 <div className="flex gap-2">
//                   <Badge variant="secondary">{item.course?.level}</Badge>
//                   <Badge variant="outline">{item.course?.duration}</Badge>
//                 </div>

//                 <div className="mt-3">
//                   <div className="flex justify-between text-sm font-medium mb-1">
//                     <span>Progress</span>
//                     <span>{item.progress}%</span>
//                   </div>
//                   <Progress value={item.progress} />
//                 </div>

//                 <div className="flex justify-between items-center mt-4">
//                   <Badge
//                     className={`${
//                       item.paymentStatus === "completed"
//                         ? "bg-green-500"
//                         : item.paymentStatus === "pending"
//                         ? "bg-yellow-500"
//                         : "bg-red-500"
//                     } text-white`}
//                   >
//                     {item.paymentStatus}
//                   </Badge>

//                   <Button
//                     variant={
//                       item.status === "completed" ? "secondary" : "default"
//                     }
//                     className="flex items-center gap-2"
//                   >
//                     <BookOpen className="w-4 h-4" />
//                     {item.status === "completed"
//                       ? "View Certificate"
//                       : "Continue"}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
