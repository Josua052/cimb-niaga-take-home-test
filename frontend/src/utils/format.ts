/**
 * Formats an ISO date string into ID locale (DD/MM/YYYY HH:mm).
 */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a sentiment numeric score into percentage string.
 */
export function formatSentiment(score: number): string {
  return `${score}%`;
}
