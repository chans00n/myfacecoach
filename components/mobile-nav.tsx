"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Frame, Home, PieChart, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname()

  // Define navigation items for mobile
  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Lifts",
      url: "/workouts",
      icon: Frame,
    },
    {
      title: "Today",
      url: "/workouts/today",
      icon: PieChart,
    },
    {
      title: "Methodology",
      url: "/methodology",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ]

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background pb-safe md:hidden",
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
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 