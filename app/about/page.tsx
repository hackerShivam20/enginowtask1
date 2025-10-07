"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Linkedin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const [showMore, setShowMore] = useState(false);

  const founder = {
    name: "Ankush Singh Bhadauriya",
    role: "Founder & CEO",
    bio: "Ankush is an IT graduate from PSIT, Kanpur with 1+ years of experience in the tech industry. He founded Enginow with a mission to make technical education accessible and easy to understand for all engineering students.",
    image: "/founder.jpg?height=300&width=300",
    social: {
      instagram: "#",
      linkedin: "#",
    },
  };

  const cofounder = {
    name: "Akshat Gupta",
    role: "Co-Founder",
    bio: "Akshat graduated from a renowned college in Kanpur and has strong knowledge of DSA and other programming languages.",
    image: "/co-founder.jpg?height=300&width=300",
    social: {
      instagram: "#",
      linkedin: "#",
    },
  };

  return (
    <div className="container py-12">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-kolka">
          About Us ❤️
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Our mission is to simplify technical education for engineering
          students
        </p>
      </div>

      {/* Our Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            Enginow was founded in 2025 with a simple mission: to make complex
            technical and non-technical subjects accessible and easy to
            understand for all engineering students.
          </p>
          <p className="text-muted-foreground mb-4">
            Having experienced the challenges of technical education firsthand,
            our founder recognized the need for clear, concise, and practical
            learning resources that bridge the gap between theoretical knowledge
            and practical application.
          </p>
          <p className="text-muted-foreground">
            Today, we serve hundreds of students across India, helping them
            excel in their technical education through our comprehensive
            courses, concept notes, and learning resources.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="/Enginow White.png?height=400&width=500"
            alt="About Enginow"
            width={500}
            height={400}
            className="rounded-lg object-cover shadow-md"
          />
        </div>
      </div>

      {/* Founder Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Founder</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center max-w-3xl mx-auto bg-muted/20 p-6 rounded-2xl shadow-sm">
          <div className="flex-shrink-0">
            <Image
              src={founder.image || "/founder.jpg"}
              alt={founder.name}
              width={300}
              height={300}
              className="rounded-full object-cover shadow-md"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">{founder.name}</h3>
            <p className="text-primary mb-2">{founder.role}</p>
            <div className="flex space-x-3 mb-4">
              <a
                href={founder.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={founder.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
            <p className="text-muted-foreground">{founder.bio}</p>
          </div>
        </div>
      </div>

      {/* Co-Founder Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Co-Founder</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center max-w-3xl mx-auto bg-muted/20 p-6 rounded-2xl shadow-sm">
          <div className="flex-shrink-0">
            <Image
              src={cofounder.image || "/co-founder.jpg"}
              alt={cofounder.name}
              width={300}
              height={300}
              className="rounded-full object-cover shadow-md"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">{cofounder.name}</h3>
            <p className="text-primary mb-2">{cofounder.role}</p>
            <div className="flex space-x-3 mb-4">
              <a
                href={cofounder.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={cofounder.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
            <p className="text-muted-foreground">{cofounder.bio}</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <p className="text-muted-foreground mb-8">
          Here are some of the most common questions we receive from our
          community.
        </p>

        <Accordion type="single" collapsible className="text-left space-y-4">
          {/* Always Visible FAQs */}
          <AccordionItem
            value="item-1"
            className="border border-border rounded-lg px-4 bg-muted/30"
          >
            <AccordionTrigger className="font-medium text-lg">
              What is Enginow?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Enginow is an educational platform created to simplify technical
              and non-technical education for engineering students through
              clear, practical, and easy-to-understand content.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="border border-border rounded-lg px-4 bg-muted/30"
          >
            <AccordionTrigger className="font-medium text-lg">
              What services do they offer?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              We offer online courses, concept notes, coding tutorials, and
              mentorship programs tailored for engineering students.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="border border-border rounded-lg px-4 bg-muted/30"
          >
            <AccordionTrigger className="font-medium text-lg">
              How can I join the team?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              You can join our team by reaching out via our contact page or
              connecting with us on LinkedIn. We’re always looking for
              passionate educators and developers.
            </AccordionContent>
          </AccordionItem>

          {/* Animated Extra FAQs */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-4"
              >
                <AccordionItem
                  value="item-4"
                  className="border border-border rounded-lg px-4 bg-muted/30"
                >
                  <AccordionTrigger className="font-medium text-lg">
                    Is Enginow free to use?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Many of our resources like concept notes and articles are
                    free. However, premium courses and mentorship programs may
                    have a small fee.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-5"
                  className="border border-border rounded-lg px-4 bg-muted/30"
                >
                  <AccordionTrigger className="font-medium text-lg">
                    Who can enroll in Enginow courses?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our courses are open to all engineering students and
                    professionals who want to improve their technical and
                    problem-solving skills.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-6"
                  className="border border-border rounded-lg px-4 bg-muted/30"
                >
                  <AccordionTrigger className="font-medium text-lg">
                    How can I contact Enginow for collaboration?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    You can email us or contact us through our LinkedIn or
                    Instagram pages. We’d love to collaborate with educators,
                    creators, and institutions.
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            )}
          </AnimatePresence>
        </Accordion>

        {/* Toggle Button */}
        <div className="mt-8">
          <Button
            variant="default"
            className="bg-primary text-white hover:bg-primary/90 transition-all"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show Less" : "View More FAQs"}
          </Button>
        </div>
      </div>
    </div>
  );
}