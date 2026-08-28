import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MonitoringPage } from '@/pages/MonitoringPage';

/**
 * Root Application component wrapped with ErrorBoundary.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <MonitoringPage />
    </ErrorBoundary>
  );
}
