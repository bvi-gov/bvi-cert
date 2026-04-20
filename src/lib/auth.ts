import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'bvi-cert-secret-change-in-production-2026'
);

const COOKIE_NAME = 'bvi_cert_session';

// ---- Password Hashing ----
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ---- JWT Token ----
export async function createToken(payload: {
  userId: string;
  email: string;
  role: string;
  fullName: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{
  userId: string;
  email: string;
  role: string;
  fullName: string;
} | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as {
      userId: string;
      email: string;
      role: string;
      fullName: string;
    };
  } catch {
    return null;
  }
}

// ---- Session Helpers ----
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60, // 8 hours
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ---- Role Checks ----
type UserRole = 'super_admin' | 'admin' | 'staff' | 'viewer';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 4,
  admin: 3,
  staff: 2,
  viewer: 1,
};

export function hasMinimumRole(userRole: string, minimumRole: UserRole): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as UserRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
  return userLevel >= requiredLevel;
}

export function isSuperAdmin(role: string): boolean {
  return role === 'super_admin';
}

export function isAdmin(role: string): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function canApprove(role: string): boolean {
  return role === 'admin' || role === 'super_admin' || role === 'staff';
}

export function canImport(role: string): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function canManageUsers(role: string): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function canBulkAction(role: string): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function canExport(role: string): boolean {
  return role === 'admin' || role === 'super_admin' || role === 'staff';
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: 'Super Administrator',
    admin: 'Administrator',
    staff: 'Staff',
    viewer: 'Viewer',
  };
  return labels[role] || role;
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-800',
    admin: 'bg-blue-100 text-blue-800',
    staff: 'bg-green-100 text-green-800',
    viewer: 'bg-gray-100 text-gray-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
}

export const COOKIE_NAME_SESSION = COOKIE_NAME;
