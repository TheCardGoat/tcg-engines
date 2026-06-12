import type {
  Effect,
  DefeatEffect,
  SpendEffect,
  ReturnToHandEffect,
  DrawEffect,
  ModifyGigEffect,
  AdjustGigEffect,
  ModifyPowerEffect,
  MultiplyPowerEffect,
  GrantRuleEffect,
  ReadyEffect,
  ReadyEddiesEffect,
  LookAtEffect,
  SearchDeckEffect,
  DiscardFromHandEffect,
  MoveCardEffect,
  PlayCardEffect,
  AttachCardEffect,
  RemoveFromGameEffect,
  StealGigEffect,
  TrashFromDeckEffect,
  IfYouDoEffect,
  DelayedEffect,
  DefeatAtEndOfTurnIfAttacksEffect,
  CopyGigValueEffect,
  ForEachFriendlyGigPairEffect,
  CallLegendEffect,
  GrantCostModifierEffect,
  TargetDSL,
} from "@tcg/cyberpunk-types";
import type { CardZone } from "@tcg/cyberpunk-types";
import type { Operations } from "../../operations/index.ts";
import type { ResolutionContext } from "../target-resolver.ts";
import { resolveTarget, resolveNumericValue, countFriendlyGigPairs } from "../target-resolver.ts";
import type { CardInstanceId, GigDieId, PlayerId } from "../../types/branded.ts";
import { DIE_MAX_VALUES } from "../../types/gig-die.ts";
import { defOf } from "../../state/lookups.ts";
import { createDefaultMetaForZone } from "../../types/card-instance.ts";

export type EffectHandlerResult =
  | { status: "resolved" }
  | { status: "noAction" }
  | { status: "suspended"; pendingChoice: unknown }
  | { status: "partial"; remaining: Effect[] };

export type EffectHandler<E> = (
  effect: E,
  ctx: ResolutionContext,
  ops: Operations,
) => EffectHandlerResult;

function warnMissingPlayerState(handler: string, playerId: PlayerId, ctx: ResolutionContext): void {
  console.warn("[cyberpunk-engine] effect handler skipped missing player state", {
    handler,
    playerId,
    sourceCardId: ctx.sourceCardId,
    sourcePlayerId: ctx.sourcePlayerId,
    abilityIndex: ctx.abilityIndex,
  });
}

function handleDefeat(
  effect: DefeatEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  for (const id of targets) {
    ops.card.detachGear(id as CardInstanceId);
    ops.card.moveAttachedGear(id as CardInstanceId, "trash");
    ops.zone.moveCard(id as CardInstanceId, "trash");

    // GO SOLO: if the card leaves the field, remove it from the game.
    const card = ctx.state.G.cardIndex[id as string];
    if (card) {
      const def = defOf(card);
      if (def.keywords?.includes("goSolo")) {
        const player = ctx.state.G.players[card.controllerId as string];
        if (player) {
          const idx = player.zones.trash.indexOf(id as CardInstanceId);
          if (idx !== -1) player.zones.trash.splice(idx, 1);
        }
        delete ctx.state.G.cardIndex[id as string];
      }
    }
  }
  return { status: "resolved" };
}

function handleSpend(
  effect: SpendEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  for (const id of targets) {
    ops.card.spend(id as CardInstanceId);
  }
  return { status: "resolved" };
}

function handleReturnToHand(
  effect: ReturnToHandEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  for (const id of targets) {
    const card = ctx.state.G.cardIndex[id];
    if (!card) continue;
    ops.card.moveAttachedGear(id as CardInstanceId, "trash");
    ops.zone.moveCard(id as CardInstanceId, "hand", card.ownerId);
  }
  return { status: "resolved" };
}

function resolveRelativePlayer(relative: string | undefined, ctx: ResolutionContext): PlayerId {
  if (!relative || relative === "friendly" || relative === "owner") return ctx.sourcePlayerId;
  if (relative === "rival") {
    return ctx.state.ctx.playerIds.find((id) => id !== ctx.sourcePlayerId)!;
  }
  return ctx.sourcePlayerId;
}

function handleDraw(
  effect: DrawEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const playerId = resolveRelativePlayer(effect.player, ctx);
  ops.zone.drawCards(playerId, effect.amount);
  return { status: "resolved" };
}

function handleModifyGig(
  effect: ModifyGigEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  for (const id of targets) {
    const die = ctx.state.G.gigDice[id];
    if (!die) continue;
    let value = effect.value;
    if (effect.operation === "increase") value = die.faceValue + value;
    else if (effect.operation === "decrease") value = die.faceValue - value;
    const maxVal = DIE_MAX_VALUES[die.dieType];
    value = Math.min(Math.max(value, 1), maxVal);
    ops.gig.setGigValue(id as any, value);
  }
  return { status: "resolved" };
}

function handleAdjustGig(
  effect: AdjustGigEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  for (const id of targets) {
    const die = ctx.state.G.gigDice[id];
    if (!die) continue;
    ops.game.setPendingChoice({
      type: "chooseTarget",
      chooserId: ctx.sourcePlayerId,
      effectId: id,
      payload: {
        type: "adjustGig",
        dieId: id as GigDieId,
        direction: effect.direction,
        maxAmount: effect.maxAmount,
        chooseUpTo: effect.chooseUpTo,
      },
    });
    return { status: "suspended", pendingChoice: { dieId: id, effect } };
  }
  return { status: "resolved" };
}

function handleModifyPower(
  effect: ModifyPowerEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  const value = resolveNumericValue(effect.value, ctx);
  for (const id of targets) {
    if (effect.duration === "permanent") {
      ops.card.setMeta(id as CardInstanceId, {
        powerModifier: (ctx.state.G.cardIndex[id]?.meta.powerModifier ?? 0) + value,
      });
    } else {
      ops.game.addActiveEffect({
        id: `e${ctx.state.G.nextEffectId}`,
        sourceCardId: ctx.sourceCardId,
        targetCardId: id as CardInstanceId,
        kind: "powerModifier",
        powerModifier: value,
        duration: effect.duration as "turn" | "continuous",
        origin: "imperative",
        abilityIndex: ctx.abilityIndex,
      });
    }
  }
  return { status: "resolved" };
}

function handleMultiplyPower(
  effect: MultiplyPowerEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  for (const id of targets) {
    if (effect.duration === "permanent") {
      const card = ctx.state.G.cardIndex[id as string];
      const currentMod = card?.meta.powerMultiplier ?? 1;
      ops.card.setMeta(id as CardInstanceId, {
        powerMultiplier: currentMod * effect.multiplier,
      });
    } else {
      ops.game.addActiveEffect({
        id: `e${ctx.state.G.nextEffectId}`,
        sourceCardId: ctx.sourceCardId,
        targetCardId: id as CardInstanceId,
        kind: "powerMultiplier",
        powerMultiplier: effect.multiplier,
        duration: effect.duration as "turn" | "continuous",
        origin: "imperative",
        abilityIndex: ctx.abilityIndex,
      });
    }
  }
  return { status: "resolved" };
}

function handleGrantRule(
  effect: GrantRuleEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  const sourceCard = ctx.state.G.cardIndex[ctx.sourceCardId as string];
  const sourceCardName = sourceCard ? defOf(sourceCard).displayName : "That effect";
  const targetNames = targets
    .map((id) => {
      const card = ctx.state.G.cardIndex[id as string];
      return card ? defOf(card).displayName : null;
    })
    .filter((name): name is string => Boolean(name))
    .join(", ");
  for (const id of targets) {
    ops.game.addActiveEffect({
      id: `e${ctx.state.G.nextEffectId}`,
      sourceCardId: ctx.sourceCardId,
      targetCardId: id as CardInstanceId,
      kind: "grantRule",
      rule: effect.rule,
      duration: effect.duration,
      ...(effect.duration === "untilSourceNextTurn"
        ? { expiresAtStartOfTurnForPlayerId: ctx.sourcePlayerId }
        : {}),
      origin: "imperative",
      abilityIndex: ctx.abilityIndex,
    });
  }
  if (effect.rule === "cantAttack" && targetNames) {
    ops.event.emit({
      type: "actionLog",
      messageKey: "trigger.grantRule.cantAttack",
      params: {
        sourceCardName,
        targetNames,
      },
      playerId: ctx.sourcePlayerId,
      category: "trigger",
      cardIds: [ctx.sourceCardId as string, ...targets.map((id) => id as string)],
    });
  }
  return { status: "resolved" };
}

function handleGrantCostModifier(
  effect: GrantCostModifierEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const playerId = resolveRelativePlayer(effect.player, ctx);
  ops.game.addActiveEffect({
    id: `e${ctx.state.G.nextEffectId}`,
    sourceCardId: ctx.sourceCardId,
    targetCardId: ctx.sourceCardId,
    kind: "costModifier",
    costModifier: effect.modifier,
    appliesTo: effect.appliesTo,
    playerId,
    remainingUses: effect.uses,
    duration: effect.duration,
    origin: "imperative",
    abilityIndex: ctx.abilityIndex,
  });
  return { status: "resolved" };
}

function handleDefeatAtEndOfTurnIfAttacks(
  effect: DefeatAtEndOfTurnIfAttacksEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  for (const id of targets) {
    ops.game.addActiveEffect({
      id: `e${ctx.state.G.nextEffectId}`,
      sourceCardId: ctx.sourceCardId,
      targetCardId: id as CardInstanceId,
      kind: "defeatAtEndOfTurnIfAttacked",
      duration: "turn",
      origin: "imperative",
      abilityIndex: ctx.abilityIndex,
      triggered: false,
    });
  }
  return targets.length > 0 ? { status: "resolved" } : { status: "noAction" };
}

function handleReady(
  effect: ReadyEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  for (const id of targets) {
    ops.card.ready(id as CardInstanceId);
  }
  return { status: "resolved" };
}

function handleReadyEddies(
  effect: ReadyEddiesEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const playerId = resolveRelativePlayer(effect.player, ctx);
  const player = ctx.state.G.players[playerId as string];
  if (!player) return { status: "resolved" };
  const amount = Math.min(effect.amount, player.spentEddies ?? 0);
  if (amount <= 0) return { status: "resolved" };
  player.spentEddies -= amount;
  player.eddies += amount;
  ops.event.emit({ type: "eddiesGained", playerId, amount });
  return { status: "resolved" };
}

function handleLookAt(
  effect: LookAtEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  ops.event.emit({
    type: "cardsRevealed",
    cardIds: targets as CardInstanceId[],
    playerId: ctx.sourcePlayerId,
  });
  return { status: "resolved" };
}

function handleSearchDeck(
  effect: SearchDeckEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const playerId = resolveRelativePlayer(effect.player, ctx);
  const player = ctx.state.G.players[playerId as string];
  const lookCount = Math.min(effect.lookCount, player?.zones.deck.length ?? 0);
  const revealedCardIds = player?.zones.deck.slice(0, lookCount) ?? [];

  // Emit reveal log with card IDs for UI visibility
  ops.event.emit({
    type: "actionLog",
    messageKey: "move.searchDeck.reveal",
    params: { count: lookCount },
    playerId,
    category: "search",
    cardIds: revealedCardIds.map((id) => id as string),
  });

  // When select.kind === "all", auto-select all cards that match the target filter
  // instead of presenting a player choice.
  if (effect.select.kind === "all") {
    const matchingCardIds = resolveTarget(effect.target, ctx);
    const matchingSet = new Set(matchingCardIds);
    const revealedSet = new Set(revealedCardIds.map((id) => id as string));

    const selectedIds = matchingCardIds.filter((id) => revealedSet.has(id));
    const remainderIds = revealedCardIds.filter((id) => !matchingSet.has(id as string));

    // Remove all revealed cards from deck
    for (const cardId of revealedCardIds) {
      const idx = player!.zones.deck.indexOf(cardId);
      if (idx !== -1) player!.zones.deck.splice(idx, 1);
    }

    const destination = effect.destination ?? "hand";

    // Move matching cards to destination
    for (const cardId of selectedIds) {
      const card = ctx.state.G.cardIndex[cardId];
      if (!card) continue;
      card.zone = destination as any;
      card.meta = createDefaultMetaForZone(destination as CardZone);
      player!.zones[destination as keyof typeof player.zones].push(cardId as CardInstanceId);
    }

    // Handle remainder
    const remainderZone = effect.remainder?.zone ?? "deckBottom";
    if (remainderZone === "trash") {
      for (const cardId of remainderIds) {
        const card = ctx.state.G.cardIndex[cardId as string];
        if (card) {
          card.zone = "trash" as any;
          card.meta = createDefaultMetaForZone("trash");
        }
        player!.zones.trash.push(cardId);
      }
    } else {
      for (const cardId of remainderIds) {
        player!.zones.deck.push(cardId);
      }
    }

    ops.event.emit({
      type: "searchPerformed",
      playerId,
      zone: "deck",
      found: selectedIds.length,
    });

    ops.event.emit({
      type: "actionLog",
      messageKey: "move.resolveSearchDeck",
      params: {
        count: selectedIds.length,
        looked: revealedCardIds.length,
      },
      playerId,
      category: "search",
      cardIds: selectedIds,
    });

    return { status: "resolved" };
  }

  ops.game.setPendingChoice({
    type: "searchDeck",
    chooserId: playerId,
    effectId: "",
    payload: {
      ...effect,
      revealedCardIds,
      sourceCardId: ctx.sourceCardId,
      sourcePlayerId: ctx.sourcePlayerId,
    },
  });

  return { status: "suspended", pendingChoice: effect };
}

function handleDiscardFromHand(
  effect: DiscardFromHandEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const playerId = resolveRelativePlayer(effect.player, ctx);
  const player = ctx.state.G.players[playerId as string];
  if (!player) {
    warnMissingPlayerState("handleDiscardFromHand", playerId, ctx);
    return { status: "resolved" };
  }
  const eligibleIds = effect.target
    ? resolveTarget(effect.target, ctx).filter((id) =>
        player.zones.hand.includes(id as CardInstanceId),
      )
    : player.zones.hand.map((id) => id as string);
  if (eligibleIds.length < effect.amount) return { status: "noAction" };
  if (effect.amount > 1 || eligibleIds.length > effect.amount) {
    ops.game.setPendingChoice({
      type: "chooseTarget",
      chooserId: playerId,
      effectId: "",
      payload: {
        type: "discardFromHand",
        amount: effect.amount,
        player: effect.player,
        targetKind: "card",
        eligibleIds,
      },
    });
    return { status: "suspended", pendingChoice: effect };
  }
  for (let i = 0; i < effect.amount; i++) {
    const cardId = eligibleIds[i];
    if (!cardId) break;
    ops.zone.moveCard(cardId as CardInstanceId, "trash", playerId);
  }
  return { status: "resolved" };
}

function handleMoveCard(
  effect: MoveCardEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);

  // Optional move with attachTo: create a pending choice for the player to select one card.
  if (effect.optional && effect.attachTo) {
    if (targets.length === 0) return { status: "noAction" };
    const attachTargets = resolveTarget(
      effect.attachTo as import("@tcg/cyberpunk-types").TargetDSL,
      ctx,
    );
    const resolvedAttachToId = attachTargets[0];
    if (!resolvedAttachToId) return { status: "noAction" };

    ops.game.setPendingChoice({
      type: "chooseCardToMove",
      chooserId: ctx.sourcePlayerId,
      effectId: "",
      payload: {
        cardIds: targets as CardInstanceId[],
        resolvedAttachToId,
        boundTargets: ctx.boundTargets,
        sourceCardId: ctx.sourceCardId,
        sourcePlayerId: ctx.sourcePlayerId,
        abilityIndex: ctx.abilityIndex,
        ifEffects: [],
        elseEffects: [],
        canDecline: true,
      },
    });
    return { status: "suspended", pendingChoice: effect };
  }

  if (effect.optional) {
    if (targets.length === 0) return { status: "noAction" };

    ops.game.setPendingChoice({
      type: "chooseCardToMove",
      chooserId: ctx.sourcePlayerId,
      effectId: "",
      payload: {
        cardIds: targets as CardInstanceId[],
        destination: effect.destination,
        boundTargets: ctx.boundTargets,
        sourceCardId: ctx.sourceCardId,
        sourcePlayerId: ctx.sourcePlayerId,
        abilityIndex: ctx.abilityIndex,
        ifEffects: [],
        elseEffects: [],
        canDecline: true,
      },
    });
    return { status: "suspended", pendingChoice: effect };
  }

  for (const id of targets) {
    const card = ctx.state.G.cardIndex[id];
    if (!card) continue;
    if (card.meta.attachedToId) ops.card.detachGear(id as CardInstanceId);
    if (effect.destination === "deckBottom") {
      // Remove from current zone, then append to the bottom of the owner's deck.
      const owner = card.ownerId;
      const fromZone = card.zone;
      const player = ctx.state.G.players[owner as string];
      if (player) {
        const fromList = player.zones[card.zone];
        const idx = fromList.indexOf(id as CardInstanceId);
        if (idx !== -1) fromList.splice(idx, 1);
      }
      ops.zone.moveCardsToBottom(owner, [id as CardInstanceId]);
      card.zone = "deck";
      card.meta = createDefaultMetaForZone("deck");
      ops.event.emit({
        type: "cardMoved",
        cardId: id as CardInstanceId,
        fromZone,
        toZone: "deck",
        playerId: owner,
      } as any);
    } else {
      ops.zone.moveCard(id as CardInstanceId, effect.destination as CardZone, card.ownerId);
    }
    if (effect.attachTo) {
      const attachTargets = resolveTarget(
        effect.attachTo as import("@tcg/cyberpunk-types").TargetDSL,
        ctx,
      );
      const resolvedAttachToId = attachTargets[0];
      if (resolvedAttachToId)
        ops.card.attachGear(id as CardInstanceId, resolvedAttachToId as CardInstanceId);
    }
  }
  return { status: "resolved" };
}

function handlePlayCard(
  effect: PlayCardEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  if (targets.length === 0) return { status: "resolved" };

  // Resolve the bound attachTo target eagerly while the binding context is available.
  // The pending choice is resolved later (via resolveCardToPlay move) when the binding
  // context is no longer present, so we store the concrete ID here.
  let resolvedAttachToId: string | undefined;
  if (effect.attachTo) {
    const attachTargets = resolveTarget(
      effect.attachTo as import("@tcg/cyberpunk-types").TargetDSL,
      ctx,
    );
    resolvedAttachToId = attachTargets[0];
  }

  ops.game.setPendingChoice({
    type: "chooseCardToPlay",
    chooserId: ctx.sourcePlayerId,
    effectId: "",
    payload: {
      cardIds: targets as CardInstanceId[],
      free: effect.free,
      attachTo: effect.attachTo,
      resolvedAttachToId,
    },
  });
  return { status: "suspended", pendingChoice: effect };
}

function handleAttachCard(
  effect: AttachCardEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  // `attachCard` is the explicit equip semantic that `playCard + attachTo`
  // expresses by overload. Same runtime — same chooseCardToPlay pending
  // choice — but a distinct DSL surface so card authors don't have to
  // know that "play with an attach target" means "equip."
  const targets = resolveTarget(effect.target, ctx);
  if (targets.length === 0) return { status: "resolved" };

  const attachTargets = resolveTarget(effect.attachTo, ctx);
  const resolvedAttachToId = attachTargets[0];
  if (!resolvedAttachToId) return { status: "resolved" };

  ops.game.setPendingChoice({
    type: "chooseCardToPlay",
    chooserId: ctx.sourcePlayerId,
    effectId: "",
    payload: {
      cardIds: targets as CardInstanceId[],
      free: effect.free,
      attachTo: effect.attachTo,
      resolvedAttachToId,
    },
  });
  return { status: "suspended", pendingChoice: effect };
}

function handleRemoveFromGame(
  effect: RemoveFromGameEffect,
  ctx: ResolutionContext,
  _ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  for (const id of targets) {
    const card = ctx.state.G.cardIndex[id];
    if (!card) continue;
    const player = ctx.state.G.players[card.controllerId as string];
    if (player) {
      const idx = player.zones[card.zone].indexOf(id as CardInstanceId);
      if (idx !== -1) player.zones[card.zone].splice(idx, 1);
    }
    delete ctx.state.G.cardIndex[id];
  }
  return { status: "resolved" };
}

function handleStealGig(
  effect: StealGigEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const targets = resolveTarget(effect.target, ctx);
  for (const id of targets) {
    ops.gig.moveGig(id as any, ctx.sourcePlayerId);
  }
  if (targets.length > 0) {
    const sourceCard = ctx.state.G.cardIndex[ctx.sourceCardId as string];
    const cardName = sourceCard ? defOf(sourceCard).displayName : "Unknown card";
    const dieTypes = [
      ...new Set(
        targets
          .map((id) => ctx.state.G.gigDice[id])
          .filter(Boolean)
          .map((die) => die.dieType),
      ),
    ].join(", ");
    ops.event.emit({
      type: "actionLog",
      messageKey: "trigger.stealGig",
      params: {
        cardName,
        count: targets.length,
        dieTypes,
        gigWord: targets.length === 1 ? "Gig" : "Gigs",
      },
      playerId: ctx.sourcePlayerId,
      category: "trigger",
      cardIds: [ctx.sourceCardId as string],
    });
  }
  return { status: "resolved" };
}

function handleTrashFromDeck(
  effect: TrashFromDeckEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const playerId = resolveRelativePlayer(effect.player, ctx);
  const player = ctx.state.G.players[playerId as string];
  if (!player) {
    warnMissingPlayerState("handleTrashFromDeck", playerId, ctx);
    return { status: "resolved" };
  }
  const count = Math.min(effect.amount, player.zones.deck.length);
  for (let i = 0; i < count; i++) {
    const cardId = player.zones.deck.shift();
    if (!cardId) break;
    ops.zone.moveCard(cardId, "trash", playerId);
  }
  return { status: "resolved" };
}

function handleIfYouDo(
  effect: IfYouDoEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  // When the doEffect is an optional moveCard without attachTo (e.g. "You may discard a
  // Program"), we must give the player a choice instead of auto-executing. Create a
  // chooseCardToMove pending choice that the player can accept or decline, carrying the
  // ifEffects/elseEffects for later resolution.
  const doEffect = effect.doEffect;
  if (
    doEffect.optional &&
    doEffect.effect === "moveCard" &&
    !("attachTo" in doEffect && (doEffect as any).attachTo)
  ) {
    const targets =
      "target" in doEffect && doEffect.target ? resolveTarget((doEffect as any).target, ctx) : [];
    if (targets.length === 0) {
      // No valid targets for the optional action → treat as declined.
      const remaining = effect.elseEffects ? [...effect.elseEffects] : [];
      if (remaining.length > 0) {
        return { status: "partial", remaining };
      }
      return { status: "resolved" };
    }

    ops.game.setPendingChoice({
      type: "chooseCardToMove",
      chooserId: ctx.sourcePlayerId,
      effectId: "",
      payload: {
        cardIds: targets as CardInstanceId[],
        destination: (doEffect as any).destination,
        boundTargets: ctx.boundTargets,
        sourceCardId: ctx.sourceCardId,
        sourcePlayerId: ctx.sourcePlayerId,
        abilityIndex: ctx.abilityIndex,
        ifEffects: [...effect.ifEffects],
        elseEffects: effect.elseEffects ? [...effect.elseEffects] : [],
        canDecline: true,
      },
    });
    return { status: "resolved" };
  }

  if (doEffect.optional && doEffect.effect === "defeat") {
    const targets = resolveTarget(doEffect.target, ctx);
    if (targets.length === 0) {
      const remaining = effect.elseEffects ? [...effect.elseEffects] : [];
      if (remaining.length > 0) {
        return { status: "partial", remaining };
      }
      return { status: "resolved" };
    }

    ops.game.setPendingChoice({
      type: "chooseCardToMove",
      chooserId: ctx.sourcePlayerId,
      effectId: "",
      payload: {
        cardIds: targets as CardInstanceId[],
        destination: "trash",
        boundTargets: ctx.boundTargets,
        sourceCardId: ctx.sourceCardId,
        sourcePlayerId: ctx.sourcePlayerId,
        abilityIndex: ctx.abilityIndex,
        ifEffects: [...effect.ifEffects],
        elseEffects: effect.elseEffects ? [...effect.elseEffects] : [],
        canDecline: true,
      },
    });
    return { status: "resolved" };
  }

  if (doEffect.optional && doEffect.effect === "discardFromHand") {
    const playerId = resolveRelativePlayer(doEffect.player, ctx);
    const player = ctx.state.G.players[playerId as string];
    if (!player) return { status: "resolved" };
    const eligibleIds = doEffect.target
      ? resolveTarget(doEffect.target, ctx).filter((id) =>
          player.zones.hand.includes(id as CardInstanceId),
        )
      : player.zones.hand.map((id) => id as string);

    if (eligibleIds.length < doEffect.amount) {
      const remaining = effect.elseEffects ? [...effect.elseEffects] : [];
      if (remaining.length > 0) {
        return { status: "partial", remaining };
      }
      return { status: "resolved" };
    }

    ops.game.setPendingChoice({
      type: "chooseTarget",
      chooserId: playerId,
      effectId: "",
      payload: {
        type: "discardFromHand",
        amount: doEffect.amount,
        player: doEffect.player,
        targetKind: "card",
        eligibleIds,
        canDecline: true,
        sourceCardId: ctx.sourceCardId,
        sourcePlayerId: ctx.sourcePlayerId,
        abilityIndex: ctx.abilityIndex,
        ifEffects: [...effect.ifEffects],
        elseEffects: effect.elseEffects ? [...effect.elseEffects] : [],
        contextTargets: ctx.contextTargets,
        boundTargets: ctx.boundTargets,
      },
    });
    return { status: "resolved" };
  }

  const doResult = resolveEffect(effect.doEffect, ctx, ops);
  if (doResult.status === "resolved") {
    if (effect.ifEffects.length > 0) {
      return { status: "partial", remaining: [...effect.ifEffects] };
    }
    return { status: "resolved" };
  }
  if (doResult.status === "noAction") {
    const remaining = effect.elseEffects ? [...effect.elseEffects] : [];
    if (remaining.length > 0) {
      return { status: "partial", remaining };
    }
    return { status: "resolved" };
  }
  if (doResult.status === "suspended") {
    // Store ifEffects/elseEffects in the pending choice so the resolver can execute them.
    const pendingChoice = ctx.state.G.turnMetadata.pendingChoice;
    if (pendingChoice && pendingChoice.type === "chooseCardToMove") {
      pendingChoice.payload.ifEffects = [...effect.ifEffects];
      pendingChoice.payload.elseEffects = effect.elseEffects ? [...effect.elseEffects] : [];
    }
    return { status: "resolved" };
  }
  return doResult;
}

function handleCopyGigValue(
  effect: CopyGigValueEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const sourceIds = resolveTarget(effect.source, ctx);
  const targetIds = resolveTarget(effect.target, ctx);
  if (sourceIds.length === 0 || targetIds.length === 0) return { status: "noAction" };
  const sourceDie = ctx.state.G.gigDice[sourceIds[0]!];
  if (!sourceDie) return { status: "noAction" };
  const sourceCard = ctx.state.G.cardIndex[ctx.sourceCardId as string];
  const sourceCardName = sourceCard ? defOf(sourceCard).displayName : "That effect";
  const sourceDieType = sourceDie.dieType.toUpperCase();
  for (const id of targetIds) {
    const targetDie = ctx.state.G.gigDice[id];
    if (!targetDie) continue;
    const previousValue = targetDie.faceValue;
    const maxVal = DIE_MAX_VALUES[targetDie.dieType];
    const value = Math.min(Math.max(sourceDie.faceValue, 1), maxVal);
    ops.gig.setGigValue(id as GigDieId, value);
    const targetDieType = targetDie.dieType.toUpperCase();
    const capped = sourceDie.faceValue > maxVal;
    ops.event.emit({
      type: "actionLog",
      messageKey: capped ? "trigger.copyGigValueCapped" : "trigger.copyGigValue",
      params: {
        sourceCardName,
        sourceDieType,
        sourceValue: sourceDie.faceValue,
        targetDieType,
        targetMax: maxVal,
        previousValue,
        newValue: value,
        resultText: previousValue === value ? `stayed at ${value}` : `became ${value}`,
      },
      playerId: ctx.sourcePlayerId,
      category: "trigger",
      cardIds: [ctx.sourceCardId as string],
    });
  }
  return { status: "resolved" };
}

function handleForEachFriendlyGigPair(
  effect: ForEachFriendlyGigPairEffect,
  ctx: ResolutionContext,
  _ops: Operations,
): EffectHandlerResult {
  const pairCount = countFriendlyGigPairs(ctx);
  if (pairCount <= 0 || effect.effects.length === 0) return { status: "noAction" };
  const repeatedEffect = collapseRepeatedSelectableEffect(effect.effects, ctx, pairCount);
  if (repeatedEffect) {
    return { status: "partial", remaining: [repeatedEffect] };
  }
  const remaining: Effect[] = [];
  for (let i = 0; i < pairCount; i += 1) {
    remaining.push(...effect.effects);
  }
  return { status: "partial", remaining };
}

function handleCallLegend(
  effect: CallLegendEffect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  const playerId = resolveRelativePlayer(effect.player, ctx);
  const player = ctx.state.G.players[playerId as string];
  if (!player) {
    warnMissingPlayerState("handleCallLegend", playerId, ctx);
    return { status: "noAction" };
  }
  if (player.calledLegendThisTurn) return { status: "noAction" };

  const targets = resolveTarget(effect.target, ctx).filter((id) => {
    const card = ctx.state.G.cardIndex[id];
    return card?.meta.faceDown && card.controllerId === playerId;
  });
  const legendId = targets[0] as CardInstanceId | undefined;
  if (!legendId) return { status: "noAction" };
  const sourceCard = ctx.state.G.cardIndex[ctx.sourceCardId as string];
  const sourceCardName = sourceCard ? defOf(sourceCard).displayName : "That effect";
  const legend = ctx.state.G.cardIndex[legendId as string];
  const legendName = legend ? defOf(legend).displayName : "a Legend";

  ops.card.setMeta(legendId, { faceDown: false });
  ops.game.markCalledLegendThisTurn(playerId);
  ops.event.emit({
    type: "actionLog",
    messageKey: effect.free ? "effect.callLegend.free" : "move.callLegend",
    params: effect.free ? { sourceCardName, legendName } : { legendName },
    playerId,
    category: "trigger",
    cardIds: [ctx.sourceCardId as string, legendId as string],
  });
  ops.event.emit({
    type: "legendFlipped",
    cardId: legendId,
    playerId,
  });
  ops.event.emit({
    type: "legendCalled",
    cardId: legendId,
    playerId,
  });

  return { status: "resolved" };
}

function collapseRepeatedSelectableEffect(
  effects: readonly Effect[],
  ctx: ResolutionContext,
  pairCount: number,
): Effect | null {
  if (effects.length !== 1) return null;
  const effect = effects[0]!;
  if (!("target" in effect) || !effect.target) return null;
  const target = effect.target as TargetDSL;
  if (target.selector !== "card" && target.selector !== "gig") return null;
  if (target.selection?.mode !== "choose") return null;

  const maxTargets = Math.min(pairCount, resolveTarget(target, ctx).length);
  if (maxTargets <= 0) return null;
  return {
    ...effect,
    target: {
      ...target,
      selection: {
        ...target.selection,
        min: maxTargets,
        max: maxTargets,
      },
    },
  } as Effect;
}

function handleDelayed(
  effect: DelayedEffect,
  ctx: ResolutionContext,
  _ops: Operations,
): EffectHandlerResult {
  if (effect.timing === "endOfTurn") {
    // Snapshot resolved bound targets so they survive until end of turn
    const resolvedBindings: Record<string, string[]> = {};
    if (ctx.boundTargets) {
      for (const [key, ids] of Object.entries(ctx.boundTargets)) {
        resolvedBindings[key] = [...ids];
      }
    }
    _ops.game.addBagEntry({
      // Deterministic id: sourceCardId + the engine's monotonic stateID
      // (bumped once per processed command). The bag length disambiguates the
      // rare case where the same source schedules >1 delayed effect within a
      // single command resolution.
      id: `delayed-${ctx.sourceCardId}-${ctx.state.ctx.stateID}-${ctx.state.G.effectBag.length}`,
      sourceCardId: ctx.sourceCardId,
      sourcePlayerId: ctx.sourcePlayerId,
      effectIndex: -1,
      abilityText: "delayed",
      suspended: false,
      delayedEffects: effect.effects,
      resolvedBindings,
    });
  }
  return { status: "resolved" };
}

/**
 * Strictly typed against `Effect["effect"]` so adding a new effect kind to
 * the union without registering a handler fails compile (TS error: missing
 * property). Each handler is correspondingly typed against the matching
 * effect variant via `Extract`.
 */
type EffectHandlerRegistry = {
  [K in Effect["effect"]]: EffectHandler<Extract<Effect, { effect: K }>>;
};

export const effectHandlers: EffectHandlerRegistry = {
  defeat: handleDefeat,
  spend: handleSpend,
  returnToHand: handleReturnToHand,
  draw: handleDraw,
  modifyGig: handleModifyGig,
  adjustGig: handleAdjustGig,
  modifyPower: handleModifyPower,
  multiplyPower: handleMultiplyPower,
  grantRule: handleGrantRule,
  ready: handleReady,
  readyEddies: handleReadyEddies,
  lookAt: handleLookAt,
  searchDeck: handleSearchDeck,
  discardFromHand: handleDiscardFromHand,
  moveCard: handleMoveCard,
  playCard: handlePlayCard,
  attachCard: handleAttachCard,
  removeFromGame: handleRemoveFromGame,
  stealGig: handleStealGig,
  trashFromDeck: handleTrashFromDeck,
  ifYouDo: handleIfYouDo,
  delayed: handleDelayed,
  defeatAtEndOfTurnIfAttacks: handleDefeatAtEndOfTurnIfAttacks,
  copyGigValue: handleCopyGigValue,
  forEachFriendlyGigPair: handleForEachFriendlyGigPair,
  callLegend: handleCallLegend,
  grantCostModifier: handleGrantCostModifier,
};

export function resolveEffect(
  effect: Effect,
  ctx: ResolutionContext,
  ops: Operations,
): EffectHandlerResult {
  if (effect.effect === "callLegend") {
    const playerId = resolveRelativePlayer(effect.player, ctx);
    const player = ctx.state.G.players[playerId as string];
    if (!player) {
      warnMissingPlayerState("resolveEffect.callLegend", playerId, ctx);
      return { status: "noAction" };
    }
    if (player.calledLegendThisTurn) return { status: "noAction" };
  }

  if ("target" in effect && effect.target) {
    const target = effect.target as TargetDSL;
    const selection =
      target.selector === "card" || target.selector === "gig" ? target.selection : undefined;
    if (selection) {
      const targets = resolveTarget(target, ctx);
      const { min, max } = selection;
      if (targets.length < min) return { status: "noAction" };
      ops.game.setPendingChoice({
        type: "chooseTarget",
        chooserId: ctx.sourcePlayerId,
        effectId: ctx.state.G.turnMetadata.currentTrigger?.id ?? "",
        payload: {
          type: "effectTarget",
          targetKind: target.selector === "gig" ? "gig" : "card",
          eligibleIds: targets,
          min,
          max,
          canDecline: effect.optional === true,
          effect,
          sourceCardId: ctx.sourceCardId,
          sourcePlayerId: ctx.sourcePlayerId,
          abilityIndex: ctx.abilityIndex,
          contextTargets: ctx.contextTargets,
          boundTargets: ctx.boundTargets,
        },
      });
      return { status: "suspended", pendingChoice: effect };
    }
  }

  // `EffectHandlerRegistry` is exhaustive against `Effect["effect"]`, so the
  // lookup is statically guaranteed to find a handler. The cast widens the
  // registry's per-variant `EffectHandler<Extract<…>>` to a uniform shape
  // accepting any `Effect`.
  const handler = effectHandlers[effect.effect] as EffectHandler<Effect>;
  return handler(effect, ctx, ops);
}
