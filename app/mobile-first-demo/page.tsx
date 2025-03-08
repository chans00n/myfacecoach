'use client';

import React from 'react';
import MobileFirstCard from '@/components/ui/mobile-first-card';
import { H1, H2, H3, Paragraph, Lead } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MobileFirstDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <H1>Mobile-First Design</H1>
        <Lead>
          Examples of components and layouts built with a mobile-first approach.
          Resize your browser to see how they adapt to different screen sizes.
        </Lead>
      </div>

      <Tabs defaultValue="examples">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="patterns">Common Patterns</TabsTrigger>
          <TabsTrigger value="principles">Principles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="examples" className="space-y-8 mt-6">
          <section>
            <H2 className="mb-4">Mobile-First Cards</H2>
            
            {/* Grid layout - 1 column on mobile, 2 on tablet, 3 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MobileFirstCard
                title="Card with Image"
                description="This card adapts its layout based on screen size."
                image="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000"
                footer={
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">Save</Button>
                    <Button size="sm">View</Button>
                  </div>
                }
              >
                <Paragraph>
                  On mobile, this card takes up the full width with the image on top.
                  On larger screens, it adapts to a more spacious layout.
                </Paragraph>
              </MobileFirstCard>
              
              <MobileFirstCard
                title="Text-Only Card"
                description="A simpler card without an image."
              >
                <Paragraph>
                  This card demonstrates how content spacing adapts to different screen sizes.
                  Notice how padding increases on larger screens.
                </Paragraph>
                <div className="mt-4">
                  <Button>Learn More</Button>
                </div>
              </MobileFirstCard>
              
              <MobileFirstCard
                title="Interactive Card"
                description="A card with interactive elements."
                footer={
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                    <Button className="w-full sm:w-auto">Submit</Button>
                  </div>
                }
              >
                <div className="space-y-4">
                  <Paragraph>
                    This card shows how interactive elements can adapt from stacked on mobile
                    to side-by-side on larger screens.
                  </Paragraph>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button variant="secondary" className="w-full sm:w-auto">Option 1</Button>
                    <Button variant="secondary" className="w-full sm:w-auto">Option 2</Button>
                  </div>
                </div>
              </MobileFirstCard>
            </div>
          </section>
          
          <section>
            <H2 className="mb-4">Responsive Layouts</H2>
            
            {/* Two-column layout that stacks on mobile */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-2/3">
                <Card>
                  <CardHeader>
                    <CardTitle>Main Content</CardTitle>
                    <CardDescription>
                      This section takes full width on mobile and 2/3 width on desktop
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Paragraph>
                        In a mobile-first approach, we design for the smallest screens first.
                        This means our base styles (without breakpoint prefixes) are for mobile devices.
                      </Paragraph>
                      <Paragraph>
                        As the screen size increases, we add complexity and additional features
                        using responsive prefixes like md: and lg:.
                      </Paragraph>
                      <div className="hidden md:block p-4 bg-primary/10 rounded-md">
                        <Paragraph>This content is only visible on tablet and above.</Paragraph>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="w-full lg:w-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle>Sidebar</CardTitle>
                    <CardDescription>
                      This section takes full width on mobile and 1/3 width on desktop
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Paragraph>
                      On mobile, this sidebar appears below the main content.
                      On desktop, it appears side-by-side with the main content.
                    </Paragraph>
                    <div className="mt-4 p-4 bg-secondary/10 rounded-md">
                      <H3 className="text-sm font-medium">Mobile-First Benefits</H3>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Better mobile experience</li>
                        <li>• Progressive enhancement</li>
                        <li>• Improved performance</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="patterns" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Mobile-First Patterns</CardTitle>
              <CardDescription>
                Frequently used patterns when implementing mobile-first design
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <H3 className="mb-2">Stacked to Side-by-Side</H3>
                <div className="p-4 border rounded-md">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="bg-primary/10 p-4 rounded-md w-full md:w-1/2">Item 1</div>
                    <div className="bg-primary/10 p-4 rounded-md w-full md:w-1/2">Item 2</div>
                  </div>
                  <Paragraph className="text-sm text-muted-foreground">
                    <code>flex-col md:flex-row</code> - Stacked vertically on mobile, side by side on tablet+
                  </Paragraph>
                </div>
              </div>
              
              <div>
                <H3 className="mb-2">Progressive Grid</H3>
                <div className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-secondary/10 p-4 rounded-md">Item {item}</div>
                    ))}
                  </div>
                  <Paragraph className="text-sm text-muted-foreground">
                    <code>grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4</code> - Increasing columns as screen size grows
                  </Paragraph>
                </div>
              </div>
              
              <div>
                <H3 className="mb-2">Responsive Spacing</H3>
                <div className="p-4 border rounded-md">
                  <div className="bg-accent/10 p-2 md:p-4 lg:p-6 rounded-md mb-4">
                    <Paragraph className="text-center">Content with increasing padding</Paragraph>
                  </div>
                  <Paragraph className="text-sm text-muted-foreground">
                    <code>p-2 md:p-4 lg:p-6</code> - Increasing padding as screen size grows
                  </Paragraph>
                </div>
              </div>
              
              <div>
                <H3 className="mb-2">Conditional Display</H3>
                <div className="p-4 border rounded-md">
                  <div className="mb-4">
                    <div className="block md:hidden bg-destructive/10 p-4 rounded-md">
                      Mobile only content
                    </div>
                    <div className="hidden md:block bg-success/10 p-4 rounded-md">
                      Desktop only content
                    </div>
                  </div>
                  <Paragraph className="text-sm text-muted-foreground">
                    <code>block md:hidden</code> and <code>hidden md:block</code> - Conditionally showing content based on screen size
                  </Paragraph>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="principles" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile-First Principles</CardTitle>
              <CardDescription>
                Core principles to follow when implementing mobile-first design
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <H3>1. Start with Mobile Design</H3>
                <Paragraph>
                  Always design for the smallest screen first, then progressively enhance for larger screens.
                  This ensures the core experience works well on mobile devices.
                </Paragraph>
              </div>
              
              <div className="space-y-2">
                <H3>2. Progressive Enhancement</H3>
                <Paragraph>
                  Add features and complexity as screen size increases. Don't hide critical functionality on mobile.
                  Use responsive breakpoints to enhance, not degrade the experience.
                </Paragraph>
              </div>
              
              <div className="space-y-2">
                <H3>3. Content First</H3>
                <Paragraph>
                  Focus on the most important content and functionality for mobile users.
                  Prioritize what matters most and ensure it's accessible on all devices.
                </Paragraph>
              </div>
              
              <div className="space-y-2">
                <H3>4. Performance Matters</H3>
                <Paragraph>
                  Optimize for mobile networks and devices. Minimize initial load size and lazy load non-critical resources.
                  Test performance on throttled connections to ensure a good experience.
                </Paragraph>
              </div>
              
              <div className="space-y-2">
                <H3>5. Test on Real Devices</H3>
                <Paragraph>
                  Always test on actual mobile devices when possible. Emulators and responsive design mode in browsers
                  are helpful, but nothing beats testing on real devices.
                </Paragraph>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 