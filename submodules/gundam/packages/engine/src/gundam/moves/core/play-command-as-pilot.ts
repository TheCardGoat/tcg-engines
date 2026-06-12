/**
 * Play Command as Pilot Move
 *
 * Plays a Command card with a printed 【Pilot】[Name] mode (rule 3-4-6) as a Pilot
 * instead of activating its command effect (rule 3-4-6-2). The card is
 * paired beneath a friendly Unit and follows Pilot rules (rule 3-4-6-4 →
 * 3-3.*).
 *
 * Rules enforced here:
 *   - 3-3-3 / 3-3-4 / 3-4-6-4: pair must target a Unit with no existing pilot.
 *   - 3-4-6-1: only Command cards with a `pilotName` can be played this way.
 *   - 7-5-2-2-3: pay the card's cost.
 *
 * Pair-execution (zone move, assignment, WhenPaired triggers, PILOT_ASSIGNED
 * event, log) is delegated to `executePilotPairing` so this move stays
 * structurally identical to `assignPilot` except for the card-type guard.
 *
 * Phase gating mirrors `assignPilot`: pairing is a main-phase action only.
 * The command effect path (`playCommand`) is what's allowed during the
 * action step — that's the rule-3-4-5 timing gate. Same card, two moves,
 * different phase windows. The UI dispatcher decides which is meaningful
 * given the current state.
 */

import type { Card } from "@tcg/gundam-types";
import type { GundamMoveDefinition } from "../../types.ts";
import { validatePlayFromHand, payCardCost } from "./play-card-shared.ts";
import { validatePilotPairingTarget, executePilotPairing } from "./pilot-pairing.ts";

export const playCommandAsPilot: GundamMoveDefinition<"playCommandAsPilot"> = {
  gatedByPendingEffects: true,

  describeProcedure({ G, playerId, partialInput, framework }) {
    const g = G;
    const cardId = (partialInput as { cardId?: string }).cardId;
    if (!cardId) return [];
    if ((partialInput as { unitId?: string }).unitId) return [];

    const battlefield = framework.zones.getCards({ zone: "battleArea", playerId });
    const candidateIds = battlefield.filter((unitId) => {
      const def = framework.cards.getDefinition(unitId) as Card | undefined;
      if (!def || def.type !== "unit") return false;
      return !(unitId in g.pilotAssignments);
    });
    return [
      {
        kind: "selectTarget",
        role: "unit",
        candidateIds,
        minTargets: 1,
        maxTargets: 1,
      },
    ];
  },

  enumerateCandidates({ G, playerId, framework }) {
    if (framework.state.status.phase !== "main-phase") return [];
    const g = G;
    const battlefieldUnitIds = framework.zones.getCards({ zone: "battleArea", playerId });
    const hasPairableUnit = battlefieldUnitIds.some((unitId) => {
      const def = framework.cards.getDefinition(unitId) as Card | undefined;
      if (!def || def.type !== "unit") return false;
      return !(unitId in g.pilotAssignments);
    });
    if (!hasPairableUnit) return [];

    // Defensive: a card whose instance is already assigned as a pilot
    // on some unit shouldn't re-enumerate even if it somehow re-enters
    // the hand without the assignment being cleared. Mirrors the
    // `assignedPilots` filter in `assignPilot.enumerateCandidates`.
    const assignedPilotIds = new Set(Object.values(g.pilotAssignments));
    const handIds = framework.zones.getCards({ zone: "hand", playerId });
    const out: string[] = [];
    for (const cardId of handIds) {
      if (assignedPilotIds.has(cardId)) continue;
      const def = framework.cards.getDefinition(cardId) as Card | undefined;
      if (!def || def.type !== "command" || def.pilotName === undefined) continue;
      const check = validatePlayFromHand(cardId, playerId, g, framework);
      if (check.valid) out.push(cardId);
    }
    return out;
  },

  validate({ G, playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };
    const g = G;
    const { cardId, unitId } = args;

    if (framework.state.status.phase !== "main-phase") {
      return {
        valid: false,
        error: "Can only pair a Command-as-Pilot during the main phase",
        errorCode: "WRONG_PHASE",
      };
    }

    const definition = framework.cards.getDefinition(cardId) as Card | undefined;
    if (!definition || definition.type !== "command") {
      return { valid: false, error: "Card is not a Command", errorCode: "NOT_A_COMMAND" };
    }
    if (definition.pilotName === undefined) {
      return {
        valid: false,
        error: "Command does not have a 【Pilot】 effect",
        errorCode: "NO_PILOT_KEYWORD",
      };
    }

    const commonResult = validatePlayFromHand(cardId, playerId, g, framework);
    if (!commonResult.valid) return commonResult;

    const targetResult = validatePilotPairingTarget(unitId, playerId, g, framework);
    if (!targetResult.valid) return targetResult;

    // Mirror `assignPilot.validate`: a card whose instance is already
    // assigned as a pilot on some unit cannot be paired again even if
    // it has somehow re-entered the hand. Defensive against unusual
    // states (e.g. zone shuffles that don't clear `pilotAssignments`).
    const assignedPilotIds = Object.values(g.pilotAssignments);
    if (assignedPilotIds.includes(cardId)) {
      return {
        valid: false,
        error: "Pilot is already assigned to another unit",
        errorCode: "PILOT_ALREADY_ASSIGNED",
      };
    }

    return { valid: true };
  },

  execute({ G, playerId, args, moveId, framework }) {
    const g = G;
    const { cardId, unitId } = args;

    payCardCost(cardId, playerId, g, framework);
    executePilotPairing(cardId, unitId, playerId, g, framework, { originatingMoveId: moveId });
  },
};
