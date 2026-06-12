/**
 * Combat / damage effect handlers
 */

import type { CardInstanceId } from "../../../types/branded.ts";
import type { FrameworkWriteAPI } from "../../../types/move-types.ts";
import type { EffectExecutionContext } from "../executor.ts";
import {
  getEffectiveStats,
  hasKeyword,
  getKeywordValue,
  isLinkUnit,
} from "../../rules/derived-state.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog, logCombatDamage, logUnitDefeated } from "../../logging.ts";
import { enqueueObserverTriggers, enqueueOwnCardTriggers } from "../pending-effects.ts";
import {
  applyDamageReduction,
  hasDamagePreventionFor,
} from "../../lifecycle/battle-phase/combat/damage-prevention.ts";

function hasDestroyPreventionFor(cardId: string, ctx: EffectExecutionContext): boolean {
  const ownerId = ctx.framework.cards.getOwner(cardId) as string | undefined;
  return ctx.G.continuousEffects.some((entry) => {
    if (entry.targetId !== cardId) return false;
    if (entry.payload.kind !== "prevent-destroy") return false;
    if (entry.payload.source === "enemy") {
      return ownerId !== undefined && ctx.sourcePlayerId !== ownerId;
    }
    return true;
  });
}

// =============================================================================
// Deal Damage
// =============================================================================

export function handleDealDamageAction(
  targetIds: readonly CardInstanceId[],
  amount: number,
  ctx: EffectExecutionContext,
): void {
  // Rule 5-5-5: damage of 0 is not dealt — no counter, no event, no trigger.
  if (amount <= 0) return;
  for (const cardId of targetIds) {
    // Check effect-damage prevention: continuous effects with
    // `damageType: "effect"` (or no damageType restriction) can block
    // damage dealt by card effects (dealDamage actions). The source is
    // `ctx.sourceCardId` — the card whose effect is resolving.
    if (
      ctx.sourceCardId &&
      hasDamagePreventionFor(cardId as string, ctx.sourceCardId, ctx.G, ctx.framework, "effect")
    ) {
      continue;
    }

    const reducedAmount = ctx.sourceCardId
      ? applyDamageReduction(
          cardId as string,
          ctx.sourceCardId,
          amount,
          ctx.G,
          ctx.framework,
          "effect",
        )
      : amount;
    if (reducedAmount <= 0) continue;

    const current = ctx.G.damage[cardId as string] ?? 0;
    ctx.G.damage[cardId as string] = current + reducedAmount;

    emitGundamEvent(ctx.framework.events, {
      kind: "DAMAGE_DEALT",
      payload: { cardId, amount: reducedAmount, sourceCardId: ctx.sourceCardId },
    });
    logCombatDamage(ctx.framework, {
      cardId: cardId as string,
      amount: reducedAmount,
      sourceCardId: ctx.sourceCardId,
    });

    const damagedOwnerId = ctx.framework.cards.getOwner(cardId as string) as string | undefined;
    if (damagedOwnerId && ctx.sourcePlayerId) {
      const dmgEvent = {
        type: "anyEffectDamageReceived" as const,
        cardId: cardId as string,
        ownerId: damagedOwnerId,
        playerId: ctx.sourcePlayerId,
        amount: reducedAmount,
        sourceCardId: ctx.sourceCardId,
        damagedBy: ctx.sourcePlayerId,
      };
      enqueueOwnCardTriggers(ctx.G, dmgEvent, cardId as string, damagedOwnerId, ctx.framework);
      enqueueObserverTriggers(ctx.G, dmgEvent, ctx.framework, cardId as string);
    }

    // Reactive trigger: "When this Unit receives enemy effect damage"
    // Fire when the damage source belongs to the opponent of the damaged card.
    if (damagedOwnerId && ctx.sourcePlayerId && damagedOwnerId !== ctx.sourcePlayerId) {
      const dmgEvent = {
        type: "effectDamageReceived" as const,
        cardId: cardId as string,
        ownerId: damagedOwnerId,
        playerId: ctx.sourcePlayerId,
        amount: reducedAmount,
        sourceCardId: ctx.sourceCardId,
        damagedBy: ctx.sourcePlayerId,
      };
      enqueueOwnCardTriggers(ctx.G, dmgEvent, cardId as string, damagedOwnerId, ctx.framework);
      enqueueObserverTriggers(ctx.G, dmgEvent, ctx.framework, cardId as string);

      emitGundamEvent(ctx.framework.events, {
        kind: "EFFECT_DAMAGE_RECEIVED",
        payload: { cardId, amount: reducedAmount, sourceCardId: ctx.sourceCardId },
      });
    }

    // Check defeat
    const stats = getEffectiveStats(cardId as string, ctx.G, ctx.framework.cards, ctx.framework);
    if (ctx.G.damage[cardId as string]! >= stats.hp) {
      handleUnitDefeated(cardId as string, ctx);
    }
  }
}

export function handleUnitDefeated(cardId: string, ctx: EffectExecutionContext): void {
  const ownerId = ctx.framework.cards.getOwner(cardId) as string | undefined;
  if (!ownerId) return;

  // Rule 10-1-6-1 / 10-1-6-4: 【Destroyed】 triggers enqueue before the
  // card moves to trash (their effects still resolve once it leaves).
  // Both the dying card's own 【Destroyed】 triggers and any in-play
  // observer triggers (e.g. "when another friendly unit is destroyed,
  // do X") must be enqueued for the same event — mirrors the
  // attackDeclared pattern in attack-step. Dedup is handled inside
  // `enqueueObserverTriggers` via its `seen` set.
  const pairedPilotId = ctx.G.pilotAssignments[cardId];
  const destroyEvent = {
    type: "unitDestroyed" as const,
    cardId,
    pairedPilotId,
    ownerId,
    playerId: ctx.sourcePlayerId,
    destroyedBy: ctx.sourcePlayerId,
  };
  enqueueOwnCardTriggers(ctx.G, destroyEvent, cardId, ownerId, ctx.framework);
  if (pairedPilotId) {
    enqueueOwnCardTriggers(ctx.G, destroyEvent, pairedPilotId, ownerId, ctx.framework);
  }
  enqueueObserverTriggers(ctx.G, destroyEvent, ctx.framework, cardId);

  // Fire onEnemyLinkUnitDestroyed observers when the destroyed unit is
  // a link unit. The event targets observers on the OPPONENT's side —
  // e.g. "When an enemy Link Unit is destroyed ... draw 1."
  if (isLinkUnit(cardId, ctx.G, ctx.framework.cards)) {
    const enemyLinkEvent = {
      type: "enemyLinkUnitDestroyed" as const,
      cardId,
      ownerId,
      destroyedBy: ctx.sourcePlayerId,
    };
    enqueueObserverTriggers(ctx.G, enemyLinkEvent, ctx.framework, cardId);
  }

  // Move to Trash and clean up
  ctx.framework.zones.moveCard(cardId, { zone: "trash", playerId: ownerId });
  cleanupCardOnLeave(cardId, ctx);

  emitGundamEvent(ctx.framework.events, {
    kind: "UNIT_DEFEATED",
    payload: { cardId, ownerId, defeatedBy: ctx.sourcePlayerId },
  });
  logUnitDefeated(ctx.framework, {
    cardId,
    ownerId,
    defeatedBy: ctx.sourcePlayerId,
  });

  // Breach: after destroying an enemy unit, deal damage to first shield or base
  // Rule 13-1-2-1: deals (value) damage to the first card in shield area
  // Rule 13-1-2-2: if Base present, damage goes to Base; otherwise topmost Shield
  // Rule 13-1-2-4: if no base/shields, effect does not activate
  if (ctx.sourceCardId && hasKeyword(ctx.sourceCardId, "Breach", ctx.G, ctx.framework.cards)) {
    const breachValue = getKeywordValue(ctx.sourceCardId, "Breach", ctx.G, ctx.framework.cards);
    // Rule 5-5-5: skip Breach when its value is 0 — no damage is dealt.
    if (breachValue <= 0) return;

    const bases = ctx.framework.zones.getCards({ zone: "baseSection", playerId: ownerId });
    if (bases.length > 0) {
      const baseId = bases[0]!;
      ctx.G.damage[baseId] = (ctx.G.damage[baseId] ?? 0) + breachValue;

      emitGundamEvent(ctx.framework.events, {
        kind: "DAMAGE_DEALT",
        payload: { cardId: baseId, amount: breachValue, sourceCardId: ctx.sourceCardId },
      });
      logCombatDamage(ctx.framework, {
        cardId: baseId,
        amount: breachValue,
        sourceCardId: ctx.sourceCardId,
      });

      const baseStats = getEffectiveStats(baseId, ctx.G, ctx.framework.cards, ctx.framework);
      if (ctx.G.damage[baseId]! >= baseStats.hp) {
        handleBaseDestroyed(baseId, ownerId!, ctx);
      }
    } else {
      const shields = ctx.framework.zones.getCards({ zone: "shieldArea", playerId: ownerId });
      if (shields.length > 0) {
        const shieldId = shields[0]!;
        ctx.G.damage[shieldId] = (ctx.G.damage[shieldId] ?? 0) + breachValue;

        emitGundamEvent(ctx.framework.events, {
          kind: "DAMAGE_DEALT",
          payload: { cardId: shieldId, amount: breachValue, sourceCardId: ctx.sourceCardId },
        });
        logCombatDamage(ctx.framework, {
          cardId: shieldId,
          amount: breachValue,
          sourceCardId: ctx.sourceCardId,
        });
      }
    }
  }
}

// =============================================================================
// Recover HP (remove damage)
// =============================================================================

export function handleRecoverHPAction(
  targetIds: readonly CardInstanceId[],
  amount: number,
  ctx: EffectExecutionContext,
): void {
  for (const cardId of targetIds) {
    const id = cardId as string;
    const current = ctx.G.damage[id] ?? 0;
    if (current === 0 || amount <= 0) continue;
    const next = Math.max(0, current - amount);
    if (next === current) continue;
    const recovered = current - next;
    ctx.G.damage[id] = next;

    emitGundamLog(ctx.framework, {
      type: "gundam.effect.hpRecovered",
      values: { cardId: id, amount: recovered },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    // Rule 10-1-6-1: fire 【When Healed】 triggers on the healed card's
    // own effects + any in-play observer whose effect watches the event.
    // Mirrors the unitDestroyed / attackDeclared enqueue pattern in this
    // file (see handleUnitDefeated above).
    const ownerId = ctx.framework.cards.getOwner(id) as string | undefined;
    if (!ownerId) continue;
    const event = { type: "unitHealed", cardId: id, ownerId } as const;
    enqueueOwnCardTriggers(ctx.G, event, id, ownerId, ctx.framework);
    enqueueObserverTriggers(ctx.G, event, ctx.framework, id);
  }
}

// =============================================================================
// Exhaust / Ready
// =============================================================================

export function handleRestAction(
  targetIds: readonly CardInstanceId[],
  ctx: EffectExecutionContext,
): void {
  for (const cardId of targetIds) {
    const substitutedCardId = substituteBaseRestWithUnit(cardId as string, ctx);
    const restCardId = substitutedCardId ?? (cardId as string);
    ctx.G.exhausted[restCardId] = true;
    ctx.framework.cards.patchMeta(restCardId, { exhausted: true });
    emitGundamLog(ctx.framework, {
      type: "gundam.effect.exhausted",
      values: { cardId: restCardId },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
    const ownerId = ctx.framework.cards.getOwner(restCardId) as string | undefined;
    if (!ownerId) continue;
    const event = {
      type: "restedByEffect",
      cardId: restCardId,
      ownerId,
      playerId: ctx.sourcePlayerId,
      sourceCardId: ctx.sourceCardId,
    };
    enqueueOwnCardTriggers(ctx.G, event, restCardId, ownerId, ctx.framework);
    enqueueObserverTriggers(ctx.G, event, ctx.framework, restCardId);
  }
}

function substituteBaseRestWithUnit(
  cardId: string,
  ctx: EffectExecutionContext,
): string | undefined {
  if (!ctx.sourceCardId) return undefined;
  const targetDef = ctx.framework.cards.getDefinition(cardId);
  const sourceDef = ctx.framework.cards.getDefinition(ctx.sourceCardId);
  if (targetDef?.type !== "base" || sourceDef?.type !== "unit") return undefined;
  const targetOwner = ctx.framework.cards.getOwner(cardId);
  if (targetOwner !== ctx.sourcePlayerId) return undefined;

  for (const unitId of ctx.framework.zones.getCards({
    zone: "battleArea",
    playerId: ctx.sourcePlayerId,
  })) {
    if (ctx.G.exhausted[unitId]) continue;
    const unitDef = ctx.framework.cards.getDefinition(unitId);
    if (
      unitDef?.type === "unit" &&
      unitDef.effects?.some(
        (effect) =>
          effect.type === "substitution" &&
          effect.sourceText.toLowerCase().includes("rest your base"),
      )
    ) {
      return unitId;
    }
  }
  return undefined;
}

export function handleSetActiveAction(
  targetIds: readonly CardInstanceId[],
  ctx: EffectExecutionContext,
): void {
  for (const cardId of targetIds) {
    const wasExhausted = ctx.G.exhausted[cardId as string] === true;
    ctx.G.exhausted[cardId as string] = false;
    ctx.framework.cards.patchMeta(cardId as string, { exhausted: false });
    emitGundamLog(ctx.framework, {
      type: "gundam.effect.readied",
      values: { cardId: cardId as string },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
    if (!wasExhausted) continue;
    const ownerId = ctx.framework.cards.getOwner(cardId as string) as string | undefined;
    if (!ownerId) continue;
    const pairedPilotId = ctx.G.pilotAssignments[cardId as string];
    const event = {
      type: "setActiveByEffect",
      cardId: cardId as string,
      pairedPilotId,
      ownerId,
      playerId: ctx.sourcePlayerId,
      sourceCardId: ctx.sourceCardId,
    };
    enqueueOwnCardTriggers(ctx.G, event, cardId as string, ownerId, ctx.framework);
    if (pairedPilotId) {
      enqueueOwnCardTriggers(ctx.G, event, pairedPilotId, ownerId, ctx.framework);
    }
    enqueueObserverTriggers(
      ctx.G,
      event,
      ctx.framework,
      pairedPilotId ? [cardId as string, pairedPilotId] : (cardId as string),
    );
  }
}

// =============================================================================
// Destroy / Exile
// =============================================================================

export function handleDestroyAction(
  targetIds: readonly CardInstanceId[],
  ctx: EffectExecutionContext,
): void {
  for (const cardId of targetIds) {
    if (hasDestroyPreventionFor(cardId as string, ctx)) continue;

    const ownerId = ctx.framework.cards.getOwner(cardId as string) as string | undefined;
    if (!ownerId) continue;

    const destroyEvent = {
      type: "unitDestroyed" as const,
      cardId: cardId as string,
      ownerId,
      playerId: ctx.sourcePlayerId,
      destroyedBy: ctx.sourcePlayerId,
    };
    enqueueOwnCardTriggers(ctx.G, destroyEvent, cardId as string, ownerId, ctx.framework);
    enqueueObserverTriggers(ctx.G, destroyEvent, ctx.framework, cardId as string);

    ctx.framework.zones.moveCard(cardId as string, { zone: "trash", playerId: ownerId });
    cleanupCardOnLeave(cardId as string, ctx);
  }
}

export function handleExileAction(
  targetIds: readonly CardInstanceId[],
  framework: FrameworkWriteAPI,
): void {
  for (const cardId of targetIds) {
    framework.zones.moveCard(cardId as string, { zone: "removalArea" });
  }
}

// =============================================================================
// Internal Helpers
// =============================================================================

export function cleanupCardOnLeave(cardId: string, ctx: EffectExecutionContext): void {
  delete ctx.G.damage[cardId];
  delete ctx.G.exhausted[cardId];

  const pilotId = ctx.G.pilotAssignments[cardId];
  if (pilotId) {
    const pilotOwnerId = ctx.framework.cards.getOwner(pilotId) as string | undefined;
    if (pilotOwnerId) {
      ctx.framework.zones.moveCard(pilotId, { zone: "trash", playerId: pilotOwnerId });
    }
    delete ctx.G.pilotAssignments[cardId];
  }
  for (const [unitId, pairedPilotId] of Object.entries(ctx.G.pilotAssignments)) {
    if (pairedPilotId === cardId) {
      delete ctx.G.pilotAssignments[unitId];
    }
  }

  ctx.G.continuousEffects = ctx.G.continuousEffects.filter(
    (e) => e.sourceId !== cardId && e.targetId !== cardId,
  );

  const meta = ctx.framework.cards.getMeta(cardId);
  if (meta?.isToken === true) {
    ctx.framework.cards.deregisterDefinition(cardId);
  }
}

export function handleBaseDestroyed(
  baseId: string,
  ownerId: string,
  ctx: EffectExecutionContext,
): void {
  const destroyEvent = {
    type: "unitDestroyed" as const,
    cardId: baseId,
    ownerId,
    playerId: ctx.sourcePlayerId,
    destroyedBy: ctx.sourcePlayerId,
  };
  enqueueOwnCardTriggers(ctx.G, destroyEvent, baseId, ownerId, ctx.framework);
  enqueueObserverTriggers(ctx.G, destroyEvent, ctx.framework, baseId);

  ctx.framework.zones.moveCard(baseId, { zone: "trash", playerId: ownerId });
  cleanupCardOnLeave(baseId, ctx);

  emitGundamEvent(ctx.framework.events, {
    kind: "UNIT_DEFEATED",
    payload: { cardId: baseId, ownerId, defeatedBy: ctx.sourcePlayerId },
  });
  logUnitDefeated(ctx.framework, {
    cardId: baseId,
    ownerId,
    defeatedBy: ctx.sourcePlayerId,
  });
}
