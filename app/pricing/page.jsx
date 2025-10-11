import { AnimatedElement } from "@/components/ui/animated-element";
import { PageTransition } from "@/components/ui/page-transition";

export const metadata = {
  title: "Pricing Policy | Enginow",
  description:
    "Pricing Policy for Enginow - Transparency and clarity in pricing for all learners.",
};

export default function PricingPolicy() {
  return (
    <PageTransition>
      <div className="container max-w-4xl py-12 md:py-16">
        <AnimatedElement animation="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-text-primary">
            Pricing Policy
          </h1>
        </AnimatedElement>

        <AnimatedElement animation="fade-up" delay={0.1}>
          <div className="prose prose-lg max-w-none">
            <p>
              <strong>Last Updated: {new Date().toLocaleDateString()}</strong>
            </p>

            <h2>Overview</h2>
            <p>
              At <strong>Enginow</strong>, we believe in transparent, fair, and
              accessible pricing for all learners. This Pricing Policy outlines
              how we determine, display, and manage course and subscription
              prices.
            </p>

            <h2>Course Pricing</h2>
            <p>
              Each course or learning plan on Enginow is priced based on its
              duration, content depth, and included resources. Prices are
              subject to change due to platform improvements, new features, or
              market conditions.
            </p>

            <h2>Discounts and Offers</h2>
            <ul>
              <li>
                We may run limited-time promotional discounts or bundle offers.
              </li>
              <li>Discounts cannot be combined unless explicitly stated.</li>
              <li>
                All promotional codes must be valid at the time of purchase.
              </li>
            </ul>

            <h2>Taxes and Fees</h2>
            <p>
              All prices shown are inclusive of applicable taxes unless
              mentioned otherwise. Any additional charges (such as transaction
              or processing fees) will be displayed clearly at checkout.
            </p>

            <h2>Currency and Payment</h2>
            <p>
              Prices are displayed in <strong>INR (₹)</strong> by default.
              International learners may see equivalent prices in their local
              currency. Payments can be made securely through our verified
              payment gateways.
            </p>

            <h2>Price Changes</h2>
            <p>
              Enginow reserves the right to modify course prices or subscription
              fees at any time. Any changes will apply to future purchases only
              — existing enrollments will not be affected.
            </p>

            <h2>Contact Us</h2>
            <p>
              For questions regarding our pricing structure, please contact:
            </p>
            <p>
              Email:{" "}
              <a href="mailto:pricing@enginow.com">pricing@enginow.com</a>
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
