
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Calculator, History, FileText, Settings, User, LogOut, Database } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isConnected } = useDatabase();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-sidebar-background border-r border-sidebar-border md:min-h-screen">
        <div className="p-4">
          <h1 className="text-xl font-bold text-sidebar-primary">Mining Calculator</h1>
          <div className="flex items-center mt-2">
            <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-sidebar-foreground">
              {isConnected ? 'Database Connected' : 'Database Disconnected'}
            </span>
          </div>
        </div>
        
        <Separator className="bg-sidebar-border" />
        
        <nav className="p-4 space-y-2">
          <NavLink to="/calculator" className={({ isActive }) => 
            `flex items-center p-2 rounded-md ${isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/80'}`
          }>
            <Calculator className="mr-2 h-4 w-4" />
            Calculator
          </NavLink>
          
          {isAuthenticated && (
            <NavLink to="/history" className={({ isActive }) => 
              `flex items-center p-2 rounded-md ${isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/80'}`
            }>
              <History className="mr-2 h-4 w-4" />
              History
            </NavLink>
          )}
          
          <NavLink to="/export" className={({ isActive }) => 
            `flex items-center p-2 rounded-md ${isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/80'}`
          }>
            <FileText className="mr-2 h-4 w-4" />
            Export
          </NavLink>
          
          <NavLink to="/settings" className={({ isActive }) => 
            `flex items-center p-2 rounded-md ${isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/80'}`
          }>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </NavLink>
          
          <NavLink to="/database" className={({ isActive }) => 
            `flex items-center p-2 rounded-md ${isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/80'}`
          }>
            <Database className="mr-2 h-4 w-4" />
            Database
          </NavLink>
        </nav>
        
        <div className="mt-auto p-4">
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center p-2 rounded-md bg-sidebar-accent">
                <User className="mr-2 h-4 w-4 text-sidebar-primary" />
                <span className="text-sidebar-foreground">{user?.username}</span>
              </div>
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default Layout;
