"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The direction of the button group on mobile devices.
   * @default "vertical"
   */
  mobileDirection?: "vertical" | "horizontal"
  
  /**
   * The direction of the button group on desktop devices.
   * @default "vertical"
   */
  desktopDirection?: "vertical" | "horizontal"
  
  /**
   * The breakpoint at which to switch from mobile to desktop layout.
   * @default "sm"
   */
  breakpoint?: "sm" | "md" | "lg" | "xl" | "2xl"
  
  /**
   * The spacing between buttons.
   * @default "2"
   */
  spacing?: "1" | "2" | "3" | "4"
}

/**
 * ButtonGroup component for responsive button layouts.
 * On mobile, buttons will be stacked vertically and take full width by default.
 * On desktop, buttons will be arranged vertically by default.
 */
export function ButtonGroup({
  className,
  children,
  mobileDirection = "vertical",
  desktopDirection = "vertical",
  breakpoint = "sm",
  spacing = "2",
  ...props
}: ButtonGroupProps) {
  // Determine the flex direction and spacing classes based on the props
  const mobileFlexDirection = mobileDirection === "vertical" ? "flex-col" : "flex-row"
  const desktopFlexDirection = desktopDirection === "vertical" ? "flex-col" : "flex-row"
  
  // Determine the spacing classes based on the direction
  const mobileSpacing = mobileDirection === "vertical" ? `space-y-${spacing}` : `space-x-${spacing}`
  const desktopSpacing = desktopDirection === "vertical" ? `space-y-${spacing}` : `space-x-${spacing}`
  
  // Combine the classes based on the breakpoint
  const responsiveClasses = `w-full flex ${mobileFlexDirection} ${mobileSpacing} ${breakpoint}:${desktopFlexDirection} ${breakpoint}:${mobileSpacing === desktopSpacing ? "" : `${breakpoint}:space-y-0 ${breakpoint}:${desktopSpacing}`}`
  
  return (
    <div className={cn(responsiveClasses, className)} {...props}>
      {/* Apply full width to direct button children */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && typeof child.props === 'object' && child.props !== null) {
          // Only clone the element if it has props and className can be applied
          return React.cloneElement(child as React.ReactElement<any>, {
            className: cn(
              "w-full", 
              child.props.className || ""
            ),
          });
        }
        return child;
      })}
    </div>
  )
} 