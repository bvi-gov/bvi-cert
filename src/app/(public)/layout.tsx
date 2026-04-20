import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BVI CERT — Certificate Services Portal',
  description: 'Official Certificate Services Portal of the Royal Virgin Islands Police Force, Government of the Virgin Islands.',
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {children}
    </div>
  );
}
