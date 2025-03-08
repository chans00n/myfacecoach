/**
 * Responsive Typography System
 * 
 * This file defines a fluid typography scale that automatically adjusts
 * font sizes based on viewport width, ensuring text remains readable
 * across all device sizes.
 */

// Base sizes in pixels (for reference)
export const typographyBase = {
  // Heading sizes
  h1: '2.5rem',     // 40px
  h2: '2rem',       // 32px
  h3: '1.5rem',     // 24px
  h4: '1.25rem',    // 20px
  h5: '1.125rem',   // 18px
  h6: '1rem',       // 16px
  
  // Body text sizes
  body: '1rem',     // 16px
  bodySmall: '0.875rem', // 14px
  bodyLarge: '1.125rem', // 18px
  
  // Other text sizes
  caption: '0.75rem', // 12px
  overline: '0.625rem', // 10px
  
  // Line heights
  headingLeading: '1.2',
  bodyLeading: '1.5',
  tightLeading: '1.25',
  looseLeading: '1.75',
  
  // Letter spacing
  trackingTight: '-0.025em',
  trackingNormal: '0',
  trackingWide: '0.025em',
  trackingWider: '0.05em',
  
  // Font weights
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// CSS utility classes for typography
export const typographyClasses = {
  // Heading styles
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight',
  h3: 'text-2xl md:text-3xl lg:text-4xl font-bold leading-tight',
  h4: 'text-xl md:text-2xl font-semibold leading-tight',
  h5: 'text-lg md:text-xl font-semibold leading-tight',
  h6: 'text-base md:text-lg font-semibold leading-tight',
  
  // Body text styles
  bodyLarge: 'text-lg md:text-xl leading-relaxed',
  body: 'text-base leading-relaxed',
  bodySmall: 'text-sm leading-relaxed',
  
  // Special text styles
  caption: 'text-xs leading-normal',
  overline: 'text-xs uppercase tracking-wider font-medium',
  
  // Interactive text
  link: 'text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors',
  button: 'font-medium',
  
  // Emphasis
  lead: 'text-xl md:text-2xl font-normal leading-relaxed',
  highlight: 'bg-primary/10 text-primary px-1 rounded',
  
  // Alignment
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
  
  // Truncation
  truncate: 'truncate',
  lineClamp1: 'line-clamp-1',
  lineClamp2: 'line-clamp-2',
  lineClamp3: 'line-clamp-3',
};

export default typographyBase; 