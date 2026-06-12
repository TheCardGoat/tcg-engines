/**
 * Shared pilot-pairing helpers
 *
 * Used by:
 *   - assignPilot       — plays a Pilot card from hand onto a Unit.
 *   - playCommand (mode: "pilot") — plays a Command card with the 【Pilot】
 *     keyword as a Pilot onto a Unit (rule 3-4-6-2).
 *
 * Both moves share the same target validation (unit on battlefield, unit
 * has no existing pilot) and the same pairing execution (zone move, record
 * the assignment, fire WhenPaired triggers, emit PILOT_ASSIGNED).
 */

import type {
  MoveValidationResult,
  FrameworkReadAPI,
  FrameworkWriteAPI,
} from "../../../types/move-types.ts";
import type { Card } from "@tcg/gundam-types";
import type { GundamG, ReadonlyGundamG } from "../../types.ts";
import {
  enqueueMoveCompletionFence,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../../effects/pending-effects.ts";
import { getEffectiveStats, satisfiesLinkCondition } from "../../rules/derived-state.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";

/**
 * Validate that `unitId` can receive a pilot from `playerId`.
 *
 *   - Unit must be on the player's battlefield.
 *   - Target must be a Unit card.
 *   - Unit must not already have a pilot assigned.
 */
export function validatePilotPairingTarget(
  unitId: string,
  playerId: string,
  g: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): MoveValidationResult {
  const battlefieldCards = framework.zones.getCards({ zone: "battleArea", playerId });
  if (!battlefieldCards.includes(unitId)) {
    return {
      valid: false,
      error: "Target unit is not on the battlefield",
      errorCode: "UNIT_NOT_ON_BATTLEFIELD",
    };
  }

  const unitDef = framework.cards.getDefinition(unitId) as Card | undefined;
  if (!unitDef || unitDef.type !== "unit") {
    return { valid: false, error: "Target is not a Unit", errorCode: "NOT_A_UNIT" };
  }

  if (g.pilotAssignments[unitId]) {
    return {
      valid: false,
      error: "Unit already has a pilot assigned",
      errorCode: "UNIT_ALREADY_HAS_PILOT",
    };
  }

  if (
    getEffectiveStats(unitId, g, framework.cards, framework).restrictions.includes(
      "cannot-pair-pilot",
    )
  ) {
    return {
      valid: false,
      error: "Unit can't be paired with a Pilot",
      errorCode: "UNIT_CANNOT_PAIR_PILOT",
    };
  }

  return { valid: true };
}

/**
 * Execute a pilot pairing: move the pilot card to the battle area, record the
 * assignment on GundamG, fire any WhenPaired triggers on the unit, and emit
 * the PILOT_ASSIGNED event.
 *
 * Assumes validation has already passed.
 */
export function executePilotPairing(
  pilotCardId: string,
  unitId: string,
  playerId: string,
  g: GundamG,
  framework: FrameworkWriteAPI,
  opts: { originatingMoveId?: string } = {},
): void {
  // Move pilot card to the battle area, underneath the unit.
  framework.zones.moveCard(pilotCardId, { zone: "battleArea", playerId });

  // Record the assignment.
  g.pilotAssignments[unitId] = pilotCardId;

  // Placement event — synchronous pairing signal. PILOT_ASSIGNED fires
  // from the completion fence below, after every WhenPaired/WhenLinked
  // triggered effect has resolved.
  emitGundamEvent(framework.events, {
    kind: "PILOT_PAIRED",
    payload: { pilotId: pilotCardId, unitId, playerId },
  });
  emitGundamLog(framework, {
    type: "gundam.move.assignPilot",
    values: { pilotId: pilotCardId, unitId, playerId },
    visibility: { mode: "PUBLIC" },
    category: "action",
  });

  // Fire WhenPaired/WhenLinked triggered effects via the pending-effects queue.
  // EVENT_TIMING_MAP maps "pilotPaired" → ["whenPaired", "whenLinked"]; the
  // enqueue helper picks up matching effects on the unit. Link-sensitive
  // activation / target conditions should rely on state-derived link checks
  // (e.g. satisfiesLinkCondition via TargetResolutionContext) rather than the
  // trigger payload — buildTargetResolutionContext does not plumb the event
  // through to condition evaluation. `isLink` is retained here only as event
  // metadata for observers/logging.
  const isLink = satisfiesLinkCondition(pilotCardId, unitId, framework.cards);
  const event = {
    type: "pilotPaired",
    cardId: unitId,
    pilotId: pilotCardId,
    unitId,
    playerId,
    isLink,
  };
  // Unit-resident WhenPaired/WhenLinked triggers (text printed above the
  // unit's card name — rule 3-3-9-1 applied to units).
  enqueueOwnCardTriggers(g, event, unitId, playerId, framework, {
    originatingMoveId: opts.originatingMoveId,
  });
  // Pilot-resident WhenPaired/WhenLinked triggers (rule 3-3-9-1: any text
  // printed above a pilot's card name belongs to the pilot card, so when
  // the pilot is paired those triggered effects activate too). `isLink`
  // gating via matchesTimingForEvent continues to apply.
  enqueueOwnCardTriggers(g, event, pilotCardId, playerId, framework, {
    originatingMoveId: opts.originatingMoveId,
  });
  enqueueObserverTriggers(g, event, framework, [unitId, pilotCardId], {
    originatingMoveId: opts.originatingMoveId,
  });

  // Completion fence — PILOT_ASSIGNED fires only after every
  // WhenPaired/WhenLinked triggered effect produced above has resolved.
  enqueueMoveCompletionFence(
    g,
    playerId,
    framework,
    [
      {
        kind: "emitEvent",
        event: {
          kind: "PILOT_ASSIGNED",
          payload: { pilotId: pilotCardId, unitId, playerId },
        },
      },
    ],
    opts.originatingMoveId,
  );
}
