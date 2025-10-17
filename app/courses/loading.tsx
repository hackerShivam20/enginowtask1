export default function Loading() {
  return null
}


//     <div className="container max-w-6xl py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
//       {/* Left: Enrollment Form */}
//       <div className="md:col-span-2">
//         <h1 className="text-2xl font-semibold mb-2">
//           Enroll in {course.title}
//         </h1>
//         <p className="text-muted-foreground mb-6">
//           Complete your enrollment details below.
//         </p>

//         <form onSubmit={handlePayment} className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>🧍 Personal Information</CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <Label>First Name</Label>
//                 <Input
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Last Name</Label>
//                 <Input
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Email Address</Label>
//                 <Input
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Phone Number</Label>
//                 <Input
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>WhatsApp Number</Label>
//                 <Input
//                   name="whatsapp"
//                   value={formData.whatsapp}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <Label>LinkedIn Profile</Label>
//                 <Input
//                   name="linkedin"
//                   placeholder="https://linkedin.com/in/username"
//                   value={formData.linkedin}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <Label>City</Label>
//                 <Input
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>State</Label>
//                 <Input
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Highest Education</Label>
//                 <Input
//                   name="education"
//                   placeholder="e.g. Bachelors, Masters"
//                   value={formData.education}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Work Experience</Label>
//                 <Input
//                   name="experience"
//                   placeholder="e.g. Fresher, 1-2 years"
//                   value={formData.experience}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <Label>Motivation</Label>
//                 <Textarea
//                   name="motivation"
//                   placeholder="Why do you want to join this course?"
//                   value={formData.motivation}
//                   onChange={handleChange}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Terms & Submit */}
//           <div className="space-y-3">
//             <div className="flex items-start gap-2">
//               <Checkbox
//                 name="agreeTerms"
//                 checked={formData.agreeTerms}
//                 onCheckedChange={(v) =>
//                   setFormData((prev) => ({ ...prev, agreeTerms: v as boolean }))
//                 }
//               />
//               <Label>
//                 I agree to the Terms and Conditions and Privacy Policy.
//               </Label>
//             </div>

//             <div className="flex items-start gap-2">
//               <Checkbox
//                 name="agreeMarketing"
//                 checked={formData.agreeMarketing}
//                 onCheckedChange={(v) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     agreeMarketing: v as boolean,
//                   }))
//                 }
//               />
//               <Label>
//                 I agree to receive marketing communications and updates.
//               </Label>
//             </div>

//             <Button
//               type="submit"
//               className="w-full"
//               size="lg"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   Pay ₹{course.price.toLocaleString()}{" "}
//                   <CheckCircle2 className="h-4 w-4 ml-2" />
//                 </>
//               )}
//             </Button>
//           </div>
//         </form>
//       </div>

//       {/* Right: Summary Card */}
//       <div>
//         <Card className="sticky top-20">
//           <CardHeader>
//             <CardTitle>{course.title}</CardTitle>
//             <p className="text-sm text-muted-foreground">
//               {course.description}
//             </p>
//           </CardHeader>
//           <CardContent>
//             <Separator className="my-3" />
//             <p className="text-3xl font-semibold mb-2">
//               ₹{course.price.toLocaleString()}
//             </p>
//             <p className="text-sm mb-3 text-muted-foreground">
//               What’s included:
//             </p>
//             <ul className="list-disc list-inside text-sm space-y-1 mb-4">
//               {course.includes.map((item: string, i: number) => (
//                 <li key={i}>{item}</li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>