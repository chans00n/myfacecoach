import React from 'react';
import { cn } from '@/lib/utils';

type TypographyVariant = 
  | 'display'
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'body-xs' 
  | 'body-sm' 
  | 'body' 
  | 'body-lg' 
  | 'body-xl' 
  | 'caption' 
  | 'overline'
  | 'lead';

type TypographyColor = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'muted' 
  | 'accent' 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'danger';

type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

type TypographyWeight = 
  | 'thin' 
  | 'extralight' 
  | 'light' 
  | 'normal' 
  | 'medium' 
  | 'semibold' 
  | 'bold' 
  | 'extrabold' 
  | 'black';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: TypographyAlign;
  weight?: TypographyWeight;
  className?: string;
  as?: React.ElementType;
  truncate?: boolean;
  lineClamp?: number;
  children: React.ReactNode;
}

const Typography = ({
  variant = 'body',
  color = 'default',
  align,
  weight,
  className,
  as,
  truncate = false,
  lineClamp,
  children,
  ...props
}: TypographyProps) => {
  // Map variant to HTML element if 'as' prop is not provided
  const getDefaultElement = (): React.ElementType => {
    switch (variant) {
      case 'display':
      case 'h1':
        return 'h1';
      case 'h2':
        return 'h2';
      case 'h3':
        return 'h3';
      case 'h4':
        return 'h4';
      case 'h5':
        return 'h5';
      case 'h6':
        return 'h6';
      case 'lead':
        return 'p';
      case 'caption':
      case 'overline':
        return 'span';
      default:
        return 'p';
    }
  };

  const Component = as || getDefaultElement();

  // Build class names based on props
  const variantClasses = {
    display: 'text-display',
    h1: 'text-h1',
    h2: 'text-h2',
    h3: 'text-h3',
    h4: 'text-h4',
    h5: 'text-h5',
    h6: 'text-h6',
    'body-xs': 'text-body-xs',
    'body-sm': 'text-body-sm',
    body: 'text-body',
    'body-lg': 'text-body-lg',
    'body-xl': 'text-body-xl',
    caption: 'text-caption',
    overline: 'text-overline',
    lead: 'text-body-xl font-normal leading-relaxed',
  };

  const colorClasses = {
    default: 'text-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground',
    accent: 'text-accent',
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const weightClasses = {
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black',
  };

  // Handle truncation and line clamping
  let truncateClass = '';
  if (truncate) {
    truncateClass = 'truncate';
  } else if (lineClamp && lineClamp > 0) {
    truncateClass = `line-clamp-${Math.min(lineClamp, 6)}`;
  }

  return (
    <Component
      className={cn(
        variantClasses[variant],
        colorClasses[color],
        align && alignClasses[align],
        weight && weightClasses[weight],
        truncateClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Export named components for convenience
export const Display = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="display" {...props} />
);

export const H1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h1" {...props} />
);

export const H2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h2" {...props} />
);

export const H3 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h3" {...props} />
);

export const H4 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h4" {...props} />
);

export const H5 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h5" {...props} />
);

export const H6 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h6" {...props} />
);

export const Lead = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="lead" {...props} />
);

export const Paragraph = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body" {...props} />
);

export const SmallText = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body-sm" {...props} />
);

export const LargeText = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body-lg" {...props} />
);

export const Caption = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="caption" {...props} />
);

export const Overline = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="overline" {...props} />
);

export default Typography; 