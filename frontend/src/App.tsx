/**
 * Root Application Component.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            Supervisor Call Monitoring
          </h1>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-gray-600">
            Dashboard Monitoring Panggilan siap dikembangkan.
          </p>
        </div>
      </main>
    </div>
  );
}
