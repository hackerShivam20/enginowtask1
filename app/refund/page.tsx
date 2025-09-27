import { AnimatedElement } from "@/components/ui/animated-element"
import { PageTransition } from "@/components/ui/page-transition"

export const metadata = {
  title: "Return & Refund Policy | Enginow",
  description: "Return and Refund Policy for Enginow - Learn Fast, Understand Better",
}

export default function ReturnPolicy() {
  return (
    <PageTransition>
      <div className="container max-w-4xl py-12 md:py-16">
        <AnimatedElement animation="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-text-primary">
            Return &amp; Refund Policy
          </h1>
        </AnimatedElement>

        <AnimatedElement animation="fade-up" delay={0.1}>
          <div className="prose prose-lg max-w-none">
            <p>
              <strong>Last Updated: {new Date().toLocaleDateString()}</strong>
            </p>

            <h2>Overview</h2>
            <p>
              At <strong>Enginow</strong>, we want you to be completely satisfied with your learning experience.
              This Return &amp; Refund Policy explains our guidelines regarding returns, cancellations, and
              refunds for the services and digital products you purchase through our platform.
            </p>

            <h2>Eligibility for Refunds</h2>
            <p>You may be eligible for a refund under the following circumstances:</p>
            <ul>
              <li>
                You purchased a course or subscription but have not yet accessed or downloaded any learning material.
              </li>
              <li>
                You experience a significant technical issue that prevents you from accessing the content,
                and we are unable to resolve it within a reasonable time.
              </li>
              <li>
                Duplicate or accidental payments made for the same product or service.
              </li>
            </ul>

            <h2>Non-Refundable Items</h2>
            <p>We do not issue refunds for:</p>
            <ul>
              <li>Digital courses already accessed or completed</li>
              <li>Certificates or badges already issued</li>
              <li>Promotional or discounted purchases clearly marked as non-refundable</li>
            </ul>

            <h2>Cancellation Policy</h2>
            <p>
              Subscriptions may be canceled anytime through your account dashboard. Your access will continue until the
              end of the current billing period, and you will not be charged for the next cycle.
            </p>

            <h2>How to Request a Refund</h2>
            <p>
              To request a refund, please contact our support team within <strong>7 days</strong> of your purchase:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:refunds@enginow.com">refunds@enginow.com</a></li>
              <li><strong>Phone:</strong> +91 89350 69570</li>
            </ul>
            <p>
              Include your order details, purchase date, and the reason for your request. Our support team will
              review your request and respond within <strong>3–5 business days</strong>.
            </p>

            <h2>Processing Refunds</h2>
            <p>
              Approved refunds will be issued to your original payment method. Depending on your bank or payment
              provider, it may take <strong>5–10 business days</strong> for the amount to appear in your account.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Return &amp; Refund Policy from time to time. We will notify you of any significant
              changes by updating the "Last Updated" date at the top of this page.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions about this Return &amp; Refund Policy, please contact us at:</p>
            <p>
              Email: <a href="mailto:refunds@enginow.com">refunds@enginow.com</a>
              <br />
              Address: 123 Tech Park, Sector 62, Noida, Uttar Pradesh 201301
            </p>
          </div>
        </AnimatedElement>
      </div>
    </PageTransition>
  )
}