'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Plus, Loader2, Shield, ShieldCheck, UserCog, Eye,
  CheckCircle2, XCircle, UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

interface UserInfo {
  id: string;
  email: string;
  full_name: string;
  badge_number: string | null;
  role: string;
  department: string;
  district: string;
  phone: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const roleIcons: Record<string, React.ElementType> = {
  super_admin: Shield,
  admin: ShieldCheck,
  staff: UserCog,
  viewer: Eye,
};

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  staff: 'Staff',
  viewer: 'Viewer',
};

const roleBadgeColors: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-800',
  admin: 'bg-blue-100 text-blue-800',
  staff: 'bg-green-100 text-green-800',
  viewer: 'bg-gray-100 text-gray-800',
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ email: '', password: '', fullName: '', role: 'staff', department: 'RVIPF', district: 'Tortola' });
  const [createError, setCreateError] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleCreate = async () => {
    setCreating(true);
    setCreateError('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreate(false);
        setCreateForm({ email: '', password: '', fullName: '', role: 'staff', department: 'RVIPF', district: 'Tortola' });
        loadUsers();
      } else {
        setCreateError(data.error || 'Failed to create user.');
      }
    } catch {
      setCreateError('Network error.');
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (user: UserInfo) => {
    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, isActive: !user.is_active }),
    });
    loadUsers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#0C1B2A' }}>User Management</h2>
          <p className="text-sm text-gray-500">Manage system users and their roles</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-[#009B3A] text-white hover:bg-[#007a2e]">
          <UserPlus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(roleLabels).map(([role, label]) => {
          const Icon = roleIcons[role];
          const count = users.filter(u => u.role === role).length;
          return (
            <Card key={role} className="bg-gray-50 border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-xl font-bold" style={{ color: '#0C1B2A' }}>{count}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#009B3A]" /></div>
          ) : users.length === 0 ? (
            <p className="text-center py-12 text-gray-400">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Department</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">District</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Last Login</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const Icon = roleIcons[user.role] || Users;
                    return (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`${roleBadgeColors[user.role]} text-[10px]`}>{roleLabels[user.role]}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs">{user.department}</td>
                        <td className="px-4 py-3 text-xs">{user.district}</td>
                        <td className="px-4 py-3">
                          <Badge className={`${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-[10px]`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => toggleActive(user)}>
                            {user.is_active ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system. They will receive an account with the specified role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {createError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{createError}</p>}
            <div><Label>Full Name</Label><Input value={createForm.fullName} onChange={(e) => setCreateForm(f => ({ ...f, fullName: e.target.value }))} /></div>
            <div><Label>Email</Label><Input type="email" value={createForm.email} onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><Label>Password (min 8 characters)</Label><Input type="password" value={createForm.password} onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))} /></div>
            <div><Label>Role</Label>
              <Select value={createForm.role} onValueChange={(v) => setCreateForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Department</Label><Input value={createForm.department} onChange={(e) => setCreateForm(f => ({ ...f, department: e.target.value }))} /></div>
            <div><Label>District</Label><Input value={createForm.district} onChange={(e) => setCreateForm(f => ({ ...f, district: e.target.value }))} /></div>
            <Button onClick={handleCreate} disabled={creating || !createForm.fullName || !createForm.email || !createForm.password} className="w-full bg-[#009B3A] text-white hover:bg-[#007a2e]">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create User'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
