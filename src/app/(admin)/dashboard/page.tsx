'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, FileText, Clock, CheckCircle2, XCircle, AlertTriangle,
  TrendingUp, Users, Archive, BarChart3, Activity, Eye,
  PlusCircle, Search, FileBarChart, ArrowRight,
  UserPlus, FileCheck, Mail, Upload, Settings,
  Loader2, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Progress & Button available for future use

// ── Types ────────────────────────────────────────────────────────────────────

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
  // New analytics fields
  dailyViews: number[];
  weeklyViews: number;
  monthlyViews: number;
  totalViews: number;
}

// ── Animated Counter Hook ────────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      // Use rAF to avoid synchronous setState
      rafRef.current = requestAnimationFrame(() => {
        setValue(target);
      });
      return () => cancelAnimationFrame(rafRef.current);
    }

    startTimeRef.current = null;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      setValue(Math.round(easedProgress * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, enabled]);

  return value;
}

// ── Animated Counter Component ───────────────────────────────────────────────

function AnimatedNumber({ value, duration = 1200, enabled = true }: { value: number; duration?: number; enabled?: boolean }) {
  const animated = useAnimatedCounter(value, duration, enabled);
  return <>{animated.toLocaleString()}</>;
}

// ── Sample Activity Data ─────────────────────────────────────────────────────

const sampleActivities = [
  { id: 1, icon: UserPlus, text: 'New user account created for T. Smith', time: '2 minutes ago', color: '#009B3A' },
  { id: 2, icon: FileCheck, text: 'Police certificate #1042 approved', time: '15 minutes ago', color: '#009B3A' },
  { id: 3, icon: Upload, text: 'Supporting documents uploaded for app #1038', time: '32 minutes ago', color: '#FFD100' },
  { id: 4, icon: Mail, text: 'Notification email sent to J. Mohammed', time: '1 hour ago', color: '#0C1B2A' },
  { id: 5, icon: Settings, text: 'System configuration updated by admin', time: '3 hours ago', color: '#64748b' },
];

// ── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [progressAnimated, setProgressAnimated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/dashboard/stats')
      .then((res) => {
        if (!cancelled && res.ok) return res.json();
      })
      .then((data) => {
        if (!cancelled && data) setStats(data);
      })
      .catch((e) => {
        if (!cancelled) console.error('Failed to load stats:', e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const mountedRef = useRef(false);
  const progressRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      mountedRef.current = true;
      setMounted(true);
    }, 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (stats && !progressRef.current) {
      const t = setTimeout(() => {
        progressRef.current = true;
        setProgressAnimated(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#009B3A' }} />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Failed to load dashboard data.</div>;
  }

  const completionRate = stats.total > 0 ? Math.round(((stats.issued + stats.collected) / stats.total) * 100) : 0;
  const todayViews = stats.dailyViews?.[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] ?? 0;
  const maxDailyView = Math.max(...(stats.dailyViews ?? [1]), 1);

  // Normalize daily views for API data; fall back to zeros if absent
  const dailyViews = stats.dailyViews ?? [0, 0, 0, 0, 0, 0, 0];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const quickActions = [
    { label: 'New Application', icon: PlusCircle, color: '#009B3A', bg: 'rgba(0,155,58,0.08)' },
    { label: 'Search Records', icon: Search, color: '#FFD100', bg: 'rgba(255,209,0,0.1)' },
    { label: 'View Reports', icon: FileBarChart, color: '#0C1B2A', bg: 'rgba(12,27,42,0.06)' },
  ];

  const kpiCards = [
    { label: 'Total Applications', value: stats.total, icon: FileText, color: '#0C1B2A', bgColor: '#f8fafc', alert: false },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: '#FFD100', bgColor: '#fffbeb', alert: stats.pending > 10 },
    { label: 'Processing', value: stats.processing, icon: Activity, color: '#009B3A', bgColor: '#f0fdf4' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: '#009B3A', bgColor: '#f0fdf4' },
    { label: 'Issued', value: stats.issued, icon: Shield, color: '#009B3A', bgColor: '#f0fdf4' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: '#dc2626', bgColor: '#fef2f2', alert: false },
    { label: 'Collected', value: stats.collected, icon: CheckCircle2, color: '#009B3A', bgColor: '#f0fdf4' },
    { label: 'Urgent / High', value: stats.urgent, icon: AlertTriangle, color: '#dc2626', bgColor: '#fef2f2', alert: stats.urgent > 5 },
  ];

  const portalStatCards = [
    { label: "Today's Visitors", value: todayViews, icon: Eye, accent: '#009B3A' },
    { label: 'This Week', value: stats.weeklyViews ?? 0, icon: TrendingUp, accent: '#FFD100' },
    { label: 'This Month', value: stats.monthlyViews ?? 0, icon: BarChart3, accent: '#0C1B2A' },
    { label: 'All-Time Views', value: stats.totalViews ?? 0, icon: Globe, accent: '#009B3A' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Quick Actions ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.label}
              className="cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-0 shadow-sm"
              style={{
                backgroundColor: action.bg,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms, box-shadow 0.2s ease`,
              }}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${action.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="font-semibold text-sm" style={{ color: '#0C1B2A' }}>
                    {action.label}
                  </span>
                </div>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: action.color, opacity: 0.6 }}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── KPI Summary Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className={`transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border-0 shadow-sm ${
                card.alert ? 'ring-2 ring-red-300' : ''
              }`}
              style={{
                backgroundColor: card.bgColor,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms, box-shadow 0.2s ease`,
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: card.color }}>
                      <AnimatedNumber value={card.value} enabled={mounted} duration={1000} />
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <Icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                </div>
                {card.alert && (
                  <div className="mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] font-medium text-red-500">Requires attention</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Secondary Stats Row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Today's Applications", value: stats.today, icon: TrendingUp, borderColor: '#009B3A' },
          { label: 'This Week', value: stats.thisWeek, icon: BarChart3, borderColor: '#FFD100' },
          { label: 'Completion Rate', value: completionRate, icon: null, borderColor: '#009B3A', suffix: '%' },
        ].map((item, i) => (
          <Card
            key={item.label}
            className="transition-all duration-300 hover:shadow-md border-l-4"
            style={{
              borderLeftColor: item.borderColor,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.5s ease ${300 + i * 80}ms, transform 0.5s ease ${300 + i * 80}ms, box-shadow 0.2s ease`,
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-xl font-bold mt-1" style={{ color: '#0C1B2A' }}>
                    {item.label === 'Completion Rate' ? (
                      <AnimatedNumber value={item.value} enabled={mounted} duration={1200} />
                    ) : (
                      <AnimatedNumber value={item.value} enabled={mounted} duration={1200} />
                    )}
                    {item.suffix}
                  </p>
                </div>
                {item.icon && <item.icon className="w-5 h-5" style={{ color: item.borderColor }} />}
                {!item.icon && <span className="text-xs text-gray-400">{stats.issued + stats.collected}/{stats.total}</span>}
              </div>
              {item.label === 'Completion Rate' && (
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: progressAnimated ? `${completionRate}%` : '0%',
                      backgroundColor: '#009B3A',
                      transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Portal Analytics ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Stats */}
        <Card
          className="lg:col-span-1 border-0 shadow-sm"
          style={{
            backgroundColor: '#f8fafc',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 400ms, transform 0.6s ease 400ms',
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ color: '#0C1B2A' }}>
              <Globe className="w-4 h-4" style={{ color: '#009B3A' }} />
              Portal Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {portalStatCards.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="rounded-xl p-3 transition-all duration-200 hover:shadow-sm"
                    style={{
                      backgroundColor: 'white',
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                      transition: `opacity 0.4s ease ${500 + i * 70}ms, transform 0.4s ease ${500 + i * 70}ms`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${s.accent}14` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: s.accent }} />
                      </div>
                    </div>
                    <p className="text-lg font-bold" style={{ color: '#0C1B2A' }}>
                      <AnimatedNumber value={s.value} enabled={mounted} duration={1400} />
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Bar Chart */}
        <Card
          className="lg:col-span-2 border-0 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: '#f8fafc',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 500ms, transform 0.6s ease 500ms',
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold" style={{ color: '#0C1B2A' }}>
              7-Day Traffic Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2" style={{ height: 180 }}>
              {dailyViews.map((count, i) => {
                const heightPct = maxDailyView > 0 ? (count / maxDailyView) * 100 : 0;
                const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                return (
                  <div key={dayLabels[i]} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-semibold" style={{ color: '#0C1B2A' }}>
                      {count}
                    </span>
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-md transition-all duration-700 ease-out relative group cursor-pointer"
                        style={{
                          height: progressAnimated ? `${Math.max(heightPct, 4)}%` : '0%',
                          backgroundColor: isToday ? '#009B3A' : '#c5e8d4',
                          transitionDelay: `${i * 80}ms`,
                          minHeight: 4,
                        }}
                      >
                        {/* Tooltip on hover */}
                        <div
                          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          style={{ backgroundColor: '#0C1B2A' }}
                        >
                          {count} views
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: isToday ? '#009B3A' : '#94a3b8' }}
                    >
                      {dayLabels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Type */}
        <Card
          className="border-0 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: '#f8fafc',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 600ms, transform 0.6s ease 600ms',
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold" style={{ color: '#0C1B2A' }}>
              Applications by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.byType).map(([type, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                const colors: Record<string, string> = {
                  police: '#009B3A',
                  character: '#FFD100',
                };
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="capitalize font-medium" style={{ color: '#0C1B2A' }}>
                        {type.replace('_', ' ')}
                      </span>
                      <span className="text-gray-500 font-medium">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2.5 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: progressAnimated ? `${pct}%` : '0%',
                          backgroundColor: colors[type] || '#009B3A',
                          transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
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
        <Card
          className="border-0 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: '#f8fafc',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 700ms, transform 0.6s ease 700ms',
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold" style={{ color: '#0C1B2A' }}>
              Applications by District
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byDistrict)
                .sort(([, a], [, b]) => b - a)
                .map(([district, count], idx) => {
                  const maxCount = Math.max(...Object.values(stats.byDistrict), 1);
                  const pct = Math.round((count / maxCount) * 100);
                  const barColors = ['#009B3A', '#0C1B2A', '#FFD100'];
                  return (
                    <div key={district} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-24 truncate" style={{ color: '#0C1B2A' }}>
                        {district}
                      </span>
                      <div className="flex-1 h-7 bg-white rounded overflow-hidden">
                        <div
                          className="h-full rounded flex items-center px-2 text-white text-[11px] font-bold transition-all duration-700 ease-out"
                          style={{
                            width: progressAnimated ? `${Math.max(pct, 8)}%` : '0%',
                            backgroundColor: barColors[idx % barColors.length],
                            transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
                            transitionDelay: `${idx * 100}ms`,
                          }}
                        >
                          {progressAnimated && count}
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

      {/* ── Recent Activity ─────────────────────────────────────────── */}
      <Card
        className="border-0 shadow-sm transition-all duration-300 hover:shadow-md"
        style={{
          backgroundColor: '#f8fafc',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease 800ms, transform 0.6s ease 800ms',
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ color: '#0C1B2A' }}>
              <Activity className="w-4 h-4" style={{ color: '#009B3A' }} />
              Recent Activity
            </CardTitle>
            <Badge variant="outline" style={{ borderColor: '#009B3A', color: '#009B3A' }} className="text-[10px]">
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {sampleActivities.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm group"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity 0.4s ease ${900 + i * 80}ms, transform 0.4s ease ${900 + i * 80}ms, background-color 0.15s ease`,
                  }}
                >
                  <div
                    className="p-2 rounded-lg transition-transform duration-200 group-hover:scale-110 flex-shrink-0"
                    style={{ backgroundColor: `${activity.color}14` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#0C1B2A' }}>
                      {activity.text}
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── System Overview ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'System Users',
            value: stats.userCount,
            icon: Users,
            iconBg: 'rgba(0,155,58,0.08)',
            iconColor: '#009B3A',
            badge: null,
          },
          {
            label: 'Archived Records',
            value: stats.archivedCount,
            icon: Archive,
            iconBg: 'rgba(255,209,0,0.1)',
            iconColor: '#FFD100',
            badge: null,
          },
          {
            label: 'System Status',
            value: null,
            icon: Shield,
            iconBg: '#009B3A',
            iconColor: '#ffffff',
            badge: { text: 'Operational', color: '#009B3A' },
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className="transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border-0 shadow-sm"
              style={{
                backgroundColor: '#f8fafc',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${1000 + i * 80}ms, transform 0.5s ease ${1000 + i * 80}ms, box-shadow 0.2s ease`,
              }}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className="p-3 rounded-xl transition-transform duration-200 hover:scale-110"
                  style={{ backgroundColor: item.iconBg }}
                >
                  <Icon className="w-6 h-6" style={{ color: item.iconColor }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  {item.value !== null ? (
                    <p className="text-xl font-bold" style={{ color: '#0C1B2A' }}>
                      <AnimatedNumber value={item.value} enabled={mounted} duration={1400} />
                    </p>
                  ) : (
                    <p
                      className="text-lg font-bold flex items-center gap-1.5"
                      style={{ color: '#009B3A' }}
                    >
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{
                          backgroundColor: '#009B3A',
                          animation: mounted ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                        }}
                      />
                      {item.badge?.text}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Inline Keyframes for pulse ──────────────────────────────── */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
