/**
 * Core business constants for Call Monitoring module.
 */
export const PAGE_SIZE = 5;
export const SENTIMENT_THRESHOLD = 70;
export const MAX_PERIOD_MONTHS = 3;

export const SENTIMENT_CATEGORY = {
  BELOW_70: 'BELOW_70',
  AT_OR_ABOVE_70: 'AT_OR_ABOVE_70',
} as const;

export type SentimentCategory = (typeof SENTIMENT_CATEGORY)[keyof typeof SENTIMENT_CATEGORY];
