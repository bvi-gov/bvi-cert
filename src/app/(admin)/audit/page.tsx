'use client';

import React, { useState, useEffect } from 'react';
import {
  ScrollText, Search, Download, RefreshCw, Loader2, Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

interface AuditEntry {
  id: string;
  action: string;
  details: string | null;
  ip_address: string | null;
  user_id: string | null;
  table_name: string | null;
  record_id: string | null;
  action_type: string | null;
  created_at: string;
}

const actionTypeColors: Record<string, string> = {
  create: 'bg-green-100 text-green-800',
  read: 'bg-blue-100 text-blue-800',
  update: 'bg-amber-100 text-amber-800',
  delete: 'bg-red-100 text-red-800',
  login: 'bg-purple-100 text-purple-800',
  logout: 'bg-gray-100 text-gray-600',
  export: 'bg-indigo-100 text-indigo-800',
  import: 'bg-teal-100 text-teal-800',
};

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const fetchAudits = () => {
    setLoading(true);
    fetch('/api/audit')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          let filtered = data.entries || [];
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter((e: AuditEntry) =>
              (e.action && e.action.toLowerCase().includes(q)) ||
              (e.details && e.details.toLowerCase().includes(q)) ||
              (e.ip_address && e.ip_address.includes(q))
            );
          }
          if (filterAction) {
            filtered = filtered.filter((e: AuditEntry) => e.action_type === filterAction);
          }
          setEntries(filtered);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    setLoading(true);
    fetch('/api/audit', { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) {
          let filtered = data.entries || [];
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter((e: AuditEntry) =>
              (e.action && e.action.toLowerCase().includes(q)) ||
              (e.details && e.details.toLowerCase().includes(q)) ||
              (e.ip_address && e.ip_address.includes(q))
            );
          }
          if (filterAction) {
            filtered = filtered.filter((e: AuditEntry) => e.action_type === filterAction);
          }
          setEntries(filtered);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [searchQuery, filterAction]);

  const exportCSV = () => {
    const csv = [
      'Date,Action,Details,IP Address,Table,Record ID,Action Type',
      ...entries.map((e) =>
        `"${new Date(e.created_at).toLocaleString()}","${e.action}","${e.details || ''}","${e.ip_address || ''}","${e.table_name || ''}","${e.record_id || ''}","${e.action_type || ''}"`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#0C1B2A]">Audit Log</h1>
          <p className="text-gray-500 text-sm">Complete trail of system actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAudits}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by action, details, IP address..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterAction} onValueChange={(v) => setFilterAction(v === 'all' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder="Filter by action type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="export">Export</SelectItem>
                <SelectItem value="import">Import</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#009B3A]" /></div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16">
              <ScrollText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No audit entries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">Details</TableHead>
                    <TableHead className="hidden lg:table-cell">Type</TableHead>
                    <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                    <TableHead className="hidden xl:table-cell">Table</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(entry.created_at)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{entry.action.replace(/_/g, ' ')}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-gray-600 max-w-[300px] truncate">
                        {entry.details || '—'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {entry.action_type && (
                          <Badge variant="outline" className={`text-[10px] ${actionTypeColors[entry.action_type] || 'bg-gray-100'}`}>
                            {entry.action_type}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-gray-500 font-mono">
                        {entry.ip_address || '—'}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-xs text-gray-500">
                        {entry.table_name || '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
