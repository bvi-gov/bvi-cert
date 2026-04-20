'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, ClipboardList, Crosshair, Calendar, Building2, Car,
  ShieldAlert, Plane, ArrowRight, Lock,
  ChevronRight, Clock, CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const iconMap: Record<string, React.ElementType> = {
  Shield, ClipboardList, Crosshair, Calendar, Building2, Car, ShieldAlert, Plane, FileText: Shield,
};

interface CertType {
  code: string;
  name: string;
  description: string;
  fee: number;
  days: number;
  is_active: boolean;
  is_coming_soon: boolean;
  icon: string;
  color: string;
}

export default function CertificatesPage() {
  const [types, setTypes] = useState<CertType[]>([]);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyType, setNotifyType] = useState('');
  const [notifySent, setNotifySent] = useState(false);

  useEffect(() => {
    fetch('/api/certificate-types')
      .then(r => r.json())
      .then(data => setTypes(data.types || []))
      .catch(() => {});
  }, []);

  const activeTypes = types.filter(t => t.is_active && !t.is_coming_soon);
  const comingSoon = types.filter(t => t.is_coming_soon);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Government top bar */}
      <div className="w-full py-1.5 px-4 text-center" style={{ backgroundColor: '#0C1B2A' }}>
        <p className="text-[11px] sm:text-xs font-medium tracking-widest uppercase text-white/70">
          Government of the Virgin Islands
        </p>
      </div>
      <div className="h-0.5" style={{ backgroundColor: '#FFD100' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#009B3A] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-[#0C1B2A]">Our Services</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#009B3A' }}>Certificate Services</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#0C1B2A' }}>Our Services</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Apply for official certificates and permits issued by the Royal Virgin Islands Police Force</p>
        </div>

        {/* Active Certificates */}
        {activeTypes.length > 0 && (
          <div className="mb-14">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#0C1B2A' }}>
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#009B3A' }} />
              Available Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {activeTypes.map(type => {
                const Icon = iconMap[type.icon] || Shield;
                return (
                  <Card key={type.code} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden bg-white">
                    <div className="h-1 transition-all duration-300 group-hover:h-1.5" style={{ backgroundColor: type.color }} />
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: `${type.color}15` }}>
                          <Icon className="w-7 h-7" style={{ color: type.color }} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg" style={{ color: '#0C1B2A' }}>{type.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">{type.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-5 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" />
                          Fee: ${type.fee.toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {type.days} business days
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-gray-100">
                      <Button
                        className="w-full font-semibold text-white border-0 shadow-sm hover:shadow-md transition-all"
                        style={{ backgroundColor: '#009B3A' }}
                        onClick={() => window.location.href = `/?apply=${type.code}`}
                      >
                        Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        {comingSoon.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: '#0C1B2A' }}>
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#FFD100' }} />
              Coming Soon
            </h2>
            <p className="text-sm text-gray-500 mb-5 ml-3">These services are under development and will be available once approved by the RVIPF leadership.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {comingSoon.map(type => {
                const Icon = iconMap[type.icon] || Shield;
                return (
                  <Card key={type.code} className="border border-gray-200 bg-white/70 overflow-hidden">
                    <div className="h-0.5" style={{ backgroundColor: '#d4d4d8' }} />
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-7 h-7 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-500">{type.name}</CardTitle>
                          <CardDescription className="text-xs">{type.description}</CardDescription>
                        </div>
                        <Badge className="border-0 text-[10px] font-semibold uppercase tracking-wider" style={{ backgroundColor: '#FFD100', color: '#0C1B2A' }}>
                          Coming Soon
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 mb-4">
                        <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            This service is pending approval and development. Sign up to be notified when it becomes available.
                          </p>
                        </div>
                      </div>
                      {notifyType === type.code ? (
                        <div className="flex gap-2">
                          <Input placeholder="your@email.com" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} className="h-9 text-xs" />
                          <Button size="sm" variant="outline" onClick={() => { setNotifySent(true); setTimeout(() => { setNotifySent(false); setNotifyType(''); }, 3000); }}
                            className="text-xs border-[#009B3A] text-[#009B3A] hover:bg-[#009B3A] hover:text-white"
                          >
                            {notifySent ? 'Subscribed!' : 'Notify Me'}
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-xs text-gray-500 hover:text-[#009B3A]" onClick={() => setNotifyType(type.code)}>
                          <Lock className="w-3 h-3 mr-1.5" /> Get Notified When Available
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <Separator className="my-12" />
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Government of the Virgin Islands — Royal Virgin Islands Police Force. All rights reserved.</p>
          <p className="text-[11px] text-gray-400">For assistance, visit the Road Town Police Station or call +1 (284) 468-3701</p>
        </div>
      </div>
    </div>
  );
}
