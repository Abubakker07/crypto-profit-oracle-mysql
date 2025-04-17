
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useDatabase } from '@/contexts/DatabaseContext';
import Layout from '@/components/layout/Layout';
import { Settings as SettingsIcon, Database, FileText, Shield, Bell } from 'lucide-react';

const Settings = () => {
  const { testConnection, loading } = useDatabase();

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Configure your calculator preferences and connections
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Database Settings
              </CardTitle>
              <CardDescription>
                Configure database connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="test-connection">Connection Status</Label>
                  <div className="text-sm text-muted-foreground">
                    Test your database connection
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={testConnection}
                  disabled={loading}
                >
                  Test Connection
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-connect">Auto-connect on Startup</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically connect to database on application startup
                  </div>
                </div>
                <Switch id="auto-connect" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="query-logging">Query Logging</Label>
                  <div className="text-sm text-muted-foreground">
                    Log all database queries for debugging
                  </div>
                </div>
                <Switch id="query-logging" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5" />
                Calculator Settings
              </CardTitle>
              <CardDescription>
                Configure how the calculator works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-calculate">Auto-calculate</Label>
                  <div className="text-sm text-muted-foreground">
                    Calculate automatically when inputs change
                  </div>
                </div>
                <Switch id="auto-calculate" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-advanced">Advanced Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Show additional mining calculation parameters
                  </div>
                </div>
                <Switch id="show-advanced" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="price-updates">Real-time Price Updates</Label>
                  <div className="text-sm text-muted-foreground">
                    Update cryptocurrency prices in real-time
                  </div>
                </div>
                <Switch id="price-updates" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Report Settings
              </CardTitle>
              <CardDescription>
                Configure report and export options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-reports">Auto-save Reports</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically save calculation reports to history
                  </div>
                </div>
                <Switch id="save-reports" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="include-chart">Include Charts</Label>
                  <div className="text-sm text-muted-foreground">
                    Include profit charts in exported reports
                  </div>
                </div>
                <Switch id="include-chart" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="export-pdf">PDF Export</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable high-quality PDF exports
                  </div>
                </div>
                <Switch id="export-pdf" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Configure your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-history">Save Calculation History</Label>
                  <div className="text-sm text-muted-foreground">
                    Store your calculation history in your account
                  </div>
                </div>
                <Switch id="save-history" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </div>
                </div>
                <Switch id="email-notifications" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="session-timeout">Extended Session Timeout</Label>
                  <div className="text-sm text-muted-foreground">
                    Keep your session active for longer periods
                  </div>
                </div>
                <Switch id="session-timeout" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
