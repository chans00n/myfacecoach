"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon } from "lucide-react";

interface MethodologyDocumentProps {
  showPreview?: boolean;
  buttonText?: string;
  title?: string;
  description?: string;
}

/**
 * A component that provides access to the MYFC Methodology document
 * This can be used throughout the application to reference the methodology
 */
export const MethodologyDocument: React.FC<MethodologyDocumentProps> = ({
  showPreview = false,
  buttonText = "View Methodology",
  title = "MYFC | The Methodology",
  description = "Access the complete MYFC methodology document to understand our approach and principles."
}) => {
  const pdfUrl = "/MYFC _ The Methodology.pdf";
  
  const handleViewDocument = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {showPreview && (
          <div className="bg-muted rounded-md p-4 flex items-center justify-center mb-4 h-[200px]">
            <div className="text-center">
              <FileIcon className="h-12 w-12 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">MYFC Methodology Document</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleViewDocument} className="w-full">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MethodologyDocument; 