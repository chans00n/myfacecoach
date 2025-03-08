'use client';

import React from 'react';
import Typography, {
  Display,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Lead,
  Paragraph,
  SmallText,
  LargeText,
  Caption,
  Overline
} from '@/components/ui/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function TypographyDemo() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-2">
        <H1>Typography System</H1>
        <Lead>A responsive typography system for the My Face Coach application.</Lead>
      </div>

      <Tabs defaultValue="showcase">
        <TabsList>
          <TabsTrigger value="showcase">Showcase</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="responsive">Responsive Behavior</TabsTrigger>
        </TabsList>
        
        <TabsContent value="showcase" className="space-y-8 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Headings</CardTitle>
              <CardDescription>
                A range of heading styles from display to h6.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Display>Display Heading</Display>
                <Caption>Display - For hero sections and major page headers</Caption>
              </div>
              <Separator />
              
              <div>
                <H1>Heading 1</H1>
                <Caption>H1 - Main page headings</Caption>
              </div>
              <Separator />
              
              <div>
                <H2>Heading 2</H2>
                <Caption>H2 - Section headings</Caption>
              </div>
              <Separator />
              
              <div>
                <H3>Heading 3</H3>
                <Caption>H3 - Subsection headings</Caption>
              </div>
              <Separator />
              
              <div>
                <H4>Heading 4</H4>
                <Caption>H4 - Card titles and smaller section headings</Caption>
              </div>
              <Separator />
              
              <div>
                <H5>Heading 5</H5>
                <Caption>H5 - Small headings and emphasized content</Caption>
              </div>
              <Separator />
              
              <div>
                <H6>Heading 6</H6>
                <Caption>H6 - The smallest heading size</Caption>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Body Text</CardTitle>
              <CardDescription>
                Various body text styles for different contexts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Lead>Lead Paragraph</Lead>
                <Caption>Lead - Introductory text that stands out</Caption>
              </div>
              <Separator />
              
              <div>
                <LargeText>Large Body Text</LargeText>
                <Caption>Body Large - For emphasized body content</Caption>
              </div>
              <Separator />
              
              <div>
                <Paragraph>
                  Regular body text is used for the main content of your application. 
                  It should be easy to read at various screen sizes and have appropriate 
                  line height for comfortable reading.
                </Paragraph>
                <Caption>Body - Standard text for most content</Caption>
              </div>
              <Separator />
              
              <div>
                <SmallText>
                  Small body text is useful for secondary information, metadata, or when space is limited.
                </SmallText>
                <Caption>Body Small - Secondary information and UI text</Caption>
              </div>
              <Separator />
              
              <div>
                <Caption>
                  Caption text is the smallest readable size, used for auxiliary information.
                </Caption>
                <Caption>Caption - For labels, help text, and metadata</Caption>
              </div>
              <Separator />
              
              <div>
                <Overline>Overline Text</Overline>
                <Caption>Overline - Small uppercase text often used above headings</Caption>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Text Colors</CardTitle>
              <CardDescription>
                Typography with different color variations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Paragraph color="default">Default Text Color</Paragraph>
              <Paragraph color="primary">Primary Text Color</Paragraph>
              <Paragraph color="secondary">Secondary Text Color</Paragraph>
              <Paragraph color="muted">Muted Text Color</Paragraph>
              <Paragraph color="accent">Accent Text Color</Paragraph>
              <Paragraph color="info">Info Text Color</Paragraph>
              <Paragraph color="success">Success Text Color</Paragraph>
              <Paragraph color="warning">Warning Text Color</Paragraph>
              <Paragraph color="danger">Danger Text Color</Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Text Weights</CardTitle>
              <CardDescription>
                Typography with different font weights.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Paragraph weight="thin">Thin (100)</Paragraph>
              <Paragraph weight="extralight">Extra Light (200)</Paragraph>
              <Paragraph weight="light">Light (300)</Paragraph>
              <Paragraph weight="normal">Normal (400)</Paragraph>
              <Paragraph weight="medium">Medium (500)</Paragraph>
              <Paragraph weight="semibold">Semi Bold (600)</Paragraph>
              <Paragraph weight="bold">Bold (700)</Paragraph>
              <Paragraph weight="extrabold">Extra Bold (800)</Paragraph>
              <Paragraph weight="black">Black (900)</Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Text Alignment</CardTitle>
              <CardDescription>
                Typography with different text alignments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Paragraph align="left">Left aligned text (default)</Paragraph>
              <Paragraph align="center">Center aligned text</Paragraph>
              <Paragraph align="right">Right aligned text</Paragraph>
              <Paragraph align="justify">
                Justify aligned text. This paragraph has more content to demonstrate 
                how justified text spreads out to fill the entire line width, creating 
                a clean edge on both the left and right sides.
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Text Truncation</CardTitle>
              <CardDescription>
                Typography with truncation and line clamping.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Paragraph truncate>
                  This text will be truncated with an ellipsis if it overflows a single line.
                  No matter how long this text is, it will always be displayed on a single line.
                </Paragraph>
                <Caption>Single line truncation</Caption>
              </div>
              <Separator />
              
              <div>
                <Paragraph lineClamp={2}>
                  This text will be clamped to 2 lines maximum. If the content exceeds this limit,
                  it will be truncated with an ellipsis. This is useful for card descriptions,
                  previews, and other areas where you want to show a consistent amount of text
                  regardless of the actual content length.
                </Paragraph>
                <Caption>2-line clamp</Caption>
              </div>
              <Separator />
              
              <div>
                <Paragraph lineClamp={3}>
                  This text will be clamped to 3 lines maximum. If the content exceeds this limit,
                  it will be truncated with an ellipsis. This is useful for card descriptions,
                  previews, and other areas where you want to show a consistent amount of text
                  regardless of the actual content length. Adding even more text here to demonstrate
                  that it will be cut off after the third line.
                </Paragraph>
                <Caption>3-line clamp</Caption>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-8 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
              <CardDescription>
                Examples of how to use the Typography component in your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <H4>Basic Usage</H4>
                <Paragraph className="mt-2">
                  Import the Typography component and use it with the desired variant:
                </Paragraph>
                <div className="bg-muted p-4 rounded-md mt-2 font-mono text-sm">
                  {`import Typography from '@/components/ui/typography';

<Typography variant="h1">Heading 1</Typography>
<Typography variant="body">Regular paragraph text</Typography>`}
                </div>
              </div>
              
              <div>
                <H4>Using Named Components</H4>
                <Paragraph className="mt-2">
                  For convenience, you can import and use the named components:
                </Paragraph>
                <div className="bg-muted p-4 rounded-md mt-2 font-mono text-sm">
                  {`import { H1, Paragraph, Lead } from '@/components/ui/typography';

<H1>Heading 1</H1>
<Lead>Lead paragraph with larger text</Lead>
<Paragraph>Regular paragraph text</Paragraph>`}
                </div>
              </div>
              
              <div>
                <H4>Customizing with Props</H4>
                <Paragraph className="mt-2">
                  Customize the appearance using props:
                </Paragraph>
                <div className="bg-muted p-4 rounded-md mt-2 font-mono text-sm">
                  {`<H2 color="primary" align="center">Centered Primary Heading</H2>
<Paragraph weight="bold" color="accent">Bold accent text</Paragraph>
<Paragraph lineClamp={2}>Text clamped to 2 lines...</Paragraph>`}
                </div>
              </div>
              
              <div>
                <H4>Changing the HTML Element</H4>
                <Paragraph className="mt-2">
                  Use the 'as' prop to change the rendered HTML element:
                </Paragraph>
                <div className="bg-muted p-4 rounded-md mt-2 font-mono text-sm">
                  {`<H3 as="div">This renders as a div with H3 styling</H3>
<Paragraph as="span">This is a span with paragraph styling</Paragraph>`}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="responsive" className="space-y-8 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Responsive Behavior</CardTitle>
              <CardDescription>
                How typography scales across different screen sizes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <H4>Fluid Typography</H4>
                <Paragraph className="mt-2">
                  Our typography system uses fluid sizing with CSS clamp() to automatically 
                  scale text based on the viewport width. This ensures text remains readable 
                  on all devices without requiring multiple breakpoint-specific styles.
                </Paragraph>
              </div>
              
              <div>
                <H4>Responsive Scale</H4>
                <Paragraph className="mt-2">
                  Resize your browser window to see how the text below scales smoothly:
                </Paragraph>
                <div className="space-y-4 mt-4 p-4 border rounded-md">
                  <Display>Display Heading</Display>
                  <H1>Heading 1</H1>
                  <H2>Heading 2</H2>
                  <H3>Heading 3</H3>
                  <Lead>Lead paragraph text that introduces a section</Lead>
                  <Paragraph>
                    Regular paragraph text is used for the main content. It should be 
                    easy to read at various screen sizes and have appropriate line height 
                    for comfortable reading.
                  </Paragraph>
                </div>
              </div>
              
              <div>
                <H4>Implementation Details</H4>
                <Paragraph className="mt-2">
                  The responsive typography is implemented using:
                </Paragraph>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    <SmallText>
                      CSS clamp() function for fluid sizing between minimum and maximum values
                    </SmallText>
                  </li>
                  <li>
                    <SmallText>
                      Tailwind's responsive modifiers for breakpoint-specific adjustments
                    </SmallText>
                  </li>
                  <li>
                    <SmallText>
                      Consistent scale ratios to maintain visual hierarchy
                    </SmallText>
                  </li>
                  <li>
                    <SmallText>
                      Appropriate line heights that adjust with font size
                    </SmallText>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 