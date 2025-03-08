"use client";

import React from 'react';
import { MethodologyDocument } from '@/components/MethodologyDocument';
import { methodologyConcepts } from '@/utils/methodologyReference';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileIcon } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">MYFC Methodology</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Main methodology document card */}
        <div>
          <MethodologyDocument 
            showPreview={true}
            title="The Complete MYFC Methodology"
            description="Access the comprehensive guide to our methodology and approach."
          />
        </div>
        
        {/* Quick reference card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
            <CardDescription>
              Key concepts from the MYFC methodology that you can reference throughout the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(methodologyConcepts).map(([key, concept]) => (
                <div key={key} className="p-4 border rounded-md">
                  <h3 className="font-medium">{concept.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{concept.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(concept.documentUrl, '_blank')}
                  >
                    <FileIcon className="h-4 w-4 mr-2" />
                    View in Document
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Reference the Methodology</h2>
        <p className="mb-4">
          Throughout this application, you can reference the MYFC methodology document in several ways:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Use the <code className="bg-muted-foreground/20 px-1 rounded">MethodologyDocument</code> component to provide direct access to the document</li>
          <li>Use the <code className="bg-muted-foreground/20 px-1 rounded">methodologyReference</code> utilities to reference specific concepts</li>
          <li>Link directly to the document at <code className="bg-muted-foreground/20 px-1 rounded">/MYFC _ The Methodology.pdf</code></li>
        </ul>
        <p>
          As you work with the methodology, you can expand the concepts in the reference utility to create a comprehensive
          system for maintaining consistent references throughout the application.
        </p>
      </div>
    </div>
  );
} 