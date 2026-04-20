'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, RefreshCw, ChevronLeft, ChevronRight,
  Eye, CheckCircle2, XCircle, Clock, AlertTriangle, UserPlus,
  Loader2, ArrowUpDown, MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Application {
  id: string;
  tracking_number: string;
  type: string;
  status: string;
  surname: string;
  given_names: string;
  created_at: string;
  updated_at: string;
  district: string;
  internal_priority: string;
  notes: string;
  assigned_to: string | null;
  assigned_user?: { id: string; full_name: string; email: string };
  email: string;
  contact_number: string;
  occupation: string;
  payment_status: string;
  purpose: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  under_review: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  issued: 'bg-green-200 text-green-900',
  collected: 'bg-gray-100 text-gray-800',
  rejected: 'bg-red-100 text-red-800',
};

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-500 text-white',
  high: 'bg-orange-100 text-orange-800',
  normal: 'bg-gray-100 text-gray-700',
  low: 'bg-blue-100 text-blue-700',
};

export default function ControlTowerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ status: 'all', type: 'all', district: 'all', priority: 'all', search: '' });
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '25' });
      if (filters.status !== 'all') params.set('status', filters.status);
      if (filters.type !== 'all') params.set('type', filters.type);
      if (filters.district !== 'all') params.set('district', filters.district);
      if (filters.priority !== 'all') params.set('priority', filters.priority);
      if (filters.search) params.set('search', filters.search);

      const res = await fetch(`/api/applications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
        setTotal(data.total);
      }
    } catch (e) {
      console.error('Failed to load applications:', e);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { loadApps(); }, [loadApps]);

  const updateApplication = async (id: string, updates: Record<string, unknown>) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        setSelectedApp(null);
        setActionNote('');
        loadApps();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / 25);

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, tracking number..."
                className="pl-9"
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
              />
            </div>
            <Select value={filters.status} onValueChange={(v) => { setFilters(f => ({ ...f, status: v })); setPage(1); }}>
              <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.priority} onValueChange={(v) => { setFilters(f => ({ ...f, priority: v })); setPage(1); }}>
              <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadApps} className="shrink-0">
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{total} application{total !== 1 ? 's' : ''} found</span>
        <span>Page {page} of {totalPages || 1}</span>
      </div>

      {/* Applications Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tracking #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Applicant</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#009B3A]" /></td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No applications found</td></tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: '#009B3A' }}>{app.tracking_number}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{app.surname}, {app.given_names}</p>
                        <p className="text-xs text-gray-400">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-xs">{app.type?.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <Badge className={`${statusColors[app.status] || 'bg-gray-100'} text-[10px]`}>
                        {app.status?.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`${priorityColors[app.internal_priority || 'normal']} text-[10px]`}>
                        {app.internal_priority || 'normal'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(app.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <Button key={p} variant={p === page ? 'default' : 'outline'} size="sm"
                  style={p === page ? { backgroundColor: '#009B3A' } : {}}
                  onClick={() => setPage(p)} className="w-8">{p}</Button>
              );
            })}
          </div>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span style={{ color: '#009B3A' }}>{selectedApp.tracking_number}</span>
                  <Badge className={statusColors[selectedApp.status]}>{selectedApp.status}</Badge>
                  <Badge className={priorityColors[selectedApp.internal_priority || 'normal']}>{selectedApp.internal_priority || 'normal'}</Badge>
                </DialogTitle>
                <DialogDescription>Application details and management actions</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Applicant Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Full Name</p><p className="font-medium">{selectedApp.given_names} {selectedApp.surname}</p></div>
                  <div><p className="text-xs text-gray-500">Type</p><p className="font-medium capitalize">{selectedApp.type}</p></div>
                  <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{selectedApp.email}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{selectedApp.contact_number}</p></div>
                  <div><p className="text-xs text-gray-500">Occupation</p><p className="font-medium">{selectedApp.occupation}</p></div>
                  <div><p className="text-xs text-gray-500">District</p><p className="font-medium">{selectedApp.district || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Purpose</p><p className="font-medium">{selectedApp.purpose}</p></div>
                  <div><p className="text-xs text-gray-500">Payment</p><p className="font-medium">{selectedApp.payment_status}</p></div>
                  <div><p className="text-xs text-gray-500">Applied</p><p className="font-medium">{new Date(selectedApp.created_at).toLocaleString()}</p></div>
                  <div><p className="text-xs text-gray-500">Last Updated</p><p className="font-medium">{new Date(selectedApp.updated_at).toLocaleString()}</p></div>
                </div>

                {/* Notes */}
                {selectedApp.notes && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{selectedApp.notes}</p>
                  </div>
                )}

                {/* Action Note */}
                <div>
                  <Textarea placeholder="Add a note (optional)" value={actionNote} onChange={(e) => setActionNote(e.target.value)} className="h-16" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button disabled={actionLoading} onClick={() => updateApplication(selectedApp.id, { status: 'processing', notes: actionNote })}
                    className="bg-blue-600 text-white hover:bg-blue-700">
                    <Clock className="w-4 h-4 mr-1" /> Start Processing
                  </Button>
                  <Button disabled={actionLoading} onClick={() => updateApplication(selectedApp.id, { status: 'approved', notes: actionNote })}
                    className="bg-[#009B3A] text-white hover:bg-[#007a2e]">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button disabled={actionLoading} onClick={() => updateApplication(selectedApp.id, { status: 'issued', notes: actionNote })}
                    className="bg-green-700 text-white hover:bg-green-800">
                    <Shield className="w-4 h-4 mr-1" /> Mark Issued
                  </Button>
                  <Button disabled={actionLoading} onClick={() => updateApplication(selectedApp.id, { status: 'rejected', notes: actionNote, rejectionReason: actionNote })}
                    variant="destructive">
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                  <Button disabled={actionLoading} onClick={() => updateApplication(selectedApp.id, { internal_priority: 'urgent', notes: actionNote })}
                    variant="outline" className="border-red-300 text-red-600">
                    <AlertTriangle className="w-4 h-4 mr-1" /> Flag Urgent
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l-7 3.5v5C5 15.4 8 19.8 12 21c4-1.2 7-5.6 7-10.5v-5L12 2z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
