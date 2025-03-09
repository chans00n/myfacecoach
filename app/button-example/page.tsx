'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { H1, H2, Paragraph } from '@/components/ui/typography';

export default function ButtonExamplePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <H1>Responsive Button Examples</H1>
        <Paragraph>
          This page demonstrates how buttons adapt to different screen sizes.
          Resize your browser to see how they change.
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vertical to Horizontal</CardTitle>
            <CardDescription>
              Buttons stack vertically on mobile and arrange horizontally on desktop
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Paragraph className="mb-4">Default ButtonGroup:</Paragraph>
              <ButtonGroup>
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </ButtonGroup>
            </div>

            <div>
              <Paragraph className="mb-4">With three buttons:</Paragraph>
              <ButtonGroup>
                <Button variant="outline">Back</Button>
                <Button variant="secondary">Save Draft</Button>
                <Button>Publish</Button>
              </ButtonGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Breakpoints</CardTitle>
            <CardDescription>
              Customize when buttons change from vertical to horizontal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Paragraph className="mb-4">Medium breakpoint (md):</Paragraph>
              <ButtonGroup breakpoint="md">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </ButtonGroup>
            </div>

            <div>
              <Paragraph className="mb-4">Large breakpoint (lg):</Paragraph>
              <ButtonGroup breakpoint="lg">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </ButtonGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Always Vertical</CardTitle>
            <CardDescription>
              Buttons remain stacked vertically on all screen sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ButtonGroup mobileDirection="vertical" desktopDirection="vertical">
              <Button variant="outline">Option 1</Button>
              <Button variant="outline">Option 2</Button>
              <Button>Confirm</Button>
            </ButtonGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Always Horizontal</CardTitle>
            <CardDescription>
              Buttons remain horizontal on all screen sizes (not recommended for mobile)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ButtonGroup mobileDirection="horizontal" desktopDirection="horizontal">
              <Button variant="outline" size="sm">No</Button>
              <Button variant="outline" size="sm">Maybe</Button>
              <Button size="sm">Yes</Button>
            </ButtonGroup>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Full-Width Single Button</CardTitle>
          <CardDescription>
            Single buttons also take full width on mobile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Paragraph className="mb-4">Single button in ButtonGroup:</Paragraph>
            <ButtonGroup>
              <Button>Full Width on Mobile</Button>
            </ButtonGroup>
          </div>

          <div>
            <Paragraph className="mb-4">Regular button with custom class:</Paragraph>
            <Button className="w-full sm:w-auto">Full Width on Mobile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 