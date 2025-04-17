
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDatabase } from '@/contexts/DatabaseContext';
import { Database } from 'lucide-react';

const Settings = () => {
  const { isConnected, testConnection, loading } = useDatabase();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your calculator settings and database connection.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Connection</CardTitle>
              <CardDescription>
                Manage your MySQL database connection settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="db-connection">Connection Status</Label>
                  <div className="text-sm text-muted-foreground">
                    {isConnected ? 'Connected to MySQL database' : 'Disconnected'}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <Label htmlFor="db-connection">{isConnected ? 'Connected' : 'Disconnected'}</Label>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Test Connection</Label>
                  <div className="text-sm text-muted-foreground">
                    Verify that your database connection is working properly.
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={testConnection}
                  disabled={loading}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how the calculator displays information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="real-time-updates">Real-time Updates</Label>
                  <div className="text-sm text-muted-foreground">
                    Update calculations in real-time as values change.
                  </div>
                </div>
                <Switch id="real-time-updates" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="advanced-metrics">Advanced Metrics</Label>
                  <div className="text-sm text-muted-foreground">
                    Show additional profitability metrics and calculations.
                  </div>
                </div>
                <Switch id="advanced-metrics" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    The calculator is always in dark mode currently.
                  </div>
                </div>
                <Switch id="dark-mode" defaultChecked disabled />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
