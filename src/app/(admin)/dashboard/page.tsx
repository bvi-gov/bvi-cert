'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, FileText, Clock, CheckCircle2, XCircle, AlertTriangle,
  TrendingUp, Users, Archive, ArrowUpRight, ArrowDownRight,
  Loader2, BarChart3, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Stats {
  total: number;
  pending: number;
  processing: number;
  approved: number;
  issued: number;
  rejected: number;
  collected: number;
  byType: Record<string, number>;
  byDistrict: Record<string, number>;
  thisWeek: number;
  today: number;
  urgent: number;
  userCount: number;
  archivedCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#009B3A]" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Failed to load dashboard data.</div>;
  }

  const completionRate = stats.total > 0 ? Math.round(((stats.issued + stats.collected) / stats.total) * 100) : 0;

  const kpiCards = [
    { label: 'Total Applications', value: stats.total, icon: FileText, color: '#0C1B2A', bgColor: 'bg-gray-100' },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: '#FFD100', bgColor: 'bg-yellow-50', alert: stats.pending > 10 },
    { label: 'Processing', value: stats.processing, icon: Activity, color: '#009B3A', bgColor: 'bg-green-50' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: '#009B3A', bgColor: 'bg-green-50' },
    { label: 'Issued', value: stats.issued, icon: Shield, color: '#009B3A', bgColor: 'bg-green-50' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: '#dc2626', bgColor: 'bg-red-50' },
    { label: 'Collected', value: stats.collected, icon: CheckCircle2, color: '#009B3A', bgColor: 'bg-green-50' },
    { label: 'Urgent / High', value: stats.urgent, icon: AlertTriangle, color: '#dc2626', bgColor: 'bg-red-50', alert: stats.urgent > 5 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className={`${card.bgColor} border-0 ${card.alert ? 'ring-2 ring-red-300' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: card.color }}>{card.value.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <Icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: '#009B3A' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Today&apos;s Applications</p>
                <p className="text-xl font-bold mt-1" style={{ color: '#0C1B2A' }}>{stats.today}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-[#009B3A]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: '#FFD100' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">This Week</p>
                <p className="text-xl font-bold mt-1" style={{ color: '#0C1B2A' }}>{stats.thisWeek}</p>
              </div>
              <BarChart3 className="w-5 h-5 text-[#FFD100]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: '#009B3A' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Completion Rate</p>
                <p className="text-xl font-bold mt-1" style={{ color: '#0C1B2A' }}>{completionRate}%</p>
              </div>
              <span className="text-xs text-gray-400">{stats.issued + stats.collected}/{stats.total}</span>
            </div>
            <Progress value={completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold" style={{ color: '#0C1B2A' }}>Applications by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                const colors: Record<string, string> = {
                  police: '#009B3A',
                  character: '#FFD100',
                };
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize font-medium">{type.replace('_', ' ')}</span>
                      <span className="text-gray-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: colors[type] || '#009B3A' }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(stats.byType).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Applications by District */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold" style={{ color: '#0C1B2A' }}>Applications by District</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byDistrict)
                .sort(([, a], [, b]) => b - a)
                .map(([district, count]) => {
                  const maxCount = Math.max(...Object.values(stats.byDistrict), 1);
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={district} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-24 truncate">{district}</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                        <div
                          className="h-full rounded flex items-center px-2 text-white text-[10px] font-bold transition-all duration-500"
                          style={{ width: `${Math.max(pct, 8)}%`, backgroundColor: '#009B3A' }}
                        >
                          {count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              {Object.keys(stats.byDistrict).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">System Users</p>
              <p className="text-xl font-bold" style={{ color: '#0C1B2A' }}>{stats.userCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50">
              <Archive className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Archived Records</p>
              <p className="text-xl font-bold" style={{ color: '#0C1B2A' }}>{stats.archivedCount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#009B3A' }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">System Status</p>
              <p className="text-lg font-bold text-[#009B3A] flex items-center gap-1">
                <span className="w-2 h-2 bg-[#009B3A] rounded-full animate-pulse" />
                Operational
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
