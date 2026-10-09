import type { FilteredMatchView } from "../../view/filter.ts";
import { canAttackRivalThisTurn, isReadyBlocker } from "./attack-readiness.ts";

/** A numerical lead only matters for pressure when our spare bodies can attack. */
export function hasReadyUnitAdvantage(view: FilteredMatchView, playerId: string): boolean {
  const ownField = view.players[playerId]?.zones.field;
  if (!Array.isArray(ownField)) return false;

  const hasPlayedProgramThisTurn =
    view.playedCardTypesThisTurn[playerId]?.includes("program") === true;
  const ownAttackers = ownField.filter((card) =>
    canAttackRivalThisTurn(card, hasPlayedProgramThisTurn),
  ).length;
  const rivalReadyBlockers = Object.entries(view.players)
    .filter(([id]) => id !== playerId)
    .reduce((count, [, player]) => {
      const field = player.zones.field;
      return count + (Array.isArray(field) ? field.filter(isReadyBlocker).length : 0);
    }, 0);
  return ownAttackers > rivalReadyBlockers;
}
