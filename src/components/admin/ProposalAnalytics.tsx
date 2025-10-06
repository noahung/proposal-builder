import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ProposalAnalyticsProps {
  onNavigate: (page: string) => void;
}

export const ProposalAnalytics: React.FC<ProposalAnalyticsProps> = ({ onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const overviewData = [
    { name: 'Jan', proposals: 4, approved: 3, value: 25000 },
    { name: 'Feb', proposals: 6, approved: 4, value: 42000 },
    { name: 'Mar', proposals: 8, approved: 5, value: 38000 },
    { name: 'Apr', proposals: 5, approved: 4, value: 55000 },
    { name: 'May', proposals: 7, approved: 5, value: 48000 },
    { name: 'Jun', proposals: 9, approved: 6, value: 62000 },
  ];

  const statusData = [
    { name: 'Approved', value: 27, color: '#10b981' },
    { name: 'Pending', value: 8, color: '#f59e0b' },
    { name: 'Rejected', value: 4, color: '#ef4444' },
    { name: 'Draft', value: 3, color: '#6b7280' },
  ];

  const conversionData = [
    { month: 'Jan', rate: 75 },
    { month: 'Feb', rate: 67 },
    { month: 'Mar', rate: 63 },
    { month: 'Apr', rate: 80 },
    { month: 'May', rate: 71 },
    { month: 'Jun', rate: 67 },
  ];

  const topPerformingProposals = [
    { title: 'E-commerce Platform Development', client: 'RetailCo', value: '£85,000', conversionTime: '3 days' },
    { title: 'Brand Identity Redesign', client: 'StartupXYZ', value: '£25,000', conversionTime: '5 days' },
    { title: 'Mobile App Development', client: 'TechCorp', value: '£65,000', conversionTime: '7 days' },
    { title: 'Website Redesign', client: 'CreativeAgency', value: '£35,000', conversionTime: '4 days' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Proposal Analytics</h1>
        <div className="flex gap-2">
          <NeumorphButton onClick={() => onNavigate('export-reports')}>
            📊 Export Reports
          </NeumorphButton>
          <NeumorphButton variant="primary">
            Generate Report
          </NeumorphButton>
        </div>
      </div>

      {/* Period Selector */}
      <NeumorphCard>
        <div className="flex items-center justify-between">
          <h3>Analytics Overview</h3>
          <div className="flex gap-2">
            {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
              <NeumorphButton
                key={period}
                size="sm"
                variant={selectedPeriod === period ? 'primary' : 'default'}
                onClick={() => setSelectedPeriod(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </NeumorphButton>
            ))}
          </div>
        </div>
      </NeumorphCard>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <NeumorphCard className="text-center">
          <p className="text-sm text-muted-foreground">Total Proposals</p>
          <h2 className="text-primary">42</h2>
          <p className="text-sm text-green-600">+12% from last month</p>
        </NeumorphCard>
        
        <NeumorphCard className="text-center">
          <p className="text-sm text-muted-foreground">Approval Rate</p>
          <h2 className="text-primary">67%</h2>
          <p className="text-sm text-green-600">+5% from last month</p>
        </NeumorphCard>
        
        <NeumorphCard className="text-center">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <h2 className="text-primary">£270k</h2>
          <p className="text-sm text-green-600">+18% from last month</p>
        </NeumorphCard>
        
        <NeumorphCard className="text-center">
          <p className="text-sm text-muted-foreground">Avg. Response Time</p>
          <h2 className="text-primary">4.2 days</h2>
          <p className="text-sm text-red-600">+0.5 days from last month</p>
        </NeumorphCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proposals Over Time */}
        <NeumorphCard>
          <h3 className="mb-4">Proposals & Approvals Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                <XAxis dataKey="name" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Bar dataKey="proposals" fill="#f47421" />
                <Bar dataKey="approved" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeumorphCard>

        {/* Proposal Status Distribution */}
        <NeumorphCard>
          <h3 className="mb-4">Proposal Status Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </NeumorphCard>

        {/* Conversion Rate Trend */}
        <NeumorphCard>
          <h3 className="mb-4">Conversion Rate Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                <XAxis dataKey="month" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Line type="monotone" dataKey="rate" stroke="#f47421" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </NeumorphCard>

        {/* Top Performing Proposals */}
        <NeumorphCard>
          <h3 className="mb-4">Top Performing Proposals</h3>
          <div className="space-y-4">
            {topPerformingProposals.map((proposal, index) => (
              <div key={index} className="flex items-center justify-between p-3 neumorph-inset rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm">{proposal.title}</h4>
                  <p className="text-xs text-muted-foreground">{proposal.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{proposal.value}</p>
                  <p className="text-xs text-muted-foreground">{proposal.conversionTime}</p>
                </div>
              </div>
            ))}
          </div>
        </NeumorphCard>
      </div>

      {/* Detailed Analytics Table */}
      <NeumorphCard>
        <div className="flex items-center justify-between mb-4">
          <h3>Recent Proposal Performance</h3>
          <NeumorphButton size="sm">
            View All Proposals
          </NeumorphButton>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Proposal</th>
                <th className="text-left py-3 px-4">Client</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Value</th>
                <th className="text-left py-3 px-4">Views</th>
                <th className="text-left py-3 px-4">Time Spent</th>
                <th className="text-left py-3 px-4">Last Viewed</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: 'Website Redesign', client: 'TechCorp', status: 'Approved', value: '£25,000', views: 8, timeSpent: '45 min', lastViewed: '2 hours ago' },
                { title: 'Brand Identity', client: 'StartupXYZ', status: 'Pending', value: '£15,000', views: 3, timeSpent: '12 min', lastViewed: '1 day ago' },
                { title: 'Mobile App', client: 'RetailCo', status: 'Viewed', value: '£65,000', views: 5, timeSpent: '28 min', lastViewed: '3 hours ago' },
              ].map((row, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-3 px-4">{row.title}</td>
                  <td className="py-3 px-4">{row.client}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      row.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{row.value}</td>
                  <td className="py-3 px-4">{row.views}</td>
                  <td className="py-3 px-4">{row.timeSpent}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{row.lastViewed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NeumorphCard>
    </div>
  );
};