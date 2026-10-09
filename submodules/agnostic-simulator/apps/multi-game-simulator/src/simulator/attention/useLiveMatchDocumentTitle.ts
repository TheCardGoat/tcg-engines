import { useEffect } from "react";

type Owner = "self" | "opponent" | null;

export interface LiveMatchTitleState {
  readonly game: string;
  readonly turn: Owner;
  readonly priority: Owner;
  readonly finished?: boolean;
}

export function liveMatchDocumentTitle({
  game,
  turn,
  priority,
  finished,
}: LiveMatchTitleState): string {
  if (finished) return `🏁 ${game}`;
  const turnLabel = turn === "self" ? "Your turn" : turn === "opponent" ? "Opponent turn" : null;
  const attention =
    priority === "self" ? "⚡" : priority === "opponent" || turn === "opponent" ? "⏳" : "🎮";
  return `${attention} ${turnLabel ? `${turnLabel} · ` : ""}${game}`;
}

export function useLiveMatchDocumentTitle(state: LiveMatchTitleState): void {
  const title = liveMatchDocumentTitle(state);
  useEffect(() => {
    document.title = title;
  }, [title]);
}
