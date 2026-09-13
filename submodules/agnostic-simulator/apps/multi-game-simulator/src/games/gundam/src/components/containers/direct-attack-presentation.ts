import type { BoardProjection } from "../../game/types.ts";
import { mapZone, zoneCount } from "./mappers.ts";

export interface DirectAttackPresentation {
  readonly destination: "base" | "shield" | "player";
  readonly remainingShieldCount?: number;
  readonly badgeLabel: string;
  readonly actionLabel: string;
  readonly actionDetail: string;
  readonly targetDescription: string;
  readonly protectedLabel: string;
}

/** Describe the card that will receive damage after an attack on a player succeeds. */
export function projectDirectAttackPresentation(
  view: BoardProjection,
  defenderPlayerId: string,
): DirectAttackPresentation {
  const base = mapZone(view, "baseSection", defenderPlayerId)[0];
  if (base) {
    const baseName = base.definition?.name ?? "Base";
    return {
      destination: "base",
      badgeLabel: "Direct · Base",
      actionLabel: `Attack opponent directly; ${baseName} would receive damage if unblocked`,
      actionDetail: `${baseName} would receive damage if unblocked.`,
      targetDescription: `the opposing player; ${baseName} would receive damage if unblocked`,
      protectedLabel: "Base protected",
    };
  }

  const remainingShieldCount = zoneCount(view, "shieldArea", defenderPlayerId);
  if (remainingShieldCount > 0) {
    return {
      destination: "shield",
      remainingShieldCount,
      badgeLabel: "Direct · Shield",
      actionLabel: "Attack opponent directly; the top Shield would receive damage if unblocked",
      actionDetail: "The top Shield would receive damage if unblocked.",
      targetDescription: "the opposing player; the top Shield would receive damage if unblocked",
      protectedLabel: "Shield protected",
    };
  }

  return {
    destination: "player",
    badgeLabel: "Direct attack",
    actionLabel: "Attack opponent directly",
    actionDetail: "The opposing player would receive battle damage if unblocked.",
    targetDescription: "the opposing player",
    protectedLabel: "Direct attack blocked",
  };
}

/** Account for attacker keywords that change the visible result of a direct attack. */
export function projectAttackerDirectAttackPresentation(
  presentation: DirectAttackPresentation,
  attackerKeywords: readonly string[],
): DirectAttackPresentation {
  if (
    presentation.destination !== "shield" ||
    presentation.remainingShieldCount === 1 ||
    !attackerKeywords.includes("Suppression")
  ) {
    return presentation;
  }

  return {
    ...presentation,
    badgeLabel: "Direct · 2 Shields",
    actionLabel:
      "Attack opponent directly; the first 2 Shields would receive damage simultaneously if unblocked",
    actionDetail: "The first 2 Shields would receive damage simultaneously if unblocked.",
    targetDescription:
      "the opposing player; the first 2 Shields would receive damage simultaneously if unblocked",
  };
}
