import { SENTIMENT_THRESHOLD } from '@/constants/monitoring';
import { formatSentiment } from '@/utils/format';
import { cn } from '@/utils/cn';

interface SentimentBadgeProps {
  score: number;
  className?: string;
}

/**
 * Visual badge displaying sentiment score with color-coding based on 70% threshold.
 */
export function SentimentBadge({ score, className }: SentimentBadgeProps) {
  const isSatisfied = score >= SENTIMENT_THRESHOLD;

  return (
    <span
      data-testid="sentiment-badge"
      className={cn(
        'inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors',
        isSatisfied
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-red-50 text-red-700 border-red-200',
        className
      )}
    >
      {formatSentiment(score)}
    </span>
  );
}
