"use client"

import * as React from "react"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

// Keep the interface for backward compatibility
interface UserData {
  name: string
  email: string
  avatar: string
}

interface NavUserProps {
  user?: UserData
}

export function NavUser({ user: propUser }: NavUserProps) {
  const { user: authUser, signOut } = useAuth()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  
  // Use auth user data if available, otherwise fall back to prop user
  const displayName = authUser?.email?.split('@')[0] || propUser?.name || 'User'
  const email = authUser?.email || propUser?.email || ''
  const avatarUrl = authUser?.user_metadata?.avatar_url || propUser?.avatar || ''
  const initial = (displayName?.charAt(0) || 'U').toUpperCase()
  
  return (
    <div className={cn(
      "flex items-center p-4",
      isCollapsed ? "justify-center" : "justify-between"
    )}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn(
            "flex items-center gap-2 p-0 h-auto w-full hover:bg-transparent",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <div className={cn(
                "grid gap-0.5 text-sm transition-all duration-200 text-left",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                <div className="font-medium">{displayName}</div>
                <div className="text-xs text-muted-foreground">{email}</div>
              </div>
            </div>
            {!isCollapsed && (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile?tab=general">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
