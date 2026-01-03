"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  Users,
  Image,
} from "lucide-react"

import { UserNav } from "@/components/user-nav"
import { AdminSidebar } from "photostudio-shared/components/admin/admin-sidebar"

type SidebarData = {
  navMain: {
    title: string
    url: string
    icon: any
    isActive?: boolean
  }[]
  navSecondary: {
    title: string
    url: string
    icon: any
  }[]
}

function buildNavData(activePath: string | null): SidebarData {
  return {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: activePath === "/dashboard",
      },
      {
        title: "Clients",
        url: "/dashboard/clients",
        icon: Users,
        isActive: activePath?.startsWith("/dashboard/clients"),
      },
      {
        title: "Galleries",
        url: "/dashboard/galleries",
        icon: Image,
        isActive: activePath?.startsWith("/dashboard/galleries"),
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        isActive: activePath?.startsWith("/settings"),
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "mailto:hello@yourstudio.com",
        icon: HelpCircle,
      },
    ],
  }
}

type AppSidebarProps = Omit<
  React.ComponentProps<typeof AdminSidebar>,
  "headerTitle" | "headerSubtitle" | "headerIcon" | "navMain" | "navSecondary" | "footer"
> & { activePath?: string | null }

export function AppSidebar({ activePath = null, ...props }: AppSidebarProps) {
  const data = React.useMemo(() => buildNavData(activePath), [activePath])

  return (
    <AdminSidebar
      headerTitle="Studio Manager"
      headerSubtitle="Workspace"
      headerIcon={LayoutDashboard}
      navMain={data.navMain}
      navSecondary={data.navSecondary}
      footer={<UserNav />}
      {...props}
    />
  )
}
