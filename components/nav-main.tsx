"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

interface NavMainProps {
  items: NavItem[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  
  // Initialize with active items open
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    items.forEach(item => {
      const isActive = item.isActive || pathname === item.url || pathname?.startsWith(`${item.url}/`);
      if (item.items?.length && isActive) {
        initialState[item.url] = true;
      }
    });
    return initialState;
  });

  // Close all dropdowns when sidebar collapses
  React.useEffect(() => {
    if (isCollapsed) {
      setOpenItems({});
    }
  }, [isCollapsed]);

  const handleToggle = (url: string, isOpen: boolean) => {
    setOpenItems(prev => ({
      ...prev,
      [url]: isOpen
    }));
  };

  return (
    <SidebarMenu>
      <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0">Main</div>
      {items.map((item) => {
        const isActive = item.isActive || pathname === item.url || pathname?.startsWith(`${item.url}/`)
        
        if (!item.items?.length) {
          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.url}>
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        }

        return (
          <Collapsible 
            key={item.url} 
            defaultOpen={isActive && !isCollapsed}
            open={!isCollapsed && openItems[item.url]}
            onOpenChange={(open) => handleToggle(item.url, open)}
            disabled={isCollapsed}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={isActive}>
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent className={cn(
              "pl-4 pt-1 transition-all duration-200",
              isCollapsed && "hidden"
            )}>
              <SidebarMenu>
                {item.items.map((subItem) => {
                  const isSubItemActive = pathname === subItem.url
                  
                  return (
                    <SidebarMenuItem key={subItem.url}>
                      <SidebarMenuButton asChild isActive={isSubItemActive}>
                        <Link href={subItem.url}>{subItem.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </SidebarMenu>
  )
}
