import { AnimatedElement } from "@/components/ui/animated-element";
import { PageTransition } from "@/components/ui/page-transition";

export const metadata = {
  title: "Shipping Policy | Enginow",
  description:
    "Shipping Policy for Enginow - Learn about digital delivery timelines and access guidelines.",
};

export default function ShippingPolicy() {
  return (
    <PageTransition>
      <div className="container max-w-4xl py-12 md:py-16">
        <AnimatedElement animation="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-text-primary">
            Shipping Policy
          </h1>
        </AnimatedElement>

        <AnimatedElement animation="fade-up" delay={0.1}>
          <div className="prose prose-lg max-w-none">
            <p>
              <strong>Last Updated: {new Date().toLocaleDateString()}</strong>
            </p>

            <h2>Overview</h2>
            <p>
              Since <strong>Enginow</strong> offers digital educational content
              and online learning resources, our “shipping” process refers to
              granting access to these materials electronically.
            </p>

            <h2>Delivery Method</h2>
            <p>
              Upon successful purchase, learners will receive immediate access
              to their selected courses, programs, or study materials through
              their Enginow account dashboard.
            </p>

            <h2>Delivery Time</h2>
            <ul>
              <li>
                Digital access is typically available <strong>instantly</strong>{" "}
                after payment confirmation.
              </li>
              <li>
                In some cases (e.g., system maintenance or manual verification),
                access may take up to
                <strong>24 hours</strong>.
              </li>
            </ul>

            <h2>Order Confirmation</h2>
            <p>
              After a successful transaction, a confirmation email will be sent
              to your registered email address. It includes your payment
              details, course access link, and customer support information.
            </p>

            <h2>Non-Delivery Issues</h2>
            <p>
              If you face any delay or cannot access your purchased course,
              please contact our support team within
              <strong>48 hours</strong> of your purchase. We will promptly
              resolve the issue.
            </p>

            <h2>Third-Party Platforms</h2>
            <p>
              Some content may be hosted through authorized third-party
              providers (like coding platforms or video servers). In such cases,
              learners will receive a separate access link or code via email.
            </p>

            <h2>Contact Us</h2>
            <p>
              For support related to course access or delivery, please reach out
              to:
            </p>
            <p>
              Email:{" "}
              <a href="mailto:support@enginow.com">support@enginow.com</a>
              <br />
              Phone: +91 89350 69570
              <br />
              Address: 123 Tech Park, Sector 62, Noida, Uttar Pradesh 201301
            </p>
          </div>
        </AnimatedElement>
      </div>
    </PageTransition>
  );
}