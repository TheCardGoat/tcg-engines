/**
 * Enter Battle Move
 *
 * Used during main phase to initiate a battle. Carries attacker and target args.
 * Rests the attacker, sets pendingCombat, transitions to battle-phase/attack-step,
 * and hands control to attackStepOnEnter which runs 【Attack】 triggers (rule
 * 8-2-2), checks the 8-2-4 interrupt, and advances to block-step (or short-
 * circuits to battle-end-step on combat break).
 *
 * Rules: 8-1, 8-2 (Attack Step)
 */

import type { FrameworkReadAPI } from "../../../types/move-types.ts";
import type {
  Card,
  CardEffect,
  EffectCondition,
  EffectDirective,
  TargetFilter,
} from "@tcg/gundam-types";
import type { GundamMoveDefinition, GundamCardMeta, ReadonlyGundamG } from "../../types.ts";
import { canAttack, getEffectiveStats } from "../../rules/derived-state.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";
import { buildTargetResolutionContext } from "../../rules/derived-state.ts";
import { evaluateCondition, evaluateTargetFilter } from "../../../runtime/target-dsl.ts";
import { attackStepOnEnter } from "../../lifecycle/battle-phase/attack-step.ts";
import { rejectWithKey } from "./validation-error.ts";
import type { RuntimeCard } from "../../../types/base-card.ts";
import type { CardInstanceId } from "../../../types/branded.ts";

/** Sentinel target value representing a direct attack on the opposing player. */
const DIRECT_TARGET = "direct";

export const enterBattle: GundamMoveDefinition<"enterBattle"> = {
  gatedByPendingEffects: true,

  enumerateCandidates({ G, playerId, framework }) {
    if (framework.state.status.phase !== "main-phase") return [];
    const g = G;
    if (g.turnMetadata.pendingCombat) return [];

    const field = framework.zones.getCards({ zone: "battleArea", playerId });
    const out: string[] = [];
    for (const unitId of field) {
      const def = framework.cards.getDefinition(unitId) as Card | undefined;
      if (!def || def.type !== "unit") continue;
      if (!canAttack(unitId, g, framework.cards, framework)) continue;
      // Skip attackers that have no legal target in the current state so the
      // UI never highlights a unit that would dead-end at target selection.
      if (listLegalAttackTargets(unitId, playerId, g, framework).length === 0) continue;
      out.push(unitId);
    }
    return out;
  },

  describeProcedure({ G, playerId, partialInput, framework }) {
    const g = G;
    const partial = partialInput as { attackerId?: string; target?: string };

    if (!partial.attackerId) {
      const field = framework.zones.getCards({ zone: "battleArea", playerId });
      const attackerCandidates: string[] = [];
      for (const unitId of field) {
        const def = framework.cards.getDefinition(unitId) as Card | undefined;
        if (!def || def.type !== "unit") continue;
        if (!canAttack(unitId, g, framework.cards, framework)) continue;
        if (listLegalAttackTargets(unitId, playerId, g, framework).length === 0) continue;
        attackerCandidates.push(unitId);
      }
      return [
        {
          kind: "selectTarget",
          role: "attacker",
          candidateIds: attackerCandidates,
          minTargets: 1,
          maxTargets: 1,
        },
      ];
    }

    if (!partial.target) {
      return [
        {
          kind: "selectTarget",
          role: "attackTarget",
          candidateIds: listLegalAttackTargets(partial.attackerId, playerId, g, framework),
          minTargets: 1,
          maxTargets: 1,
        },
      ];
    }

    // Both inputs collected — return no remaining steps. Under the move
    // procedure contract, `[]` indicates there is nothing left to prompt
    // for, so clients may submit the move without an additional confirm
    // step.
    return [];
  },

  validate({ G, playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };
    const g = G;
    const { attackerId, target } = args;

    if (framework.state.status.phase !== "main-phase") {
      return {
        valid: false,
        error: "Can only enter battle during the main phase",
        errorCode: "WRONG_PHASE",
      };
    }

    if (g.turnMetadata.pendingCombat) {
      return { valid: false, error: "Combat already in progress", errorCode: "COMBAT_PENDING" };
    }

    const myField = framework.zones.getCards({ zone: "battleArea", playerId });
    if (!myField.includes(attackerId)) {
      return {
        valid: false,
        error: "Attacker not on your battlefield",
        errorCode: "INVALID_ATTACKER",
      };
    }

    const attackerDef = framework.cards.getDefinition(attackerId) as Card | undefined;
    if (attackerDef?.type !== "unit") {
      return { valid: false, error: "Only units can attack", errorCode: "NOT_A_UNIT" };
    }

    if (!canAttack(attackerId, g, framework.cards, framework)) {
      return { valid: false, error: "This unit cannot attack", errorCode: "CANNOT_ATTACK" };
    }

    if (
      target === "direct" &&
      getEffectiveStats(attackerId, g, framework.cards, framework).restrictions.includes(
        "cannot-target-player",
      )
    ) {
      return {
        valid: false,
        error: "This unit can't choose the enemy player as its attack target",
        errorCode: "CANNOT_TARGET_PLAYER",
      };
    }

    if (target !== "direct") {
      const isEnemyUnit = Object.keys(g.players)
        .filter((id) => id !== playerId)
        .some((oppId) => {
          const oppField = framework.zones.getCards({ zone: "battleArea", playerId: oppId });
          return oppField.includes(target);
        });

      if (!isEnemyUnit) {
        return { valid: false, error: "Target must be an enemy unit", errorCode: "INVALID_TARGET" };
      }
    }

    // Force-attack-target: RESTRICTS the attacker to only attack matching targets.
    const forceTargetEffects = getForceAttackTargetPayloads(attackerId, playerId, g, framework);
    if (forceTargetEffects.length > 0) {
      const tgtCtx = buildTargetResolutionContext(g, playerId, framework, {
        sourceCardId: attackerId,
      });
      const battleCards = getAllBattleAreaRuntimeCards(g, framework);
      for (const payload of forceTargetEffects) {
        const validTargets = payload.attackTargetId
          ? [payload.attackTargetId]
          : evaluateTargetFilter(payload.attackTarget, battleCards, tgtCtx);
        if (!validTargets.includes(target as CardInstanceId)) {
          return rejectWithKey(
            "gundam.error.battle.mustAttackRequiredTarget",
            {},
            "INVALID_TARGET",
          );
        }
      }
    }

    // Grant-attack-target-option: EXPANDS the attacker's valid target set
    // (permissive / may-choose). If the target was already valid it's still
    // accepted. If it was rejected by a prior check (e.g. future rested-
    // target enforcement), having a matching grant overrides the rejection.
    // Currently a no-op for validation since the engine doesn't enforce
    // rested-target rules yet — but the continuous effect is registered so
    // the grant shows up in `continuousEffects` and can be queried.

    return { valid: true };
  },

  execute({ G, playerId, args, moveId, framework, cards }) {
    const g = G;
    const { attackerId, target } = args;

    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId,
      attackerPlayerId: playerId,
      target,
    };

    g.turnMetadata.attackedThisTurn.push(attackerId);

    g.exhausted[attackerId] = true;
    framework.cards.patchMeta(attackerId, { exhausted: true, attackedThisTurn: true });

    emitGundamEvent(framework.events, {
      kind: "ATTACK_DECLARED",
      payload: { attackerId, target, attackerPlayerId: playerId },
    });
    emitGundamLog(framework, {
      type: "gundam.move.attackDeclared",
      values: { attackerId, targetId: target, attackerPlayerId: playerId },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    // Transition into battle-phase/attack-step. The attack-step lifecycle
    // runs 【Attack】 triggers (8-2-2) and the 8-2-4 interrupt check, then
    // either routes to battle-end-step (if combat broke) or advances to
    // block-step. See lifecycle/battle-phase/attack-step.ts.
    framework.status.setPhase("battle-phase");
    framework.status.setStep("attack-step");
    // Stash the move id on G so the lifecycle's enqueue helpers stamp
    // attack-step triggers with this move's group id (cleared after the
    // hook returns so the field doesn't bleed into later flow ticks).
    const prevMoveId = g.pendingEffectCurrentMoveId;
    g.pendingEffectCurrentMoveId = moveId;
    try {
      attackStepOnEnter({ G: g, framework, cards });
    } finally {
      g.pendingEffectCurrentMoveId = prevMoveId;
    }
  },
};

function getAllBattleAreaRuntimeCards(
  g: ReadonlyGundamG,
  framework: {
    cards: { get: (id: string) => RuntimeCard | undefined };
    zones: { getCards: (ref: { zone: string; playerId: string }) => string[] };
  },
): RuntimeCard[] {
  const cards: RuntimeCard[] = [];
  for (const playerId of Object.keys(g.players)) {
    const ids = framework.zones.getCards({ zone: "battleArea", playerId });
    for (const id of ids) {
      const card = framework.cards.get(id);
      if (card) cards.push(card);
    }
  }
  return cards;
}

/**
 * Legal attack targets for `attackerId` controlled by `playerId`, given the
 * current game state. Mirrors the gates in `validate` so UI enumeration and
 * server-side validation can converge on one source of truth.
 *
 * Returns a mix of enemy unit instance IDs and the `DIRECT_TARGET` sentinel
 * when a direct attack on the opposing player is legal. Returns `[]` when the
 * attacker has no legal target (e.g. every candidate is still active, or a
 * `force-attack-target` filter excludes all present targets).
 */
export function listLegalAttackTargets(
  attackerId: string,
  playerId: string,
  g: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): string[] {
  const opponentIds = Object.keys(g.players).filter((id) => id !== playerId);

  // Rested enemy units are the only unit-type targets per the attack rules.
  const restedEnemyUnitIds: string[] = [];
  for (const oppId of opponentIds) {
    const oppField = framework.zones.getCards({ zone: "battleArea", playerId: oppId });
    for (const unitId of oppField) {
      const def = framework.cards.getDefinition(unitId) as Card | undefined;
      if (def?.type !== "unit") continue;
      const meta = framework.cards.getMeta(unitId) as GundamCardMeta | undefined;
      const exhausted = meta?.exhausted === true || g.exhausted[unitId] === true;
      if (exhausted) restedEnemyUnitIds.push(unitId);
    }
  }

  // Direct attack legality: always allowed unless the attacker has the
  // `cannot-target-player` restriction. The defender's option to redirect
  // via 【Blocker】 is enforced in the block step, not here. <High-Maneuver>
  // affects blocking (rule 13-2), not target selection.
  const effectiveStats = getEffectiveStats(attackerId, g, framework.cards, framework);
  const cannotTargetPlayer = effectiveStats.restrictions.includes("cannot-target-player");
  const directAllowed = !cannotTargetPlayer;

  let candidateIds: string[] = [...restedEnemyUnitIds];
  if (directAllowed) candidateIds.push(DIRECT_TARGET);

  // Apply continuous effects that restrict / expand the attacker's target set.
  const forceTargetEffects = getForceAttackTargetPayloads(attackerId, playerId, g, framework);
  const grantTargetEffects = g.continuousEffects.filter(
    (e) => e.targetId === attackerId && e.payload.kind === "grant-attack-target-option",
  );

  if (forceTargetEffects.length > 0 || grantTargetEffects.length > 0) {
    const tgtCtx = buildTargetResolutionContext(g, playerId, framework, {
      sourceCardId: attackerId,
    });
    const battleCards = getAllBattleAreaRuntimeCards(g, framework);

    if (forceTargetEffects.length > 0) {
      // Intersect candidate set with every force filter (multiple forces are
      // additive restrictions: the target must satisfy all of them).
      for (const payload of forceTargetEffects) {
        const allowed = new Set(
          payload.attackTargetId
            ? [payload.attackTargetId]
            : (evaluateTargetFilter(
                payload.attackTarget,
                battleCards,
                tgtCtx,
              ) as readonly string[]),
        );
        candidateIds = candidateIds.filter((id) => id !== DIRECT_TARGET && allowed.has(id));
      }
    }

    if (grantTargetEffects.length > 0) {
      // Grants are permissive — union them into the set even if the card
      // was otherwise filtered out (e.g. active enemy unit).
      const granted = new Set<string>();
      for (const effect of grantTargetEffects) {
        if (effect.payload.kind !== "grant-attack-target-option") continue;
        for (const id of evaluateTargetFilter(effect.payload.attackTarget, battleCards, tgtCtx)) {
          granted.add(id as string);
        }
      }
      for (const id of granted) {
        if (!candidateIds.includes(id)) candidateIds.push(id);
      }
    }
  }

  return candidateIds;
}

type ForceAttackTargetPayload = {
  attackTarget: TargetFilter;
  attackTargetId?: string;
};

function getForceAttackTargetPayloads(
  attackerId: string,
  playerId: string,
  g: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): ForceAttackTargetPayload[] {
  const payloads: ForceAttackTargetPayload[] = [];
  for (const entry of g.continuousEffects) {
    if (entry.targetId === attackerId && entry.payload.kind === "force-attack-target") {
      payloads.push({
        attackTarget: entry.payload.attackTarget as TargetFilter,
        attackTargetId: entry.payload.attackTargetId,
      });
    }
  }

  const battleCards = getAllBattleAreaRuntimeCards(g, framework);
  for (const sourceCard of battleCards) {
    const sourceId = sourceCard.instanceId as string;
    const sourceDef = framework.cards.getDefinition(sourceId) as Card | undefined;
    if (!sourceDef?.effects?.length) continue;
    const sourceOwner = framework.cards.getOwner(sourceId);
    if (!sourceOwner || sourceOwner === playerId) continue;

    const sourceCtx = buildTargetResolutionContext(g, sourceOwner, framework, {
      sourceCardId: sourceId,
    });

    for (const effect of sourceDef.effects as CardEffect[]) {
      if (effect.type !== "constant") continue;
      if (
        effect.activation.conditions?.some(
          (condition) => !evaluateCondition(condition as EffectCondition, sourceCtx),
        )
      ) {
        continue;
      }
      for (const directive of effect.directives) {
        if (!("action" in directive)) continue;
        const action = (directive as EffectDirective).action;
        if (action.action !== "forceAttackTarget") continue;
        const affectedUnits = evaluateTargetFilter(action.unit, battleCards, sourceCtx);
        if (!affectedUnits.includes(attackerId as CardInstanceId)) continue;
        const attackTargets = evaluateTargetFilter(action.attackTarget, battleCards, sourceCtx);
        const attackTargetId = attackTargets[0] as string | undefined;
        if (attackTargetId) payloads.push({ attackTarget: action.attackTarget, attackTargetId });
      }
    }
  }

  return payloads;
}
