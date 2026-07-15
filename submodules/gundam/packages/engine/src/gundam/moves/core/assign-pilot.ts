/**
 * Assign Pilot Move
 *
 * Plays a Pilot card from hand and pairs it with a Unit on the battlefield.
 * Rules 7-5-2-1: pair a Pilot by paying its cost.
 * Rules 3-3-1: Pilot cards are placed beneath Units in the battle area.
 * Rules 3-3-4: A Unit can only have at most one Pilot paired with it.
 * Rules 3-3-5: You cannot freely remove or exchange a paired Pilot.
 */

import type { Card } from "@tcg/gundam-types";
import type { GundamMoveDefinition } from "../../types.ts";
import { validatePlayFromHand, payCardCost } from "./play-card-shared.ts";
import { validatePilotPairingTarget, executePilotPairing } from "./pilot-pairing.ts";
import { computeEffectivePilotPairingCost } from "../../rules/derived-state.ts";

export const assignPilot: GundamMoveDefinition<"assignPilot"> = {
  gatedByPendingEffects: true,

  describeProcedure({ G, playerId, partialInput, framework }) {
    const g = G;
    const pilotId = (partialInput as { pilotId?: string }).pilotId;
    if (!pilotId) return [];
    if ((partialInput as { unitId?: string }).unitId) return [];

    const battlefield = framework.zones.getCards({ zone: "battleArea", playerId });
    const candidateIds = battlefield.filter((unitId) => {
      const def = framework.cards.getDefinition(unitId) as Card | undefined;
      if (!def || def.type !== "unit") return false;
      const targetResult = validatePilotPairingTarget(unitId, playerId, g, framework);
      if (!targetResult.valid) return false;
      const costOverride = computeEffectivePilotPairingCost(
        pilotId,
        unitId,
        playerId,
        g,
        framework,
      );
      return validatePlayFromHand(pilotId, playerId, g, framework, { costOverride }).valid;
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
    const assignedPilots = new Set(Object.values(g.pilotAssignments));
    const battlefieldUnitIds = framework.zones.getCards({ zone: "battleArea", playerId });
    const handIds = framework.zones.getCards({ zone: "hand", playerId });
    const out: string[] = [];
    for (const pilotId of handIds) {
      if (assignedPilots.has(pilotId)) continue;
      const def = framework.cards.getDefinition(pilotId) as Card | undefined;
      if (!def || def.type !== "pilot") continue;
      const hasAffordableTarget = battlefieldUnitIds.some((unitId) => {
        const targetResult = validatePilotPairingTarget(unitId, playerId, g, framework);
        if (!targetResult.valid) return false;
        const costOverride = computeEffectivePilotPairingCost(
          pilotId,
          unitId,
          playerId,
          g,
          framework,
        );
        return validatePlayFromHand(pilotId, playerId, g, framework, { costOverride }).valid;
      });
      if (hasAffordableTarget) out.push(pilotId);
    }
    return out;
  },

  validate({ G, playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };
    const g = G;
    const { pilotId, unitId } = args;

    if (framework.state.status.phase !== "main-phase") {
      return {
        valid: false,
        error: "Can only assign pilots during the main phase",
        errorCode: "WRONG_PHASE",
      };
    }

    const pilotDef = framework.cards.getDefinition(pilotId) as Card | undefined;
    if (!pilotDef || pilotDef.type !== "pilot") {
      return { valid: false, error: "Card is not a Pilot", errorCode: "NOT_A_PILOT" };
    }

    // Target-unit validation: on battlefield, is a Unit, no existing pilot
    const targetResult = validatePilotPairingTarget(unitId, playerId, g, framework);
    if (!targetResult.valid) return targetResult;

    // Common validation: card in hand, level requirement, context-sensitive cost check.
    const costOverride = computeEffectivePilotPairingCost(pilotId, unitId, playerId, g, framework);
    const commonResult = validatePlayFromHand(pilotId, playerId, g, framework, { costOverride });
    if (!commonResult.valid) return commonResult;

    // This pilot must not already be assigned to another unit
    const assignedPilots = Object.values(g.pilotAssignments);
    if (assignedPilots.includes(pilotId)) {
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
    const { pilotId, unitId } = args;

    // Pay cost (rule 7-5-2-2-3)
    const costOverride = computeEffectivePilotPairingCost(pilotId, unitId, playerId, g, framework);
    payCardCost(pilotId, playerId, g, framework, { costOverride });

    // Perform the pairing: move to battleArea, record assignment, fire
    // WhenPaired triggers, emit PILOT_ASSIGNED.
    executePilotPairing(pilotId, unitId, playerId, g, framework, { originatingMoveId: moveId });
  },
};
