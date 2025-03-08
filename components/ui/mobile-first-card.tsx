import React from 'react';
import { cn } from '@/lib/utils';
import Typography, { H3, Paragraph } from '@/components/ui/typography';

interface MobileFirstCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  image?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * MobileFirstCard - A template component demonstrating mobile-first design principles
 * 
 * Mobile (default):
 * - Full width, stacked layout
 * - Image at top, followed by content
 * - Compact padding
 * 
 * Tablet (md):
 * - More padding
 * - Slightly rounded corners
 * 
 * Desktop (lg):
 * - Optional side-by-side layout for image and content
 * - More generous spacing
 * - Larger rounded corners
 */
export function MobileFirstCard({
  title,
  description,
  image,
  footer,
  children,
  className,
  ...props
}: MobileFirstCardProps) {
  return (
    <div 
      className={cn(
        // Mobile (default) styles
        "w-full border border-border bg-card text-card-foreground shadow-sm",
        "flex flex-col overflow-hidden",
        "p-4", // Compact padding on mobile
        
        // Tablet styles
        "md:p-6 md:rounded-md",
        
        // Desktop styles
        "lg:p-8 lg:rounded-lg",
        className
      )}
      {...props}
    >
      {/* Image - Full width on mobile, optional side-by-side on desktop */}
      {image && (
        <div className="w-full h-48 mb-4 md:h-56 lg:h-64 relative -mx-4 -mt-4 md:-mx-6 md:-mt-6 lg:-mx-0 lg:mt-0">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover lg:rounded-t-lg" 
          />
        </div>
      )}
      
      {/* Content */}
      <div className="flex flex-col space-y-3">
        <H3>{title}</H3>
        
        {description && (
          <Paragraph color="muted">{description}</Paragraph>
        )}
        
        {/* Main content */}
        <div className="mt-2">
          {children}
        </div>
      </div>
      
      {/* Footer - if provided */}
      {footer && (
        <div className="mt-6 pt-4 border-t border-border">
          {footer}
        </div>
      )}
    </div>
  );
}

export default MobileFirstCard; 