'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Search, FileText, Archive, Users, Filter, Loader2, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchResult {
  applications: Array<{
    id: string;
    tracking_number: string;
    type: string;
    status: string;
    surname: string;
    given_names: string;
    created_at: string;
    district: string;
  }>;
  archived: Array<{
    id: string;
    record_type: string;
    surname: string;
    given_names: string;
    district: string;
    community: string;
    record_year: number;
    certificate_number: string;
    is_verified: boolean;
  }>;
  users: Array<{
    id: string;
    email: string;
    full_name: string;
    role: string;
    department: string;
    district: string;
    is_active: boolean;
  }>;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query, type });
      const res = await fetch(`/api/search?${params}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [query, type]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const appCount = results?.applications?.length || 0;
  const archiveCount = results?.archived?.length || 0;
  const userCount = results?.users?.length || 0;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    issued: 'bg-green-200 text-green-900',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="border-2 border-[#009B3A]/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#009B3A]" />
              <Input
                ref={inputRef}
                placeholder="Search by name, tracking number, certificate number, district..."
                className="pl-11 h-12 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full sm:w-48 h-12"><SelectValue placeholder="Filter by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="applications">Applications</SelectItem>
                <SelectItem value="archived">Archived Records</SelectItem>
                <SelectItem value="users">Users</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="h-12 px-8 bg-[#009B3A] text-white hover:bg-[#007a2e] font-semibold" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
              Search
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Search across applications, archived records, and users. Try: &quot;Smith&quot;, &quot;BVI-2026&quot;, &quot;Tortola&quot;</p>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{total} result{total !== 1 ? 's' : ''} for &quot;{query}&quot;</p>

          {/* Applications */}
          {appCount > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: '#0C1B2A' }}>
                  <FileText className="w-4 h-4 text-[#009B3A]" />
                  Applications ({appCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.applications.map(app => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-sm">{app.surname}, {app.given_names}</p>
                          <p className="text-xs text-gray-500">{app.district || 'N/A'} &middot; {new Date(app.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#009B3A]">{app.tracking_number}</span>
                        <Badge className={`${statusColors[app.status] || 'bg-gray-100'} text-[10px]`}>{app.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Archived Records */}
          {archiveCount > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: '#0C1B2A' }}>
                  <Archive className="w-4 h-4 text-[#FFD100]" />
                  Archived Records ({archiveCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.archived.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{record.surname || 'Unknown'}, {record.given_names || ''}</p>
                        <p className="text-xs text-gray-500">
                          {record.record_type} &middot; {record.district}{record.community ? `, ${record.community}` : ''} &middot; {record.record_year || 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {record.certificate_number && <span className="text-xs font-mono text-gray-600">{record.certificate_number}</span>}
                        {record.is_verified && <Badge className="bg-green-100 text-green-800 text-[10px]">Verified</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users */}
          {userCount > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: '#0C1B2A' }}>
                  <Users className="w-4 h-4 text-blue-600" />
                  Users ({userCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email} &middot; {user.department} &middot; {user.district}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] capitalize">{user.role.replace('_', ' ')}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {total === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm">Try different keywords or remove filters</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!results && !loading && (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Universal Search</p>
          <p className="text-sm mt-1">Search across all applications, archived records, and users</p>
        </div>
      )}
    </div>
  );
}
