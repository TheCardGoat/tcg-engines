/**
 * Declare Block Move
 *
 * Used during the battle-phase block step by the standby player to activate
 * a friendly unit's <Blocker> keyword and redirect the attack to that unit.
 * Rules 8-3 (Block Step), 13-1-4 (Blocker).
 */

import type { Card } from "@tcg/gundam-types";
import type { GundamMoveDefinition } from "../../types.ts";
import {
  drainPendingEffects,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../../effects/pending-effects.ts";
import { canBlock, hasKeyword } from "../../rules/derived-state.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";
import { rejectWithKey } from "./validation-error.ts";

export const declareBlock: GundamMoveDefinition<"declareBlock"> = {
  enumerateCandidates({ G, playerId, framework }) {
    if (framework.state.status.phase !== "battle-phase") return [];
    if (framework.state.status.step !== "block-step") return [];
    const g = G;
    const combat = g.turnMetadata.pendingCombat;
    if (!combat || combat.stage !== "block-step") return [];
    if (playerId === combat.attackerPlayerId) return [];
    const myField = framework.zones.getCards({ zone: "battleArea", playerId });
    const out: string[] = [];
    for (const unitId of myField) {
      const def = framework.cards.getDefinition(unitId) as Card | undefined;
      if (!def || def.type !== "unit") continue;
      if (!canBlock(unitId, g, framework.cards)) continue;
      out.push(unitId);
    }
    return out;
  },

  validate({ G, playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };
    const g = G;
    const { blockerId } = args;

    if (framework.state.status.phase !== "battle-phase") {
      return { valid: false, error: "Not in battle phase", errorCode: "WRONG_PHASE" };
    }
    if (framework.state.status.step !== "block-step") {
      return { valid: false, error: "Not in block step", errorCode: "WRONG_STEP" };
    }

    const combat = g.turnMetadata.pendingCombat;
    if (!combat) {
      return { valid: false, error: "No pending attack to block", errorCode: "NO_PENDING_ATTACK" };
    }
    if (combat.stage !== "block-step") {
      return { valid: false, error: "Not in the blocker window", errorCode: "WRONG_PHASE" };
    }

    if (playerId === combat.attackerPlayerId) {
      return {
        valid: false,
        error: "Attacker cannot declare a blocker",
        errorCode: "CANNOT_BLOCK_OWN_ATTACK",
      };
    }

    const myField = framework.zones.getCards({ zone: "battleArea", playerId });
    if (!myField.includes(blockerId)) {
      return {
        valid: false,
        error: "Blocker not on your battlefield",
        errorCode: "INVALID_BLOCKER",
      };
    }

    const blockerDef = framework.cards.getDefinition(blockerId) as Card | undefined;
    if (blockerDef?.type !== "unit") {
      return { valid: false, error: "Only units can block", errorCode: "NOT_A_UNIT" };
    }

    if (!canBlock(blockerId, g, framework.cards)) {
      return { valid: false, error: "This unit cannot block", errorCode: "CANNOT_BLOCK" };
    }

    // Rule 8-3-3: a Unit originally targeted for attack cannot activate
    // its own <Blocker> effect.
    if (combat.target !== "direct" && blockerId === combat.target) {
      return {
        valid: false,
        error: "The targeted unit cannot block its own attacker",
        errorCode: "BLOCKER_IS_TARGET",
      };
    }

    // Rule 13-1-6: <High-Maneuver> cannot be blocked.
    if (hasKeyword(combat.attackerId, "HighManeuver", g, framework.cards, framework)) {
      return rejectWithKey(
        "gundam.error.block.cannotBlockHighManeuver",
        {},
        "CANNOT_BLOCK_HIGH_MANEUVER",
      );
    }

    // Compute once and reuse across the direct-attack branch and the
    // general Rule 13-1-4 check below. `hasKeyword` aggregates temporary
    // grants from continuous effects, so units with a granted <Blocker>
    // (e.g. "This unit gains <Blocker>" while condition holds) satisfy
    // these checks.
    const hasBlocker = hasKeyword(blockerId, "Blocker", g, framework.cards, framework);

    // Direct attacks can only be blocked by a unit with the Blocker keyword.
    // Kept as a specific branch (in addition to the general check below) so
    // the direct-attack failure mode surfaces its distinct error code.
    if (combat.target === "direct" && !hasBlocker) {
      return {
        valid: false,
        error: "Only a unit with Blocker can intercept a direct attack",
        errorCode: "CANNOT_BLOCK_DIRECT",
      };
    }

    // Rule 13-1-4: only a unit with the <Blocker> keyword can intercept an
    // attack. Precedence: the more specific CANNOT_BLOCK_DIRECT branch
    // above runs first for direct-attack cases; this general check catches
    // unit-vs-unit attacks.
    if (!hasBlocker) {
      return {
        valid: false,
        error: "Only a unit with <Blocker> can intercept an attack",
        errorCode: "MISSING_BLOCKER_KEYWORD",
      };
    }

    return { valid: true };
  },

  execute({ G, playerId, args, moveId, cards, framework }) {
    const g = G;
    const { blockerId } = args;

    // validate() rejects the move unless pendingCombat is populated, so
    // the non-null assertion below is safe.
    const combat = g.turnMetadata.pendingCombat!;
    combat.blockerId = blockerId;
    combat.blockerPlayerId = playerId;
    // Leaving stage !== "block-step" lets block-step.endIf fire so the
    // flow advances into action-step. battleActionStepOnEnter owns
    // seeding activePlayer + pendingDecision for rule 8-4-1 (standby
    // first, then the attacker), so we don't touch it here.
    combat.stage = "blocker-declared";

    emitGundamEvent(framework.events, {
      kind: "BLOCK_DECLARED",
      payload: { blockerId, blockerPlayerId: playerId },
    });
    emitGundamLog(framework, {
      type: "gundam.move.blockDeclared",
      values: { blockerId, attackerId: combat.attackerId, blockerPlayerId: playerId },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    const event = {
      type: "unitBlocked",
      cardId: combat.attackerId,
      sourceCardId: blockerId,
      blockerId,
      blockerPlayerId: playerId,
      playerId: combat.attackerPlayerId,
    };
    enqueueOwnCardTriggers(g, event, combat.attackerId, combat.attackerPlayerId, framework, {
      originatingMoveId: moveId,
    });
    enqueueObserverTriggers(g, event, framework, combat.attackerId, {
      originatingMoveId: moveId,
    });
    drainPendingEffects({ G: g, cards, framework });
  },
};
