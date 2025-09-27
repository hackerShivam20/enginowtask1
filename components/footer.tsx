"use client"

import type React from "react"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube, BookOpen, ArrowRight, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedElement } from "@/components/ui/animated-element"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail("")
      setTimeout(() => setIsSubmitted(false), 3000)
    }, 1000)
  }

  return (
    <footer className="w-full bg-gradient-mesh border-t border-white/20">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <AnimatedElement
          animation="fade-up"
          className="mb-10 mt-8 p-4 md:p-6 glass-card rounded-xl border border-black/10 shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-bold gradient-text-primary mb-1">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Subscribe for the latest updates, resources & special offers.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/50 border-white/30 rounded-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || isSubmitted}
                required
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="gradient-button text-white rounded-full shadow"
                  disabled={isSubmitting || isSubmitted}
                >
                  {isSubmitting ? (
                    "Subscribing..."
                  ) : isSubmitted ? (
                    "Subscribed!"
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </AnimatedElement>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-6 lg:grid-cols-12">
          {/* Brand */}
          <AnimatedElement animation="fade-right" delay={0.1} className="md:col-span-2 lg:col-span-4">
            <div className="flex items-center mb-4">
              <div className="bg-white rounded-full p-1.5 shadow-sm">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-2">
                <span className="block text-xl font-bold text-black font-kolka">Enginow</span>
                <span className="text-xs" style={{ color: "#9A2FC4" }}>
                  Learn Fast, Understand Better
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Comprehensive learning resources for engineering students and learners of Computer Science/IT subjects.
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <p className="text-xs text-muted-foreground">
                  Noida,
                  <br />
                  Uttar Pradesh 201301
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <p className="text-xs text-muted-foreground">+91 89350 69570</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary" />
                <p className="text-xs text-muted-foreground">care@enginow.in</p>
              </div>
            </div>
          </AnimatedElement>

          {/* Quick Links */}
          <AnimatedElement animation="fade-up" delay={0.2} className="md:col-span-1 lg:col-span-2">
            <h3 className="mb-3 text-sm font-bold gradient-text-primary">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              {[
                { name: "Courses", href: "/courses" },
                { name: "Learn", href: "/learn" },
                { name: "Blog", href: "/blog" },
              ].map((link, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                  >
                    <ArrowRight className="h-3 w-3 mr-2" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </AnimatedElement>

          {/* Company */}
          <AnimatedElement animation="fade-up" delay={0.3} className="md:col-span-1 lg:col-span-2">
            <h3 className="mb-3 text-sm font-bold gradient-text-secondary">Company</h3>
            <ul className="space-y-2 text-xs">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Jobs & Internships", href: "/jobs" },
              ].map((link, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-secondary transition-colors flex items-center"
                  >
                    <ArrowRight className="h-3 w-3 mr-2" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </AnimatedElement>

          {/* Resources */}
          <AnimatedElement animation="fade-left" delay={0.4} className="md:col-span-2 lg:col-span-4">
            <h3 className="mb-3 text-sm font-bold gradient-text-accent">Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "DSA Cheat Sheet", desc: "Algorithms and data structures reference", href: "/learn" },
                { title: "OS Notes", desc: "Operating systems concepts explained", href: "/learn" },
                { title: "DBMS Tutorial", desc: "Database management fundamentals", href: "/learn" },
                { title: "Coding Practice", desc: "Programming exercises and solutions", href: "/learn" },
              ].map((resource, i) => (
                <motion.div
                  key={i}
                  className="h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.03 }}
                >
                  <Link
                    href={resource.href}
                    className="
                      p-4 glass-card rounded-lg
                      border border-white/20 hover:border-accent/20 hover:shadow-sm
                      transition-all block
                      h-full flex flex-col justify-between
                    "
                  >
                    <h4 className="text-sm font-medium">{resource.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">{resource.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedElement>
        </div>

        {/* Bottom Bar */}
        <AnimatedElement
          animation="fade-up"
          delay={0.6}
          className="
            border-t border-white/10
            md:grid md:grid-cols-3
            flex flex-col md:flex-row
            items-center
            gap-3 py-3
          "
        >
          {/* Left: copyright */}
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Enginow. All rights reserved.
          </p>

          {/* Middle: social icons */}
          <div className="flex justify-center items-center gap-5">
            {[
              { icon: Linkedin, href: "https://www.linkedin.com/company/enginow" },
              { icon: Instagram, href: "https://www.instagram.com/enginow.in" },
              { icon: Youtube, href: "https://youtube.com/@enginow" },
              { icon: Facebook, href: "https://www.facebook.com/enginow.in/" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href={item.href}
                  className="
                    text-muted-foreground hover:text-primary transition-colors
                    bg-white/50 backdrop-blur-sm
                    p-1.5 rounded-full border border-white/20
                    hover:border-primary/20 hover:shadow-sm
                  "
                >
                  <item.icon className="h-4 w-4" />
                  <span className="sr-only">{item.icon.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right: footer links */}
          <div className="flex gap-3 justify-center md:justify-end">
            {[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "Cookie Policy", href: "/cookies" },
              { name: "Refund Policy", href: "/refund" },
            ].map((link, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatedElement>

      </div>
    </footer>
  )
}