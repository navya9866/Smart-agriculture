import { Leaf, LayoutDashboard, Wheat, Users, TrendingUp, Sprout } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const [location] = useLocation();

  const navigation = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Crop Management", url: "/crops", icon: Wheat },
    { title: "Labor Analytics", url: "/labor", icon: Users },
  ];

  return (
    <Sidebar variant="inset" className="border-r border-sidebar-border/50">
      <SidebarHeader className="flex items-center justify-center py-6">
        <div className="flex items-center gap-3 w-full px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
            <Sprout className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-tight tracking-tight text-sidebar-foreground">AgriSense</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Analytics</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-6">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1.5">
              {navigation.map((item) => {
                const isActive = location === item.url || (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        transition-all duration-200 rounded-xl px-4 py-6
                        ${isActive 
                          ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-semibold' 
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'}
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                        <span className="text-[15px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
