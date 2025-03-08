"use client"

import * as React from "react"
import { Bell, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { SearchForm } from "@/components/search-form"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function SiteHeader({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  // Generate breadcrumb items based on the current path
  const generateBreadcrumbs = () => {
    if (!pathname || pathname === "/") return []

    const segments = pathname.split("/").filter(Boolean)
    return segments.map((segment) => {
      const href = `/${segments.slice(0, segments.indexOf(segment) + 1).join("/")}`
      const isLast = segment === segments[segments.length - 1]
      const title = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      return {
        href,
        title,
        isLast
      }
    })
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className={cn("flex h-16 shrink-0 items-center border-b bg-background transition-[width,height] ease-linear", className)}>
      <div className="flex items-center gap-2 px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {breadcrumbs.length > 0 && (
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>
              {/* Only show MYFC as first item if we're not on the dashboard page */}
              {!(pathname === "/dashboard" && breadcrumbs.length === 1) && (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">MYFC</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
              {breadcrumbs.map((breadcrumb) => (
                <React.Fragment key={breadcrumb.href}>
                  {/* Only show separator if we're not on dashboard or this isn't the first item */}
                  {(!(pathname === "/dashboard" && breadcrumb === breadcrumbs[0])) && (
                    <BreadcrumbSeparator />
                  )}
                  <BreadcrumbItem>
                    {breadcrumb.isLast ? (
                      <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      
      <div className="ml-auto flex items-center gap-2 px-6">
        <SearchForm className="hidden md:block" />
        
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || "User"} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
