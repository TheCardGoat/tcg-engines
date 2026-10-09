import type { ReactNode } from "react";

export interface MatchSeriesMetaProps {
  formatLabel: string;
  gameNumber?: number;
  seriesScore?: string;
  children?: ReactNode;
}

/** Shared match metadata shown by both the post-game summary and preparation status. */
export function MatchSeriesMeta({
  formatLabel,
  gameNumber,
  seriesScore,
  children,
}: MatchSeriesMetaProps) {
  return (
    <>
      <span>{formatLabel}</span>
      {gameNumber !== undefined && <span>Game {gameNumber}</span>}
      {seriesScore !== undefined && <span>Series {seriesScore}</span>}
      {children}
    </>
  );
}
