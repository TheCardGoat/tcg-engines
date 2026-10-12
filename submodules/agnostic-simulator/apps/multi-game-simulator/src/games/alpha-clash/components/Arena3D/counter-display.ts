/** Alpha Clash supplies the identity; the shared 3D chip supplies the motion and material. */
const appearances: Record<string, { label: string; color: string }> = {
  streak: { label: "STRK", color: "#f1c67a" },
  collection: { label: "COLL", color: "#7ed8dc" },
  toxic: { label: "TOX", color: "#ba9aef" },
  bounty: { label: "BNTY", color: "#ef9c83" },
  temper: { label: "TEMP", color: "#9fc5f0" },
  scarab: { label: "SCAR", color: "#a8d992" },
};

export function counterAppearance(kind: string) {
  return (
    appearances[kind.toLowerCase()] ?? {
      label: kind.slice(0, 4).toUpperCase(),
      color: "#d0d9df",
    }
  );
}

export function visibleCounters(counters: Readonly<Record<string, number>> | undefined) {
  return Object.entries(counters ?? {})
    .filter(([, count]) => Number.isFinite(count) && count > 0)
    .sort(([a], [b]) => a.localeCompare(b));
}

/** Rebuild the display before queued moves, then lift the active source marker. */
export function counterCountsDuringTransfers(
  cards: readonly Pick<LiveBoardCard, "instanceId" | "counters">[],
  pending: readonly CounterMove[],
) {
  const result = new Map(cards.map((card) => [card.instanceId, { ...card.counters }]));
  for (const move of pending) {
    const source = result.get(move.fromId);
    const target = result.get(move.toId);
    if (source) source[move.kind] = (source[move.kind] ?? 0) + move.amount;
    if (target) target[move.kind] = Math.max(0, (target[move.kind] ?? 0) - move.amount);
  }
  const active = pending[0];
  if (active) {
    const source = result.get(active.fromId);
    if (source) source[active.kind] = Math.max(0, (source[active.kind] ?? 0) - active.amount);
  }
  return result;
}
import type { CounterMove, LiveBoardCard } from "../board-types";
