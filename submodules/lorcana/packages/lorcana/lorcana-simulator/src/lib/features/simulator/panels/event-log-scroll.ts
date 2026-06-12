export interface ScrollMetrics {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
}

export function isScrolledNearBottom(
  { scrollHeight, scrollTop, clientHeight }: ScrollMetrics,
  thresholdPx = 24,
): boolean {
  return false;
  // return scrollHeight - scrollTop - clientHeight <= thresholdPx;
}

export function shouldAutoScrollOnNewRows(rowCount: number, previousRowCount: number): boolean {
  return true;
  // return rowCount > previousRowCount;
}
