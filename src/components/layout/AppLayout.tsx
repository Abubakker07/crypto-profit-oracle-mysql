
import React from 'react';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bitcoin, Calculator, ChartBar, Database, Settings, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { 
    title: "Dashboard", 
    path: "/",
    icon: ChartBar 
  },
  { 
    title: "Hardware", 
    path: "/hardware",
    icon: Calculator 
  },
  { 
    title: "Cryptocurrencies", 
    path: "/cryptocurrencies",
    icon: Bitcoin 
  },
  { 
    title: "Electricity", 
    path: "/electricity",
    icon: Wallet 
  },
  { 
    title: "Mining Pools", 
    path: "/mining-pools",
    icon: Database 
  },
  { 
    title: "Settings", 
    path: "/settings",
    icon: Settings 
  }
];

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-border/50">
          <div className="flex items-center h-14 px-4 border-b border-border/50">
            <h1 className="font-bold text-xl bg-clip-text text-transparent crypto-gradient">
              CryptoMiner
            </h1>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.path}
                          className={({isActive}) => 
                            isActive ? "text-primary" : "text-foreground/60 hover:text-foreground"
                          }
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border/50 flex items-center px-4 justify-between">
            <SidebarTrigger />
            <div className="text-sm text-muted-foreground">
              Crypto Mining Profitability Calculator
            </div>
            <div className="flex items-center space-x-2">
              <div className="animate-pulse-slow h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">Connected to MySQL</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
