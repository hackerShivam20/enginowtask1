"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const jobs = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    location: "Bangalore, India",
    type: "Full-time",
    salary: "₹12-18 LPA",
    experience: "3-5 years",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    description:
      "Join our dynamic team to build scalable web applications using modern technologies.",
    roles: [
      "Develop backend APIs",
      "Design frontend UI components",
      "Deploy cloud infrastructure",
    ],
    responsibilities: [
      "Write clean and maintainable code",
      "Collaborate with cross-functional teams",
      "Ensure code quality through reviews and testing",
    ],
  },
  {
    id: "2",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹15-22 LPA",
    experience: "2-4 years",
    skills: ["Python", "Machine Learning", "SQL", "Tableau"],
    description:
      "Analyze complex datasets and build predictive models to drive business insights.",
    roles: [
      "Build predictive models",
      "Analyze large datasets",
      "Collaborate with stakeholders",
    ],
    responsibilities: [
      "Perform data cleaning and preprocessing",
      "Visualize data insights",
      "Communicate findings to team",
    ],
  },
];

export default function JobApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const job = jobs.find((j) => j.id === params.id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
    resume: null,
  });

  if (!job) return <p className="text-center py-12">Job not found.</p>;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "email",
      "phone",
      "education",
      "experience",
      "resume",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert("Please fill all required fields and upload your resume.");
        return;
      }
    }

    console.log("Application submitted:", formData);
    alert("✅ Application submitted successfully!");
    router.push("/jobs");
  };

  return (
    <div className="container py-12 grid md:grid-cols-2 gap-8">
      {/* Left: Application Form */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Apply for {job.title}</CardTitle>
          <CardDescription>
            Fill out the form below to submit your application
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <Input
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <Input
              name="email"
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Phone */}
            <Input
              name="phone"
              type="tel"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            {/* Education */}
            <Input
              name="education"
              placeholder="Highest Education Qualification * (e.g., B.Tech in CSE)"
              value={formData.education}
              onChange={handleChange}
              required
            />

            {/* Experience */}
            <div>
              <label className="block mb-1 font-medium">Experience *</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select Experience</option>
                <option value="0-1">0-1 Years (Fresher)</option>
                <option value="1-2">1-2 Years</option>
                <option value="2-3">2-3 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </div>

            {/* LinkedIn Profile */}
            <Input
              name="linkedin"
              type="url"
              placeholder="LinkedIn Profile (optional)"
              value={formData.linkedin}
              onChange={handleChange}
            />

            {/* Portfolio */}
            <Input
              name="portfolio"
              type="url"
              placeholder="Portfolio / GitHub Link (optional)"
              value={formData.portfolio}
              onChange={handleChange}
            />

            {/* Cover Letter */}
            <div>
              <label className="block mb-1 font-medium">
                Cover Letter (optional)
              </label>
              <textarea
                name="coverLetter"
                placeholder="Write a brief cover letter..."
                value={formData.coverLetter}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block mb-1 font-medium">Resume *</label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition"
            >
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Right: Job Details */}
      <div className="space-y-6">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>
              {job.company} - {job.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{job.description}</p>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Roles:</h3>
              <ul className="list-disc list-inside">
                {job.roles.map((role, i) => (
                  <li key={i}>{role}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Responsibilities:</h3>
              <ul className="list-disc list-inside">
                {job.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Skills Required:</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
