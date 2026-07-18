/**
 * Combat / damage effect handlers
 */

import type { Card, CardEffect } from "@tcg/gundam-types";
import type { CardInstanceId } from "../../../types/branded.ts";
import type { FrameworkReadAPI, FrameworkWriteAPI } from "../../../types/move-types.ts";
import type { EffectExecutionContext } from "../executor.ts";
import type { ReadonlyGundamG } from "../../types.ts";
import { getEffectiveStats, isLinkUnit } from "../../rules/derived-state.ts";
import { emitGundamEvent } from "../../events.ts";
import {
  emitGundamLog,
  logCombatDamage,
  logShieldRemoved,
  logUnitDefeated,
} from "../../logging.ts";
import {
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
  enqueuePendingEffect,
  nextPendingEffectId,
} from "../pending-effects.ts";
import {
  applyDamageReduction,
  hasDamagePreventionFor,
} from "../../lifecycle/battle-phase/combat/damage-prevention.ts";
import { enqueueShieldAreaCardDestroyedByUnitDamageTrigger } from "../../lifecycle/battle-phase/combat/shield-area-destroy-event.ts";

type CardLeaveContext = Pick<EffectExecutionContext, "G" | "framework">;

/**
 * The complete context destruction management is allowed to depend on.
 * Keeping this narrower than EffectExecutionContext makes any future field
 * dependency a type error at cost and battle call sites instead of an
 * accidental undefined read.
 */
export type DestructionContext = Pick<
  EffectExecutionContext,
  "G" | "sourcePlayerId" | "sourceCardId" | "framework" | "battleDestroyBreachValue"
>;

export function isDestructionPreventedFor(
  cardId: string,
  sourcePlayerId: string,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): boolean {
  const ownerId = framework.cards.getOwner(cardId) as string | undefined;
  return G.continuousEffects.some((entry) => {
    if (entry.targetId !== cardId) return false;
    if (entry.payload.kind !== "prevent-destroy") return false;
    if (entry.payload.source === "enemy") {
      return ownerId !== undefined && sourcePlayerId !== ownerId;
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
    const targetZone = ctx.framework.zones.getCardZone(cardId as string)?.split(":")[0];
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
    // A face-down card in the shield section is a Shield, not the Unit,
    // Pilot, Command, or Base printed underneath it (rule 4-6-4-2). Do not
    // expose or activate that hidden card's ordinary damage-received effects.
    if (targetZone !== "shieldArea" && damagedOwnerId && ctx.sourcePlayerId) {
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
    if (
      targetZone !== "shieldArea" &&
      damagedOwnerId &&
      ctx.sourcePlayerId &&
      damagedOwnerId !== ctx.sourcePlayerId
    ) {
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

    handleDamageDestruction(cardId as string, targetZone, ctx);
  }
}

/**
 * Apply immediate destruction management after effect damage (rules 5-5-2,
 * 5-10, and 11-3). A card's printed type is not enough here: any face-down
 * card in the shield section is a 1 HP Shield, while a deployed Base uses its
 * Base HP and a Unit in the battle area uses its Unit HP.
 */
function handleDamageDestruction(
  cardId: string,
  zone: string | undefined,
  ctx: EffectExecutionContext,
): void {
  const ownerId = ctx.framework.cards.getOwner(cardId) as string | undefined;
  if (!ownerId) return;

  if (zone === "shieldArea") {
    // Rule 4-6-4-2 / 11-3-1-1: every Shield has exactly 1 HP, regardless
    // of the card definition hidden beneath it.
    if ((ctx.G.damage[cardId] ?? 0) < 1) return;
    handleShieldDestroyedByEffectDamage(cardId, ownerId, ctx);
    return;
  }

  const stats = getEffectiveStats(cardId, ctx.G, ctx.framework.cards, ctx.framework);
  if ((ctx.G.damage[cardId] ?? 0) < stats.hp) return;

  if (zone === "baseSection") {
    handleBaseDestroyed(cardId, ownerId, ctx);
    enqueueShieldAreaCardDestroyedBySourceUnit(cardId, ownerId, ctx);
    return;
  }

  handleUnitDefeated(cardId, ctx);
}

function handleShieldDestroyedByEffectDamage(
  shieldId: string,
  ownerId: string,
  ctx: EffectExecutionContext,
): void {
  // The existing direct-attack path uses the trash zone while the optional
  // Burst is pending. Preserve that runtime convention while publishing the
  // reveal through the same Shield-destruction event and public log.
  ctx.framework.zones.moveCard(shieldId, { zone: "trash", playerId: ownerId });
  delete ctx.G.damage[shieldId];

  enqueueShieldAreaCardDestroyedBySourceUnit(shieldId, ownerId, ctx);
  emitGundamEvent(ctx.framework.events, {
    kind: "SHIELD_REMOVED",
    payload: { cardId: shieldId, playerId: ownerId },
  });
  logShieldRemoved(ctx.framework, {
    cardId: shieldId,
    playerId: ownerId,
    sourceCardId: ctx.sourceCardId,
  });
  enqueueOwnCardTriggers(
    ctx.G,
    {
      type: "shieldDestroyed",
      cardId: shieldId,
      playerId: ownerId,
      destroyedBy: ctx.sourcePlayerId,
    },
    shieldId,
    ownerId,
    ctx.framework,
  );
}

function enqueueShieldAreaCardDestroyedBySourceUnit(
  destroyedCardId: string,
  defenderPlayerId: string,
  ctx: EffectExecutionContext,
): void {
  if (!ctx.sourceCardId || !ctx.sourcePlayerId) return;
  const sourceDefinition = ctx.framework.cards.getDefinition(ctx.sourceCardId) as Card | undefined;
  if (sourceDefinition?.type !== "unit") return;

  enqueueShieldAreaCardDestroyedByUnitDamageTrigger(
    ctx.G,
    ctx.sourceCardId,
    destroyedCardId,
    ctx.sourcePlayerId,
    defenderPlayerId,
    ctx.framework,
  );
}

export function handleUnitDefeated(cardId: string, ctx: DestructionContext): void {
  const ownerId = ctx.framework.cards.getOwner(cardId) as string | undefined;
  if (!ownerId) return;

  // Rule 10-1-6-1 / 10-1-6-4: 【Destroyed】 triggers enqueue before the
  // card moves to trash (their effects still resolve once it leaves).
  // The dying card's own 【Destroyed】 triggers and its paired Pilot's
  // resident 【Destroyed】 triggers are enqueued explicitly. The observer
  // pass remains for delayed/future unitDestroyed watchers, but plain
  // `destroyed` keyword effects are deliberately excluded there by rule
  // 13-2-8. Battle-destruction observers use onDestroyByBattle instead.
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
  enqueueObserverTriggers(
    ctx.G,
    destroyEvent,
    ctx.framework,
    pairedPilotId ? [cardId, pairedPilotId] : cardId,
  );

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
  if (ctx.sourceCardId && (ctx.battleDestroyBreachValue ?? 0) > 0) {
    const breachValue = ctx.battleDestroyBreachValue!;
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
        enqueueShieldAreaCardDestroyedByUnitDamageTrigger(
          ctx.G,
          ctx.sourceCardId,
          baseId,
          ctx.sourcePlayerId,
          ownerId,
          ctx.framework,
        );
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

        // Shields have 1 HP. Any positive Breach value destroys the first
        // Shield, reveals it, and offers its optional 【Burst】 effect (rules
        // 5-5-2, 5-10-3, 13-1-2-2, and 13-2-5). Route that destruction
        // through the same public trigger queue used by direct attacks.
        ctx.framework.zones.moveCard(shieldId, { zone: "trash", playerId: ownerId });
        delete ctx.G.damage[shieldId];
        enqueueShieldAreaCardDestroyedByUnitDamageTrigger(
          ctx.G,
          ctx.sourceCardId,
          shieldId,
          ctx.sourcePlayerId,
          ownerId,
          ctx.framework,
        );
        emitGundamEvent(ctx.framework.events, {
          kind: "SHIELD_REMOVED",
          payload: { cardId: shieldId, playerId: ownerId },
        });
        logShieldRemoved(ctx.framework, {
          cardId: shieldId,
          playerId: ownerId,
          sourceCardId: ctx.sourceCardId,
        });
        enqueueOwnCardTriggers(
          ctx.G,
          {
            type: "shieldDestroyed",
            cardId: shieldId,
            playerId: ownerId,
            destroyedBy: ctx.sourcePlayerId,
          },
          shieldId,
          ownerId,
          ctx.framework,
        );
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
  options: { allowSubstitution?: boolean } = {},
): void {
  for (const cardId of targetIds) {
    if (
      options.allowSubstitution !== false &&
      enqueueBaseRestSubstitutionChoice(cardId as string, ctx)
    ) {
      continue;
    }
    const restCardId = cardId as string;
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

function enqueueBaseRestSubstitutionChoice(cardId: string, ctx: EffectExecutionContext): boolean {
  if (!ctx.sourceCardId) return false;
  const targetDef = ctx.framework.cards.getDefinition(cardId);
  const sourceDef = ctx.framework.cards.getDefinition(ctx.sourceCardId);
  if (targetDef?.type !== "base" || sourceDef?.type !== "unit") return false;
  const targetOwner = ctx.framework.cards.getOwner(cardId);
  if (targetOwner !== ctx.sourcePlayerId) return false;

  const candidates: string[] = [];
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
          effect.directives.some(
            (directive) =>
              "action" in directive && directive.action.action === "substituteBaseRestWithSelf",
          ),
      )
    ) {
      candidates.push(unitId);
    }
  }
  if (candidates.length === 0) return false;

  const firstCandidateId = candidates[0]!;

  enqueuePendingEffect(
    ctx.G,
    {
      id: nextPendingEffectId(ctx.G),
      controllerId: ctx.sourcePlayerId,
      sourceCardId: firstCandidateId,
      effect: {
        type: "substitution",
        activation: {},
        directives: [
          {
            action: {
              action: "rest",
              allowSubstitution: false,
              target: {
                owner: "friendly",
                cardType: ["unit", "base"],
                count: 1,
                instanceIds: [...candidates, cardId],
              },
            },
          },
        ],
        sourceText: `Choose an eligible Unit to rest instead, or choose ${targetDef.name ?? "the Base"} to rest it normally.`,
      } as CardEffect,
      effectIndex: -1,
      kind: "triggered",
    },
    ctx.framework,
    { preempt: true },
  );
  return true;
}

export function handleSetActiveAction(
  targetIds: readonly CardInstanceId[],
  ctx: EffectExecutionContext,
): void {
  for (const cardId of targetIds) {
    const restrictions = getEffectiveStats(
      cardId as string,
      ctx.G,
      ctx.framework.cards,
      ctx.framework,
    ).restrictions;
    if (restrictions.includes("cannot-set-active")) continue;

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
    if (isDestructionPreventedFor(cardId as string, ctx.sourcePlayerId, ctx.G, ctx.framework)) {
      continue;
    }

    const ownerId = ctx.framework.cards.getOwner(cardId as string) as string | undefined;
    if (!ownerId) continue;
    const pairedPilotId = ctx.G.pilotAssignments[cardId as string];

    const destroyEvent = {
      type: "unitDestroyed" as const,
      cardId: cardId as string,
      pairedPilotId,
      ownerId,
      playerId: ctx.sourcePlayerId,
      destroyedBy: ctx.sourcePlayerId,
    };
    enqueueOwnCardTriggers(ctx.G, destroyEvent, cardId as string, ownerId, ctx.framework);
    if (pairedPilotId) {
      enqueueOwnCardTriggers(ctx.G, destroyEvent, pairedPilotId, ownerId, ctx.framework);
    }
    enqueueObserverTriggers(
      ctx.G,
      destroyEvent,
      ctx.framework,
      pairedPilotId ? [cardId as string, pairedPilotId] : (cardId as string),
    );

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

export function cleanupCardOnLeave(cardId: string, ctx: CardLeaveContext): void {
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
    ctx.framework.zones.removeCard(cardId);
    ctx.framework.cards.deregisterDefinition(cardId);
  }
}

export function handleBaseDestroyed(
  baseId: string,
  ownerId: string,
  ctx: DestructionContext,
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
