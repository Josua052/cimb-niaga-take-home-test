import { Headphones, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar navigation component with desktop fixed view and mobile drawer.
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          data-testid="sidebar-backdrop"
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        data-testid="sidebar-container"
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-tight">
                CIMB NIAGA
              </span>
              <span className="text-xs text-slate-400 block leading-tight">
                Supervisor Portal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>

          <button
            type="button"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white shadow-sm transition-colors text-left"
          >
            <Headphones className="w-5 h-5 shrink-0" />
            <span>Call Monitoring</span>
          </button>
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/60 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-medium text-slate-300 mb-0.5">Call Monitoring v1.0</p>
            <p className="text-[11px] text-slate-500">THT-MON-US-001</p>
          </div>
        </div>
      </aside>
    </>
  );
}
