"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface Project {
  name: string
  url: string
  icon: LucideIcon
}

interface NavProjectsProps {
  projects: Project[]
}

export function NavProjects({ projects }: NavProjectsProps) {
  const pathname = usePathname()

  if (!projects.length) return null

  return (
    <SidebarMenu className="mt-4">
      <div className="px-4 py-2 text-xs font-medium text-muted-foreground">Projects</div>
      {projects.map((project) => {
        const isActive = pathname === project.url || pathname?.startsWith(`${project.url}/`)
        
        return (
          <SidebarMenuItem key={project.url}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link href={project.url}>
                <project.icon className="size-4" />
                <span>{project.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
