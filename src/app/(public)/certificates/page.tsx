'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield, ClipboardList, Crosshair, Calendar, Building2, Car,
  ShieldAlert, Plane, ArrowRight, Star, Lock, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      {/* Header */}
      <div className="w-full text-white py-3 px-4 text-center text-xs sm:text-sm font-medium" style={{ backgroundColor: '#009B3A' }}>
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Royal Virgin Islands Police Force — Certificate Services</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: '#0C1B2A' }}>Our Services</h1>
          <p className="text-gray-500 mt-2">Apply for official certificates and permits issued by the RVIPF</p>
        </div>

        {/* Active Certificates */}
        {activeTypes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#0C1B2A' }}>Available Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTypes.map(type => {
                const Icon = iconMap[type.icon] || FileText;
                return (
                  <Card key={type.code} className="border-2 hover:border-[#009B3A] transition-all group cursor-pointer hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: `${type.color}15` }}>
                          <Icon className="w-6 h-6" style={{ color: type.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-base" style={{ color: '#0C1B2A' }}>{type.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">{type.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> Fee: ${type.fee.toFixed(2)}</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {type.days} business days</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full text-white font-semibold"
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
            <h2 className="text-xl font-bold mb-2" style={{ color: '#0C1B2A' }}>Coming Soon</h2>
            <p className="text-sm text-gray-500 mb-4">These services are under development and will be available once approved by the RVIPF leadership.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {comingSoon.map(type => {
                const Icon = iconMap[type.icon] || FileText;
                return (
                  <Card key={type.code} className="border-2 border-dashed border-gray-300 opacity-80">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gray-100">
                          <Icon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base text-gray-600">{type.name}</CardTitle>
                          <CardDescription className="text-xs">{type.description}</CardDescription>
                        </div>
                        <Badge className="bg-[#FFD100] text-[#0C1B2A]">Coming Soon</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-400 mb-3">This service is pending approval. Sign up to be notified when it becomes available.</p>
                      {notifyType === type.code ? (
                        <div className="flex gap-2">
                          <Input placeholder="your@email.com" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} className="h-8 text-xs" />
                          <Button size="sm" variant="outline" onClick={() => { setNotifySent(true); setTimeout(() => { setNotifySent(false); setNotifyType(''); }, 3000); }}
                            className="text-xs border-[#009B3A] text-[#009B3A]">
                            {notifySent ? 'Subscribed!' : 'Notify Me'}
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-xs text-gray-500" onClick={() => setNotifyType(type.code)}>
                          <Lock className="w-3 h-3 mr-1" /> Get Notified
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
        <Separator className="my-10" />
        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>&copy; {new Date().getFullYear()} Royal Virgin Islands Police Force. All rights reserved.</p>
          <p>For assistance, visit the Road Town Police Station or call +1 (284) 468-3701</p>
        </div>
      </div>
    </div>
  );
}
