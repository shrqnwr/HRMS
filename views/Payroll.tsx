import React, { useState, useEffect } from 'react';
import { PayrollService } from '../services';
import { PayrollRecord } from '../types';
import { Card, SectionHeader, Button, Badge } from '../components';
import { DollarSign, Download, PlayCircle, AlertCircle } from 'lucide-react';

export const Payroll = () => {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPayroll();
  }, []);

  const loadPayroll = async () => {
    const data = await PayrollService.getRecords();
    setRecords(data);
    setLoading(false);
  };

  const handleRunPayroll = async () => {
    setProcessing(true);
    const newRecords = await PayrollService.runPayroll('Nov 2023');
    setRecords([...records, ...newRecords]);
    setProcessing(false);
  };

  if (loading) return <div className="p-8 text-center">Loading Payroll Data...</div>;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Payroll & Benefits" 
        description="Global payroll processing, tax filing, and benefits administration."
        action={
          <Button 
            variant="primary" 
            onClick={handleRunPayroll} 
            disabled={processing}
            className={processing ? 'opacity-70 cursor-not-allowed' : ''}
          >
            {processing ? 'Processing...' : <><PlayCircle size={16} className="mr-2"/> Run Nov Payroll</>}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-100">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign size={20}/></div>
             <span className="text-sm font-medium text-green-800">Total Payroll Cost</span>
           </div>
           <p className="text-3xl font-bold text-green-900">$21,666</p>
           <p className="text-xs text-green-600 mt-1">Last run: Oct 31, 2023</p>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Download size={20}/></div>
             <span className="text-sm font-medium text-blue-800">Tax Liabilities</span>
           </div>
           <p className="text-3xl font-bold text-blue-900">$5,400</p>
           <p className="text-xs text-blue-600 mt-1">Due: Nov 15, 2023</p>
        </Card>
        <Card className="bg-yellow-50 border-yellow-100">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><AlertCircle size={20}/></div>
             <span className="text-sm font-medium text-yellow-800">Pending Approvals</span>
           </div>
           <p className="text-3xl font-bold text-yellow-900">3</p>
           <p className="text-xs text-yellow-600 mt-1">Nov 2023 Period</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-bold text-gray-900">Payroll History</h3>
           <Button variant="outline" size="sm">Export Report</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="p-4">Period</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Gross Pay</th>
                <th className="p-4">Taxes</th>
                <th className="p-4">Benefits</th>
                <th className="p-4">Net Pay</th>
                <th className="p-4">Payment Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{record.period}</td>
                  <td className="p-4 text-gray-500">{record.employeeId}</td>
                  <td className="p-4">${record.grossPay.toLocaleString()}</td>
                  <td className="p-4 text-red-500">-${record.taxes.toLocaleString()}</td>
                  <td className="p-4 text-orange-500">-${record.benefits.toLocaleString()}</td>
                  <td className="p-4 font-bold text-green-600">${record.netPay.toLocaleString()}</td>
                  <td className="p-4 text-gray-500">{record.paymentDate || '-'}</td>
                  <td className="p-4">
                    <Badge color={record.status === 'Processed' ? 'green' : 'yellow'}>{record.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
