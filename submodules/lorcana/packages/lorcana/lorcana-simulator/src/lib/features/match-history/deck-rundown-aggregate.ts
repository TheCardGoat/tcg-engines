import type { MatchGameSummary, MatchSummary } from "./types";
import { getActiveInks } from "./ui/color-mask";

export type OpponentKey = number | "unknown";

export type OpponentRow = {
  key: OpponentKey;
  opponentMask: number | null;
  label: string;
  matchCount: number;
  matchWins: number;
  matchWinRate: number | null;
  gamesTotal: number;
  otpPlayed: number;
  otpWins: number;
  otpRate: number | null;
  otdPlayed: number;
  otdWins: number;
  otdRate: number | null;
  isMirror: boolean;
  contribution: number;
};

export type DeckOption = {
  mask: number;
  deckListId: string | null;
  label: string;
  matchCount: number;
};

export type SortMode = "contribution" | "winRate";

export type DeckAggregateResult = {
  global: { matchWins: number; matchTotal: number; onPlayWins: number; onPlayN: number };
  rows: OpponentRow[];
};

export function isValidDeckMask(mask: number | null): mask is number {
  return mask !== null && mask !== 0 && getActiveInks(mask).length > 0;
}

export function isPlayerWinGame(game: MatchGameSummary): boolean {
  return (
    (game.result === "seat1_win" && game.playerSeat === 1) ||
    (game.result === "seat2_win" && game.playerSeat === 2)
  );
}

export function getDeckOptions(matches: MatchSummary[]): DeckOption[] {
  const counts: Record<
    string,
    { mask: number; deckListId: string | null; name: string | null; count: number }
  > = {};
  for (const m of matches) {
    if (!isValidDeckMask(m.playerDeckColorMask)) continue;
    const key = m.playerDeckListId ?? `mask:${m.playerDeckColorMask}`;
    const existing = counts[key];
    if (existing) {
      existing.count++;
      if (!existing.name && m.playerDeckName) existing.name = m.playerDeckName;
    } else {
      counts[key] = {
        mask: m.playerDeckColorMask,
        deckListId: m.playerDeckListId,
        name: m.playerDeckName ?? null,
        count: 1,
      };
    }
  }
  return Object.values(counts)
    .map((data) => ({
      mask: data.mask,
      deckListId: data.deckListId,
      label: data.name ?? "Unknown",
      matchCount: data.count,
    }))
    .sort((a, b) => b.matchCount - a.matchCount || a.mask - b.mask);
}

export function aggregateForDeck(
  deckMask: number,
  relevant: MatchSummary[],
  mode: SortMode,
): DeckAggregateResult {
  const buckets: Record<string, MatchSummary[]> = {};
  for (const m of relevant) {
    const sk =
      m.opponentDeckColorMask !== null && m.opponentDeckColorMask !== 0
        ? String(m.opponentDeckColorMask)
        : "unknown";
    const arr = buckets[sk];
    if (arr) arr.push(m);
    else buckets[sk] = [m];
  }

  let gWins = 0;
  let gMatches = 0;
  let onPlayWins = 0;
  let onPlayN = 0;

  for (const m of relevant) {
    gMatches++;
    if (m.result === "win") gWins++;
    for (const g of m.games) {
      if (g.onThePlaySeat === null) continue;
      if (g.onThePlaySeat === g.playerSeat) {
        onPlayN++;
        if (isPlayerWinGame(g)) onPlayWins++;
      }
    }
  }

  const rows: OpponentRow[] = [];

  for (const sk of Object.keys(buckets)) {
    const bucket = buckets[sk];
    if (!bucket) continue;
    const key: OpponentKey = sk === "unknown" ? "unknown" : Number(sk);
    const opponentMask = key === "unknown" ? null : key;
    let matchCount = 0;
    let matchWins = 0;
    let gamesTotal = 0;
    let otpPlayed = 0;
    let otpWins = 0;
    let otdPlayed = 0;
    let otdWins = 0;

    for (const m of bucket) {
      matchCount++;
      if (m.result === "win") matchWins++;
      gamesTotal += m.games.length;

      for (const g of m.games) {
        if (g.onThePlaySeat === null) continue;

        const onPlay = g.onThePlaySeat === g.playerSeat;
        if (onPlay) {
          otpPlayed++;
          if (isPlayerWinGame(g)) otpWins++;
        } else {
          otdPlayed++;
          if (isPlayerWinGame(g)) otdWins++;
        }
      }
    }

    const matchWinRate = matchCount > 0 ? (matchWins / matchCount) * 100 : null;
    const otpRate = otpPlayed > 0 ? (otpWins / otpPlayed) * 100 : null;
    const otdRate = otdPlayed > 0 ? (otdWins / otdPlayed) * 100 : null;

    const inks = opponentMask !== null ? getActiveInks(opponentMask) : [];
    const label = inks.length > 0 ? inks.map((ink) => INK_LABELS[ink] ?? ink).join("/") : "Unknown";

    const isMirror =
      opponentMask !== null && isValidDeckMask(opponentMask) && opponentMask === deckMask;

    rows.push({
      key,
      opponentMask,
      label,
      matchCount,
      matchWins,
      matchWinRate,
      gamesTotal,
      otpPlayed,
      otpWins,
      otpRate,
      otdPlayed,
      otdWins,
      otdRate,
      isMirror,
      contribution: gamesTotal,
    });
  }

  const sorted = [...rows].sort((a, b) => {
    if (mode === "contribution") {
      if (b.contribution !== a.contribution) return b.contribution - a.contribution;
    } else {
      const ar = a.matchWinRate ?? -1;
      const br = b.matchWinRate ?? -1;
      if (br !== ar) return br - ar;
    }
    const la = a.label.toLowerCase();
    const lb = b.label.toLowerCase();
    if (la !== lb) return la.localeCompare(lb);
    return String(a.key).localeCompare(String(b.key));
  });

  return {
    global: {
      matchWins: gWins,
      matchTotal: gMatches,
      onPlayWins,
      onPlayN,
    },
    rows: sorted,
  };
}

export type TrendDirection = "up" | "down" | "stable";

export type DeckTrend = {
  direction: TrendDirection;
  delta: number;
  recentWinRate: number;
  priorWinRate: number;
};

export function computeTrend(
  matches: MatchSummary[],
  deckMask: number,
  windowSize: number,
): DeckTrend | null {
  const relevant = matches.filter((m) => m.playerDeckColorMask === deckMask);
  if (relevant.length < windowSize * 2) return null;

  const recentSlice = relevant.slice(0, windowSize);
  const priorSlice = relevant.slice(windowSize, windowSize * 2);

  let recentWins = 0;
  let priorWins = 0;

  for (const m of recentSlice) {
    if (m.result === "win") recentWins++;
  }
  for (const m of priorSlice) {
    if (m.result === "win") priorWins++;
  }

  const recentRate = (recentWins / windowSize) * 100;
  const priorRate = (priorWins / windowSize) * 100;
  const delta = recentRate - priorRate;

  let direction: TrendDirection;
  if (delta > 0.5) direction = "up";
  else if (delta < -0.5) direction = "down";
  else direction = "stable";

  return { direction, delta, recentWinRate: recentRate, priorWinRate: priorRate };
}

const INK_LABELS: Record<number, string> = {
  1: "Amber",
  2: "Amethyst",
  4: "Emerald",
  8: "Ruby",
  16: "Sapphire",
  32: "Steel",
};
