import { Menu, User, Database } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

/**
 * Top navbar header component displaying page title and supervisor status.
 */
export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-xs border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 active:scale-95 transition-all cursor-pointer"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
            Call Monitoring
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block leading-tight mt-0.5">
            Dashboard Sentimen Panggilan Nasabah
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* PostgreSQL Database Indicator Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-2xs">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>PostgreSQL Active</span>
        </div>

        {/* Supervisor User Indicator (Read-Only) */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 sm:border-l sm:border-gray-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-gray-800 block leading-tight">
              Supervisor
            </span>
            <span className="text-[11px] text-gray-500 block leading-tight mt-0.5 font-medium">
              Call Center Unit
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
