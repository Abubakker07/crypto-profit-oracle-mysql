
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfitabilityResult } from '@/types';
import { formatCurrency, formatHashrate, formatPower } from '@/utils/calculationUtils';
import Layout from '@/components/layout/Layout';
import { Printer, Download, ArrowLeft, FileText } from 'lucide-react';

const Export = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  
  const { calculationResult } = location.state as { calculationResult: ProfitabilityResult };
  
  if (!calculationResult) {
    navigate('/calculator');
    return null;
  }
  
  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mining Profitability Report</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .report-date {
              font-size: 14px;
              color: #666;
              margin-bottom: 20px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .info-row {
              display: flex;
              margin-bottom: 10px;
            }
            .info-label {
              font-weight: bold;
              width: 200px;
            }
            .result-row {
              display: flex;
              margin-bottom: 10px;
              justify-content: space-between;
            }
            .result-label {
              font-weight: bold;
            }
            .result-value {
              text-align: right;
            }
            .profit {
              font-size: 18px;
              font-weight: bold;
              color: green;
            }
            .separator {
              height: 1px;
              background-color: #ddd;
              margin: 15px 0;
            }
            .footer {
              margin-top: 40px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Mining Profitability Report</h1>
            <div class="report-date">
              Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Mining Parameters</div>
            <div class="info-row">
              <div class="info-label">Hardware:</div>
              <div>${calculationResult.miner_name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Cryptocurrency:</div>
              <div>${calculationResult.crypto_name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Hashrate:</div>
              <div>${formatHashrate(calculationResult.hashrate)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Power Consumption:</div>
              <div>${formatPower(calculationResult.power_consumption)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Electricity Rate:</div>
              <div>$${calculationResult.electricity_rate.toFixed(2)} per kWh</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Profitability Results</div>
            <div class="result-row">
              <div class="result-label">Daily Revenue:</div>
              <div class="result-value">${formatCurrency(calculationResult.daily_revenue)}</div>
            </div>
            <div class="result-row">
              <div class="result-label">Daily Electricity Cost:</div>
              <div class="result-value">${formatCurrency(calculationResult.daily_cost)}</div>
            </div>
            
            <div class="separator"></div>
            
            <div class="result-row">
              <div class="result-label">Daily Profit:</div>
              <div class="result-value profit">${formatCurrency(calculationResult.daily_profit)}</div>
            </div>
            <div class="result-row">
              <div class="result-label">Monthly Profit (30 days):</div>
              <div class="result-value profit">${formatCurrency(calculationResult.monthly_profit)}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an estimated calculation based on current network difficulty and cryptocurrency prices. 
            Actual results may vary due to difficulty changes, price fluctuations, and other factors.</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
  const handleDownloadPDF = () => {
    // In a real implementation, this would use a library like jsPDF
    // For this demo, we'll just trigger the print dialog
    handlePrint();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Export Results</h2>
            <p className="text-muted-foreground">
              Print or download your mining profitability calculation
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6" ref={printRef}>
                <div className="flex flex-col space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Mining Profitability Report</h2>
                    <p className="text-sm text-muted-foreground">
                      Generated on {formatDate(calculationResult.calculation_date || new Date().toISOString())}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Mining Parameters</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Hardware</p>
                        <p className="font-medium">{calculationResult.miner_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Cryptocurrency</p>
                        <p className="font-medium">{calculationResult.crypto_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Hashrate</p>
                        <p className="font-medium">{formatHashrate(calculationResult.hashrate)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Power Consumption</p>
                        <p className="font-medium">{formatPower(calculationResult.power_consumption)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Electricity Rate</p>
                        <p className="font-medium">${calculationResult.electricity_rate.toFixed(2)} per kWh</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Profitability Results</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Daily Revenue:</span>
                        <span>{formatCurrency(calculationResult.daily_revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Electricity Cost:</span>
                        <span>{formatCurrency(calculationResult.daily_cost)}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold">
                        <span>Daily Profit:</span>
                        <span className="text-green-500">{formatCurrency(calculationResult.daily_profit)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Monthly Profit (30 days):</span>
                        <span className="text-green-500">{formatCurrency(calculationResult.monthly_profit)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground text-center mt-6">
                    <p>This is an estimated calculation based on current network difficulty and cryptocurrency prices.</p>
                    <p>Actual results may vary due to difficulty changes, price fluctuations, and other factors.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Export Options</h3>
                
                <Button variant="outline" className="w-full justify-start" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={handleDownloadPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download as PDF
                </Button>
                
                <Separator />
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">About This Report</p>
                  <p>
                    This report shows the estimated profitability of your selected 
                    mining hardware based on current network conditions and prices.
                  </p>
                  <p className="mt-2">
                    You can save this report for your records or share it with others.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Export;
