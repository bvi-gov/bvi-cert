import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {children}
      {/* Footer */}
      <footer className="mt-auto" style={{ backgroundColor: '#0C1B2A' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 text-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">BVI Cert</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Official online portal for Police Certificate and Character
                Certificate applications in the British Virgin Islands.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/certificates" className="text-gray-400 hover:text-[#FFD100] transition-colors">
                    Certificate Types
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-[#FFD100] transition-colors">
                    Staff Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Contact</h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>Road Town Police Station, Tortola, BVI</li>
                <li>+1 (284) 468-3701</li>
                <li>certificates@rvipf.gov.vg</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-[10px] text-gray-500">
            &copy; {new Date().getFullYear()} Royal Virgin Islands Police Force. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
