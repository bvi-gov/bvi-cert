'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Upload, FileSpreadsheet, FileText, CheckCircle2, XCircle,
  Download, RefreshCw, Loader2, AlertTriangle, Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface ImportJob {
  id: string;
  filename: string;
  file_size: number;
  file_type: string;
  total_rows: number;
  imported_rows: number;
  failed_rows: number;
  skipped_rows: number;
  status: string;
  created_at: string;
  creator: { id: string; full_name: string; email: string };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [recordType, setRecordType] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; total?: number; imported?: number; failed?: number } | null>(null);
  const [history, setHistory] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/import');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.imports || []);
      }
    } catch (e) {
      console.error('Failed to load import history:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('recordType', recordType);

      const res = await fetch('/api/import', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        setResult({
          success: true,
          message: data.needsOCR ? 'File received for OCR processing.' : 'Import completed successfully.',
          total: data.total,
          imported: data.imported,
          failed: data.failed,
        });
        setFile(null);
        loadHistory();
      } else {
        setResult({ success: false, message: data.error || 'Import failed.' });
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = `record_type,record_year,district,community,surname,given_names,date_of_birth,certificate_number,event_type,notes
general,2024,Tortola,Road Town,Smith,John,1990-01-15,CERT-001,Registration,Sample record
general,2024,Virgin Gorda,Spanish Town,Doe,Jane,1985-06-20,CERT-002,Registration,Another sample`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bvi_cert_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return <Badge className={`${colors[status] || 'bg-gray-100'} text-[10px]`}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#0C1B2A' }}>
            <Upload className="w-5 h-5" /> Import Data
          </CardTitle>
          <CardDescription>Upload CSV, Excel, JSON, PDF, or Word files. Data will be organized by type, district, and year automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Record Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Record Type</label>
            <Select value={recordType} onValueChange={setRecordType}>
              <SelectTrigger className="w-full md:w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Records</SelectItem>
                <SelectItem value="birth">Birth Certificates</SelectItem>
                <SelectItem value="death">Death Certificates</SelectItem>
                <SelectItem value="marriage">Marriage Certificates</SelectItem>
                <SelectItem value="police">Police Records</SelectItem>
                <SelectItem value="immigration">Immigration Records</SelectItem>
                <SelectItem value="business">Business Licenses</SelectItem>
                <SelectItem value="firearms">Firearms Licenses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              file ? 'border-[#009B3A] bg-[#009B3A]/5' : 'border-gray-300 hover:border-[#009B3A] hover:bg-gray-50'
            }`}
            onClick={() => document.getElementById('file-input')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) setFile(f);
            }}
          >
            <input id="file-input" type="file" className="hidden" accept=".csv,.xlsx,.xls,.json,.pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {file ? (
              <div className="space-y-2">
                <FileSpreadsheet className="w-10 h-10 text-[#009B3A] mx-auto" />
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                <p className="font-medium text-gray-600">Drop your file here or click to browse</p>
                <p className="text-xs text-gray-400">Supports CSV, Excel (.xlsx), JSON, PDF, Word (.docx)</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleUpload} disabled={!file || uploading} className="bg-[#009B3A] text-white hover:bg-[#007a2e]">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
              {uploading ? 'Importing...' : 'Import Data'}
            </Button>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" /> Download Template
            </Button>
          </div>

          {/* Result */}
          {result && (
            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2">
                {result.success ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>{result.message}</p>
              </div>
              {result.success && result.total !== undefined && (
                <div className="mt-2 flex gap-4 text-sm">
                  <span className="text-green-700">Total: {result.total}</span>
                  <span className="text-green-700">Imported: {result.imported}</span>
                  {result.failed > 0 && <span className="text-red-600">Failed: {result.failed}</span>}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supported Formats Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[#009B3A]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-[#009B3A]" />
              <h3 className="font-semibold text-sm">CSV / Excel</h3>
            </div>
            <p className="text-xs text-gray-500">Structured data with column mapping. Best for large datasets. Supports .csv, .xlsx, .xls files.</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#FFD100]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-[#b89500]" />
              <h3 className="font-semibold text-sm">PDF / Word</h3>
            </div>
            <p className="text-xs text-gray-500">Scanned documents and digital forms. Uploaded for OCR processing and data extraction.</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#0C1B2A]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-[#0C1B2A]" />
              <h3 className="font-semibold text-sm">Auto-Organize</h3>
            </div>
            <p className="text-xs text-gray-500">Records are automatically organized by type, year, district, and community for easy retrieval.</p>
          </CardContent>
        </Card>
      </div>

      {/* Import History */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base" style={{ color: '#0C1B2A' }}>Import History</CardTitle>
            <Button variant="ghost" size="sm" onClick={loadHistory}><RefreshCw className="w-4 h-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#009B3A]" /></div>
          ) : history.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">No import history yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">File</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Status</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Rows</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Imported</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Failed</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(job => (
                    <tr key={job.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{job.filename}</p>
                            <p className="text-[10px] text-gray-400">{formatFileSize(job.file_size)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">{statusBadge(job.status)}</td>
                      <td className="px-3 py-2">{job.total_rows}</td>
                      <td className="px-3 py-2 text-green-600 font-medium">{job.imported_rows}</td>
                      <td className="px-3 py-2">{job.failed_rows > 0 ? <span className="text-red-600">{job.failed_rows}</span> : '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{new Date(job.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
