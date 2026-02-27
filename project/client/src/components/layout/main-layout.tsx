import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 relative w-full h-full overflow-hidden">
          <header className="absolute top-0 z-50 flex h-16 w-full items-center px-4 bg-background/80 backdrop-blur-md border-b border-border/50">
            <SidebarTrigger className="h-10 w-10 text-muted-foreground hover:text-foreground transition-colors" />
          </header>
          <main className="flex-1 w-full h-full overflow-auto pt-16">
            <div className="mx-auto max-w-7xl p-4 md:p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
