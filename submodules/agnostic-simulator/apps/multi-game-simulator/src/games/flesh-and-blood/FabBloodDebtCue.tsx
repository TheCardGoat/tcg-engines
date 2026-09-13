import { Skull } from "lucide-react";

import type { FabCardMetadata } from "./projection";
import type { FabPresentationCard } from "./state";

interface BloodDebtSeat {
  readonly playerId: string;
  readonly zones: Record<string, string[]>;
  readonly cardsById: Readonly<Record<string, FabPresentationCard>>;
}

/** CR 8.3.11a: only public Blood Debt cards in banished are part of the total. */
export function countPublicBloodDebt(
  seat: BloodDebtSeat,
  cardMetadata?: ReadonlyMap<string, FabCardMetadata>,
): number {
  return (seat.zones.banished ?? []).filter((id) => {
    const card = seat.cardsById[id];
    return card?.face === "up" && cardMetadata?.get(id)?.isBloodDebt === true;
  }).length;
}

export function FabBloodDebtCue({
  count,
  ownerLabel,
  density = "desktop",
}: {
  readonly count: number;
  readonly ownerLabel: "Your" | "Opponent";
  readonly density?: "desktop" | "mobile";
}) {
  if (count === 0) return null;

  const cardNoun = count === 1 ? "card" : "cards";
  return (
    <span
      className="fab-blood-debt-cue"
      data-density={density}
      data-testid="fab-blood-debt-cue"
      aria-label={`${ownerLabel} Blood Debt total: ${count} public ${cardNoun} in banished. Each triggers at the beginning of that player's end phase.`}
    >
      <Skull size={density === "mobile" ? 11 : 12} strokeWidth={2.2} aria-hidden="true" />
      <span>{density === "mobile" ? "Debt" : "Blood Debt"}</span>
      <strong>{count}</strong>
    </span>
  );
}
