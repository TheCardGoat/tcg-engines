/**
 * Zone movement effect handlers
 */

import type { CardInstanceId, PlayerId } from "../../../types/branded.ts";
import type { Card, TokenSpec, UnitCard } from "@tcg/gundam-types";
import type { CardEffect } from "@tcg/gundam-types";
import type { EffectExecutionContext } from "../executor.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";
import {
  enqueueMoveCompletionFence,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../pending-effects.ts";
import { TOKEN_PRINTINGS } from "@tcg/gundam-token-data";

let tokenCounter = 0;

// =============================================================================
// Return to Hand
// =============================================================================

export function handleReturnToHandAction(
  targetIds: readonly CardInstanceId[],
  ctx: EffectExecutionContext,
): void {
  for (const cardId of targetIds) {
    const ownerId = ctx.framework.cards.getOwner(cardId as string) as string | undefined;
    if (!ownerId) continue;
    ctx.framework.zones.moveCard(cardId as string, { zone: "hand", playerId: ownerId });
    // Reset damage/exhaustion
    ctx.G.damage[cardId as string] = 0;
    ctx.G.exhausted[cardId as string] = false;
    clearPilotAssignmentReferences(cardId as string, ctx);
    emitGundamLog(ctx.framework, {
      type: "gundam.effect.returnedToHand",
      values: { cardId: cardId as string, playerId: ownerId },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
  }
}

export function handleReturnPairedPilotToHandAction(ctx: EffectExecutionContext): void {
  const eventPilotId =
    ctx.triggerContext?.pairedPilotId ??
    (ctx.sourceCardId ? ctx.G.pilotAssignments[ctx.sourceCardId] : undefined);
  if (!eventPilotId) return;

  const ownerId = ctx.framework.cards.getOwner(eventPilotId) as string | undefined;
  if (!ownerId) return;

  ctx.framework.zones.moveCard(eventPilotId, { zone: "hand", playerId: ownerId });
  for (const [unitId, pilotId] of Object.entries(ctx.G.pilotAssignments)) {
    if (pilotId === eventPilotId) {
      delete ctx.G.pilotAssignments[unitId];
    }
  }
  emitGundamLog(ctx.framework, {
    type: "gundam.effect.returnedToHand",
    values: { cardId: eventPilotId, playerId: ownerId },
    visibility: { mode: "PUBLIC" },
    category: "action",
  });
}

// =============================================================================
// Return to Deck
// =============================================================================

export function handleReturnToDeckAction(
  targetIds: readonly CardInstanceId[],
  position: "top" | "bottom",
  ctx: EffectExecutionContext,
  shuffle = false,
): void {
  const affectedOwners = new Set<string>();
  for (const cardId of targetIds) {
    const ownerId = ctx.framework.cards.getOwner(cardId as string) as string | undefined;
    if (!ownerId) continue;
    affectedOwners.add(ownerId);
    const options = position === "bottom" ? { index: 0 } : undefined;
    ctx.framework.zones.moveCard(cardId as string, { zone: "deck", playerId: ownerId }, options);
    // Reset unit state when it leaves the battle area.
    ctx.G.damage[cardId as string] = 0;
    ctx.G.exhausted[cardId as string] = false;
    clearPilotAssignmentReferences(cardId as string, ctx);
    emitGundamLog(ctx.framework, {
      type: "gundam.effect.movedToZone",
      values: { cardId: cardId as string, from: "battleArea", to: "deck" },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
  }
  if (shuffle) {
    for (const ownerId of affectedOwners) {
      ctx.framework.zones.shuffle({ zone: "deck", playerId: ownerId });
    }
  }
}

function clearPilotAssignmentReferences(cardId: string, ctx: EffectExecutionContext): void {
  delete ctx.G.pilotAssignments[cardId];
  for (const [unitId, pilotId] of Object.entries(ctx.G.pilotAssignments)) {
    if (pilotId === cardId) {
      delete ctx.G.pilotAssignments[unitId];
    }
  }
}

// =============================================================================
// Deploy (from Hand or effect source to BattleArea)
// =============================================================================

export function handleDeployAction(
  targetIds: readonly CardInstanceId[],
  ctx: EffectExecutionContext,
): void {
  for (const cardId of targetIds) {
    const ownerId = ctx.framework.cards.getOwner(cardId as string) as string | undefined;
    if (!ownerId) continue;
    const def = ctx.framework.cards.getDefinition(cardId as string) as Card | undefined;
    const isBase = def?.type === "base";
    const zone = isBase ? "baseSection" : "battleArea";
    const fromZone = ctx.framework.cards.getZone(cardId as string)?.split(":")[0];
    ctx.framework.zones.moveCard(cardId as string, { zone, playerId: ownerId });
    ctx.G.turnMetadata.deployedThisTurn.push(cardId as string);
    ctx.G.exhausted[cardId as string] = false;
    ctx.framework.cards.patchMeta(cardId as string, { exhausted: false, deployedThisTurn: true });
    // Placement event — synchronous zone-change signal. The completion
    // event (UNIT_DEPLOYED / BASE_DEPLOYED) is deferred to the
    // completion fence below so it fires AFTER any deploy-triggered
    // effect produced by this card has settled, matching the contract
    // used by the player-initiated deploy moves.
    emitGundamEvent(ctx.framework.events, {
      kind: isBase ? "BASE_PLACED" : "UNIT_PLACED",
      payload: { cardId, playerId: ownerId },
    });
    emitGundamLog(ctx.framework, {
      type: "gundam.effect.movedToZone",
      values: { cardId: cardId as string, from: "hand", to: zone },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
    const event = {
      type: isBase ? "baseDeployed" : "unitDeployed",
      cardId: cardId as string,
      playerId: ownerId,
      fromZone,
    };
    enqueueOwnCardTriggers(ctx.G, event, cardId as string, ownerId, ctx.framework);
    enqueueObserverTriggers(ctx.G, event, ctx.framework, cardId as string);
    // Completion fence — UNIT_DEPLOYED / BASE_DEPLOYED fires after the
    // parent effect's resolution settles. `originatingMoveId` is omitted
    // so the fence inherits the parent's id via the ambient
    // `g.pendingEffectCurrentMoveId` (set by drainPendingEffects /
    // resolveEffect.execute around the executor call).
    enqueueMoveCompletionFence(ctx.G, ownerId, ctx.framework, [
      {
        kind: "emitEvent",
        event: {
          kind: isBase ? "BASE_DEPLOYED" : "UNIT_DEPLOYED",
          payload: { cardId, playerId: ownerId },
        },
      },
    ]);
  }
}

// =============================================================================
// Deploy Self (Burst / Deploy effect on the card itself)
// =============================================================================

export function handleDeploySelfAction(sourceCardId: string, ctx: EffectExecutionContext): void {
  const ownerId = ctx.framework.cards.getOwner(sourceCardId) as string | undefined;
  if (!ownerId) return;

  const def = ctx.framework.cards.getDefinition(sourceCardId);
  const isBase = def?.type === "base";
  const zone = isBase ? "baseSection" : "battleArea";
  const fromZone = ctx.framework.cards.getZone(sourceCardId)?.split(":")[0];
  ctx.framework.zones.moveCard(sourceCardId, { zone, playerId: ownerId });
  ctx.G.turnMetadata.deployedThisTurn.push(sourceCardId);
  ctx.G.exhausted[sourceCardId] = false;
  ctx.framework.cards.patchMeta(sourceCardId, { exhausted: false, deployedThisTurn: true });

  // Placement event (synchronous) — see `handleDeployAction` for the
  // placement/completion contract.
  emitGundamEvent(ctx.framework.events, {
    kind: isBase ? "BASE_PLACED" : "UNIT_PLACED",
    payload: { cardId: sourceCardId, playerId: ownerId },
  });
  // Queue this card's own 【Deploy】 triggered effects so burst-deployed
  // Units / Bases still fire their on-deploy clauses (rule 10-1-6 — the
  // trigger fires from the deploy event regardless of how deployment
  // happened). Without this enqueue, cards like Dominion would flip
  // into baseSection on burst but silently drop their 【Deploy】 clauses.
  enqueueOwnCardTriggers(
    ctx.G,
    {
      type: isBase ? "baseDeployed" : "unitDeployed",
      cardId: sourceCardId,
      playerId: ownerId,
      fromZone,
    },
    sourceCardId,
    ownerId,
    ctx.framework,
  );
  // Completion fence — UNIT_DEPLOYED / BASE_DEPLOYED fires after every
  // deploy-triggered effect produced above (this card's own 【Deploy】
  // text) has resolved. Inherits the parent move's id via ambient
  // `g.pendingEffectCurrentMoveId`.
  enqueueMoveCompletionFence(ctx.G, ownerId, ctx.framework, [
    {
      kind: "emitEvent",
      event: {
        kind: isBase ? "BASE_DEPLOYED" : "UNIT_DEPLOYED",
        payload: { cardId: sourceCardId, playerId: ownerId },
      },
    },
  ]);
}

// =============================================================================
// Deploy Token
// =============================================================================

export function handleDeployTokenAction(
  token: TokenSpec,
  count: number,
  ctx: EffectExecutionContext,
): void {
  const tokenSpec = cloneTokenSpec(token);
  for (let i = 0; i < count; i++) {
    const tokenId = `token_${tokenSpec.name.toLowerCase().replace(/\s+/g, "_")}_${++tokenCounter}`;

    // Build the registered definition from the inline TokenSpec so
    // gameplay-relevant fields (ap/hp/traits/keywordEffects) always come
    // from the source card's TokenSpec, not silently from a substituted
    // catalog entry. When the TokenSpec names a printed token card, we
    // *only* inherit `cardNumber` (so the simulator's CDN image pipeline
    // resolves real artwork at `/cards/t/<T-NNN>.webp`) and `color` (so
    // the card frame tints to the printed faction colour). Everything
    // else stays derived from TokenSpec — keeps token semantics intact
    // even if a printed def's other fields drift.
    const printed = tokenSpec.printedCardNumber
      ? TOKEN_PRINTINGS[tokenSpec.printedCardNumber]
      : undefined;
    const effects: CardEffect[] = tokenSpec.cantTargetPlayer
      ? [
          {
            type: "constant",
            activation: {},
            directives: [
              {
                action: {
                  action: "cantTargetPlayer",
                  whose: "opponent",
                },
              },
            ],
            sourceText: "This Unit can't choose the enemy player as its attack target.",
          },
        ]
      : [];
    const definition: UnitCard = {
      cardNumber: printed?.cardNumber ?? tokenId,
      color: printed?.color,
      name: tokenSpec.name,
      type: "unit",
      cost: 0,
      traits: tokenSpec.traits,
      level: 0,
      keywordEffects: tokenSpec.keywordEffects ?? [],
      rarity: "common",
      ap: tokenSpec.ap,
      hp: tokenSpec.hp,
      effects,
    };

    ctx.framework.cards.registerDefinition(tokenId, definition, ctx.sourcePlayerId as PlayerId);

    ctx.framework.cards.patchMeta(tokenId, { isToken: true, tokenSpec });

    ctx.framework.zones.moveCard(tokenId, { zone: "battleArea", playerId: ctx.sourcePlayerId });

    // Rule 3-2-4: a unit cannot attack the turn it is deployed. Tokens are
    // units (rule 3-1-7-1) and are not Link Units, so they have no exemption.
    // Track the deploy on `deployedThisTurn` so `canAttack` blocks them on
    // the same turn — every other deploy path (deploy-unit move,
    // handleDeployAction, handleDeploySelfAction, handleDeployFromTrashAction)
    // does this; the token handler was the outlier.
    ctx.G.turnMetadata.deployedThisTurn.push(tokenId);
    ctx.framework.cards.patchMeta(tokenId, { deployedThisTurn: true });

    if (tokenSpec.deployState === "rested") {
      ctx.G.exhausted[tokenId] = true;
      ctx.framework.cards.patchMeta(tokenId, { exhausted: true });
    }

    // Placement event (synchronous) — see `handleDeployAction`. Tokens
    // currently never carry own-card 【Deploy】 triggers (TokenSpec has
    // no effects field), so the fence resolves with no intervening
    // triggers — but routing the event through the fence keeps the
    // contract uniform across all deploy paths.
    emitGundamEvent(ctx.framework.events, {
      kind: "UNIT_PLACED",
      payload: { cardId: tokenId, playerId: ctx.sourcePlayerId, isToken: true, token: tokenSpec },
    });
    enqueueMoveCompletionFence(ctx.G, ctx.sourcePlayerId, ctx.framework, [
      {
        kind: "emitEvent",
        event: {
          kind: "UNIT_DEPLOYED",
          payload: {
            cardId: tokenId,
            playerId: ctx.sourcePlayerId,
            isToken: true,
            token: tokenSpec,
          },
        },
      },
    ]);
  }
}

function cloneTokenSpec(token: TokenSpec): TokenSpec {
  return {
    name: token.name,
    traits: [...token.traits],
    ap: token.ap,
    hp: token.hp,
    ...(token.keywordEffects
      ? { keywordEffects: token.keywordEffects.map((entry) => ({ ...entry })) }
      : {}),
    ...(token.cantTargetPlayer !== undefined ? { cantTargetPlayer: token.cantTargetPlayer } : {}),
    deployState: token.deployState,
    ...(token.printedCardNumber ? { printedCardNumber: token.printedCardNumber } : {}),
  };
}
