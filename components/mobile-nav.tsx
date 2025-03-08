"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dot } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname()

  // Define navigation items for mobile
  const navItems = [
    {
      title: "Home",
      url: "/dashboard",
    },
    {
      title: "Lifts",
      url: "/workouts",
    },
    {
      title: "Methodology",
      url: "/methodology",
    },
    {
      title: "Settings",
      url: "/settings",
    },
  ]

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/60 backdrop-blur-md pb-safe md:hidden",
      className
    )}>
      <nav className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)
          
          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "relative flex flex-col items-center justify-center space-y-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute -top-1 h-1 w-4 rounded-full bg-primary" />
              )}
              <div className="active:scale-90 transition-transform duration-200">
                <Dot className={cn(
                  "h-6 w-6",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 