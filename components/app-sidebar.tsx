"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { resolvedTheme, theme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined)
  
  // Update theme when it changes
  useEffect(() => {
    setCurrentTheme(resolvedTheme)
  }, [resolvedTheme])

  // For debugging
  useEffect(() => {
    console.log("Theme state:", { resolvedTheme, theme, currentTheme })
    
    // Check if the HTML element has the dark class
    const isDarkClass = document.documentElement.classList.contains('dark')
    console.log("HTML dark class:", isDarkClass)
    
    // If there's a mismatch between the theme state and the HTML class, use the HTML class
    if (isDarkClass && currentTheme !== 'dark') {
      setCurrentTheme('dark')
    } else if (!isDarkClass && currentTheme === 'dark') {
      setCurrentTheme('light')
    }
  }, [resolvedTheme, theme, currentTheme])

  // Check localStorage directly
  useEffect(() => {
    // Function to get theme from localStorage
    const getThemeFromStorage = () => {
      try {
        const storedTheme = localStorage.getItem('theme_preference')
        console.log("Theme from localStorage:", storedTheme)
        
        if (storedTheme) {
          return storedTheme
        }
        
        // Check for system preference if theme is set to system or not set
        if (!storedTheme || storedTheme === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          return systemPrefersDark ? 'dark' : 'light'
        }
        
        return storedTheme
      } catch (e) {
        console.error('Error accessing localStorage:', e)
        return undefined
      }
    }
    
    // Initial check
    const storageTheme = getThemeFromStorage()
    if (storageTheme && currentTheme !== storageTheme) {
      setCurrentTheme(storageTheme)
    }
    
    // Set up listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const newTheme = getThemeFromStorage()
      setCurrentTheme(newTheme)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // Also listen for storage changes (in case theme is changed in another tab)
    window.addEventListener('storage', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      window.removeEventListener('storage', handleChange)
    }
  }, [])

  // Listen for theme toggle button clicks
  useEffect(() => {
    const handleThemeButtonClick = () => {
      // Short timeout to allow the theme to be updated
      setTimeout(() => {
        const isDark = document.documentElement.classList.contains('dark')
        console.log("Theme button clicked, isDark:", isDark)
        setCurrentTheme(isDark ? 'dark' : 'light')
      }, 100)
    }
    
    // Find all theme toggle buttons
    const themeButtons = document.querySelectorAll('[aria-label="Toggle theme"]')
    themeButtons.forEach(button => {
      button.addEventListener('click', handleThemeButtonClick)
    })
    
    return () => {
      themeButtons.forEach(button => {
        button.removeEventListener('click', handleThemeButtonClick)
      })
    }
  }, [setCurrentTheme, currentTheme])

  return (
    <Sidebar 
      className={cn("border-r", className)} 
      collapsible="icon" 
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center justify-center relative">
                  <Image 
                    key={currentTheme || 'default'}
                    src={currentTheme === "dark" ? "/MYFC_logo_white.png" : "/MYFC_logo.png"} 
                    alt="MyFaceCoach Logo" 
                    width={100} 
                    height={100} 
                    className="h-auto z-5"
                    priority
                    style={{ 
                      filter: currentTheme === "dark" ? "drop-shadow(0 0 1px rgba(255,255,255,0.5))" : "none",
                      maxWidth: "100%",
                      objectFit: "contain"
                    }}
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}


