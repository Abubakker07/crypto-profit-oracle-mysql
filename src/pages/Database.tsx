
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useDatabase } from '@/contexts/DatabaseContext';
import Layout from '@/components/layout/Layout';
import { Database as DatabaseIcon, RefreshCw, Play } from 'lucide-react';

const Database = () => {
  const { isConnected, testConnection, executeQuery, loading } = useDatabase();
  
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('3306');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [database, setDatabase] = useState('mining_calculator');
  
  const [customQuery, setCustomQuery] = useState('SELECT * FROM miners LIMIT 5');
  const [queryResult, setQueryResult] = useState<string>('');
  
  const handleExecuteQuery = async () => {
    try {
      const result = await executeQuery(customQuery);
      setQueryResult(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Query execution error:", error);
      setQueryResult(JSON.stringify({ error: "Failed to execute query" }, null, 2));
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Database Connection</h2>
          <p className="text-muted-foreground">
            Configure and test your MySQL database connection
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>
                  Current MySQL database connection status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-medium">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={testConnection}
                  disabled={loading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Note: This is a simulated connection for demo purposes.
                  In a real application, you would connect to an actual MySQL database.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Tables</CardTitle>
                <CardDescription>
                  Tables in the current database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <DatabaseIcon className="h-4 w-4 text-primary" />
                    <span>miners</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <DatabaseIcon className="h-4 w-4 text-primary" />
                    <span>cryptocurrencies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <DatabaseIcon className="h-4 w-4 text-primary" />
                    <span>users</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <DatabaseIcon className="h-4 w-4 text-primary" />
                    <span>calculation_history</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connection Settings</CardTitle>
                <CardDescription>
                  Configure your MySQL database connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="host">Host</Label>
                    <Input 
                      id="host" 
                      value={host} 
                      onChange={(e) => setHost(e.target.value)} 
                      placeholder="localhost"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input 
                      id="port" 
                      value={port} 
                      onChange={(e) => setPort(e.target.value)} 
                      placeholder="3306"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="database">Database Name</Label>
                  <Input 
                    id="database" 
                    value={database} 
                    onChange={(e) => setDatabase(e.target.value)} 
                    placeholder="mining_calculator"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="root"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Your password"
                  />
                </div>
                
                <Button className="w-full" disabled={loading}>
                  {loading ? "Connecting..." : "Connect to Database"}
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  These settings are for demonstration purposes. 
                  In a production environment, use proper authentication and secure connections.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Query Executor</CardTitle>
                <CardDescription>
                  Run custom SQL queries against your database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="query">SQL Query</Label>
                  <Textarea 
                    id="query" 
                    value={customQuery} 
                    onChange={(e) => setCustomQuery(e.target.value)} 
                    rows={3}
                    placeholder="SELECT * FROM miners LIMIT 5"
                  />
                </div>
                
                <Button 
                  onClick={handleExecuteQuery}
                  disabled={loading || !isConnected}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Execute Query
                </Button>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="result">Result</Label>
                  <div 
                    id="result" 
                    className="p-4 bg-black/30 rounded-md overflow-auto h-64 text-sm font-mono whitespace-pre"
                  >
                    {queryResult || 'Query results will appear here...'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Database;
