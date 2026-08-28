import { AppLayout } from '@/components/layout/AppLayout';
import { Activity } from 'lucide-react';

/**
 * Main Monitoring Page orchestrator wrapped in AppLayout.
 */
export function MonitoringPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Title & Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Supervisor Dashboard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Monitoring Sentimen Panggilan
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pantau performa layanan dan kepuasan nasabah dari seluruh interaksi Customer Service.
            </p>
          </div>
        </div>

        {/* Monitoring Content Container */}
        <section
          data-testid="monitoring-content-container"
          className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-6 space-y-6"
        >
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Daftar Rekaman Monitoring
            </h3>
            <p className="text-xs text-gray-500">
              Menampilkan data panggilan nasabah berdasarkan periode, kata kunci, dan skor sentimen.
            </p>
          </div>

          {/* Placeholder for FilterToolbar, Table, and Pagination in FE-05 - FE-08 */}
          <div className="min-h-[240px] flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
            <div className="max-w-sm">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Area Tabel & Filter Monitoring
              </p>
              <p className="text-xs text-gray-400">
                Komponen FilterToolbar, CallMonitoringTable, dan Pagination akan dirakit pada tahapan berikutnya.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
