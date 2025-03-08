"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RadialProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "danger" | "warning" | "info"
  label?: React.ReactNode
  icon?: React.ReactNode
  indicator?: React.ReactNode
}

const variantStyles = {
  default: "text-primary stroke-primary",
  success: "text-green-500 stroke-green-500",
  danger: "text-red-500 stroke-red-500",
  warning: "text-yellow-500 stroke-yellow-500",
  info: "text-blue-500 stroke-blue-500",
}

const sizeStyles = {
  sm: {
    container: "w-16 h-16",
    svg: "w-16 h-16",
    text: "text-sm",
    icon: "w-4 h-4",
  },
  md: {
    container: "w-24 h-24",
    svg: "w-24 h-24",
    text: "text-lg",
    icon: "w-5 h-5",
  },
  lg: {
    container: "w-32 h-32",
    svg: "w-32 h-32",
    text: "text-xl",
    icon: "w-6 h-6",
  },
}

export function RadialProgress({
  value,
  size = "md",
  variant = "default",
  label,
  icon,
  indicator,
  className,
  ...props
}: RadialProgressProps) {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value))
  
  // Calculate the circle properties
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference
  
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeStyles[size].container,
        className
      )}
      {...props}
    >
      <svg
        className={cn(
          "absolute inset-0 transform -rotate-90",
          sizeStyles[size].svg
        )}
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          className="stroke-muted-foreground/20"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className={cn(
            "transition-all duration-300 ease-in-out",
            variantStyles[variant]
          )}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      
      {/* Center content */}
      <div className="relative flex flex-col items-center justify-center">
        {icon && (
          <div className={cn("mb-1", sizeStyles[size].icon)}>
            {icon}
          </div>
        )}
        {label && (
          <div className={cn("font-medium", sizeStyles[size].text)}>
            {label}
          </div>
        )}
        {indicator && (
          <div className="text-xs text-muted-foreground mt-1">
            {indicator}
          </div>
        )}
      </div>
    </div>
  )
} 