"use client"

import * as React from "react"
import { LogOut, Settings, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

interface UserData {
  name: string
  email: string
  avatar: string
}

interface NavUserProps {
  user: UserData
}

export function NavUser({ user }: NavUserProps) {
  const { signOut } = useAuth()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  
  return (
    <div className={cn(
      "flex items-center p-4",
      isCollapsed ? "justify-center" : "justify-between"
    )}>
      <div className={cn(
        "flex items-center",
        isCollapsed ? "gap-0" : "gap-2"
      )}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className={cn(
          "grid gap-0.5 text-sm transition-all duration-200",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground",
            isCollapsed ? "hidden" : "flex"
          )}>
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </a>
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
