// File: /components/PricingSection.tsx

'use client';

// import Link from 'next/link';
// import { StripeBuyButton } from './StripeBuyButton';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// interface PricingSectionProps {
//   showFullDetails?: boolean;
// }

const pricingTiers = [
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    interval: "/month",
    description: "Perfect for small teams and startups",
    features: [
      "All template features",
      "Priority support",
      "Custom branding",
      "Analytics dashboard",
      "Team collaboration"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$49",
    interval: "/month",
    description: "For larger organizations",
    features: [
      "Everything in Pro",
      "Advanced security",
      "Custom integrations",
      "24/7 support",
      "SLA guarantee"
    ],
    cta: "Start Trial",
    popular: true
  },
  {
    id: "custom",
    name: "Custom",
    price: "Custom",
    interval: "",
    description: "For specific requirements",
    features: [
      "Custom development",
      "Dedicated account manager",
      "Tailored solutions",
      "Enterprise support",
      "Custom SLA"
    ],
    cta: "Contact Us",
    popular: false
  }
];

export function PricingSection() {
  const router = useRouter();
  
  const handleTierClick = (tierId: string) => {
    router.push(`/pay?tier=${tierId}`);
  };
  
  const handleCTAClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that&apos;s right for you and get started with your project today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleTierClick(tier.id)}
              className="cursor-pointer"
            >
              <Card className={`h-full flex flex-col ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
                {tier.popular && (
                  <div className="absolute top-0 right-0 -mt-2 -mr-2">
                    <Badge variant="default" className="bg-primary">Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="ml-1 text-muted-foreground">{tier.interval}</span>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={tier.popular ? "default" : "outline"} 
                    className="w-full" 
                    onClick={handleCTAClick}
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}