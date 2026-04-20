'use client';

import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield, LayoutDashboard, TowerControl, FileText, Upload, Search,
  Users, ScrollText, Settings, LogOut, Menu, X, ChevronDown,
  Bell, Home, AlertTriangle, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
  badge?: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'staff', 'viewer'] },
  { href: '/control-tower', label: 'Control Tower', icon: TowerControl, roles: ['super_admin', 'admin', 'staff'], badge: 'Pending' },
  { href: '/certificates', label: 'Certificates', icon: FileText, roles: ['super_admin', 'admin', 'staff', 'viewer'] },
  { href: '/import', label: 'Import Data', icon: Upload, roles: ['super_admin', 'admin'] },
  { href: '/search', label: 'Universal Search', icon: Search, roles: ['super_admin', 'admin', 'staff', 'viewer'] },
  { href: '/users', label: 'User Management', icon: Users, roles: ['super_admin', 'admin'] },
  { href: '/audit', label: 'Audit Log', icon: ScrollText, roles: ['super_admin', 'admin'] },
];

function PoliceBadge({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 2L4 14v16c0 14.4 11.8 27.8 28 32 16.2-4.2 28-17.6 28-32V14L32 2z" fill="#009B3A" stroke="#FFD100" strokeWidth="2" />
      <path d="M32 8L10 18v12c0 12.2 9.4 23.4 22 27 12.6-3.6 22-14.8 22-27V18L32 8z" fill="#0C1B2A" />
      <path d="M26 36l-6-6 2-2 4 4 10-10 2 2-12 12z" fill="#FFD100" />
    </svg>
  );
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = { super_admin: 'Administrator', admin: 'Administrator', staff: 'Staff', viewer: 'Viewer' };
  return labels[role] || role;
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string; role: string } | null>(null);
  const [notifications, setNotifications] = useState<number>(0);

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(data => {
      if (data.authenticated) {
        setUser(data.user);
        // Load notification count
        fetch('/api/notifications').then(r => r.json()).then(n => {
          if (n.success) setNotifications(n.unreadCount || 0);
        }).catch(() => {});
      }
      else router.push('/login');
    }).catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));
  const currentNav = filteredNav.find(item => pathname.startsWith(item.href));

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0C1B2A' }}>
        <svg className="animate-spin h-8 w-8 text-[#009B3A]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 w-64 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ backgroundColor: '#0C1B2A' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <PoliceBadge size={36} />
          <div className="min-w-0">
            <h1 className="text-white font-bold text-base">BVI Cert</h1>
            <p className="text-gray-400 text-[10px]">Control Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-400 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredNav.map(item => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#009B3A] text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0">{item.badge}</Badge>
                )}
              </Link>
            );
          })}

          <Separator className="my-4 bg-white/10" />

          {/* Public portal link */}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Public Portal</span>
          </Link>
        </nav>

        {/* User info at bottom */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 bg-[#009B3A]">
              <AvatarFallback className="text-white text-xs">{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">{user.fullName}</p>
              <p className="text-gray-400 text-[10px] truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-base font-semibold" style={{ color: '#0C1B2A' }}>
                  {currentNav?.label || 'Dashboard'}
                </h2>
                <p className="text-xs text-gray-500">Royal Virgin Islands Police Force</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="px-3 py-2 font-semibold text-sm">Notifications</div>
                  <DropdownMenuSeparator />
                  <div className="px-3 py-4 text-center text-sm text-gray-500">No new notifications</div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="w-7 h-7 bg-[#009B3A]">
                      <AvatarFallback className="text-white text-[10px]">{getInitials(user.fullName)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:block">{user.fullName}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <Badge variant="outline" className="mt-1 text-[10px]">{getRoleLabel(user.role)}</Badge>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">{children}</main>
        <Toaster position="top-right" richColors closeButton />
      </div>
    </div>
  );
}
