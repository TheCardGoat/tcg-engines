import type { SwuComparison, SwuCondition, SwuEffect } from "@tcg/star-wars-unlimited-types";
import { resolveAttack } from "./combat.ts";
import {
  addCardToState,
  canBeHealed,
  consumeDamagePrevention,
  effectiveHp,
  effectivePower,
  effectiveTraits,
  logMove,
  moveCardToZone,
  opponentOf,
} from "./state.ts";
import { resolveTarget, type ResolutionContext } from "./targets.ts";
import type { MatchState, PlayerId, RuntimeCard } from "./types.ts";

function targetLabel(card: RuntimeCard): string {
  return card.instanceId;
}

export function conditionMet(condition: SwuCondition, context: ResolutionContext): boolean {
  switch (condition.type) {
    case "always":
      return true;
    case "attackDefender": {
      const defenderId = context.choices?.defender;
      const defender = defenderId ? context.state.cards[defenderId] : undefined;
      if (!defender) return false;
      return (
        (condition.exhausted === undefined || defender.exhausted === condition.exhausted) &&
        (condition.playedThisPhase === undefined ||
          defender.playedThisPhase === condition.playedThisPhase)
      );
    }
    case "cardsInHand": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(context.playerId) : context.playerId;
      const count = Object.values(context.state.cards).filter(
        (card) => card.controller === playerId && card.zone === "hand",
      ).length;
      return compare(count, condition.comparison);
    }
    case "baseDamage": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(context.playerId) : context.playerId;
      const base = Object.values(context.state.cards).find(
        (card) => card.controller === playerId && card.zone === "base",
      );
      return compare(base?.damage ?? 0, condition.comparison);
    }
    case "controlsAspect":
      return Object.values(context.state.cards).some((card) => {
        const definition = context.state.definitions[card.definitionId];
        const controller =
          condition.controller === "opponent" ? opponentOf(context.playerId) : context.playerId;
        return (
          card.controller === controller &&
          card.zone.endsWith("Arena") &&
          definition?.aspects.includes(condition.aspect)
        );
      });
    case "controlsTrait":
      return compare(
        Object.values(context.state.cards).filter((card) => {
          const controller =
            condition.controller === "opponent" ? opponentOf(context.playerId) : context.playerId;
          return (
            card.controller === controller &&
            (!condition.excludeSelf || card.instanceId !== context.sourceId) &&
            card.zone.endsWith("Arena") &&
            effectiveTraits(context.state, card).some(
              (trait) => trait.toLowerCase() === condition.trait.toLowerCase(),
            )
          );
        }).length,
        condition.comparison ?? { operator: "gte", value: 1 },
      );
    case "controlsMoreUnits": {
      const controller =
        condition.controller === "opponent" ? opponentOf(context.playerId) : context.playerId;
      const otherController = opponentOf(controller);
      const unitCount = Object.values(context.state.cards).filter((card) => {
        const definition = context.state.definitions[card.definitionId];
        return (
          card.controller === controller &&
          (card.zone === "groundArena" || card.zone === "spaceArena") &&
          definition?.cardType === "unit" &&
          (!condition.arena || definition.arena === condition.arena)
        );
      }).length;
      const otherUnitCount = Object.values(context.state.cards).filter((card) => {
        const definition = context.state.definitions[card.definitionId];
        return (
          card.controller === otherController &&
          (card.zone === "groundArena" || card.zone === "spaceArena") &&
          definition?.cardType === "unit" &&
          (!condition.arena || definition.arena === condition.arena)
        );
      }).length;
      return unitCount > otherUnitCount;
    }
    case "hasInitiative": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(context.playerId) : context.playerId;
      return context.state.players[playerId].hasInitiative;
    }
    case "hasKeyword":
      return resolveTarget(condition.target, context).some((card) =>
        card.keywords.includes(condition.keyword),
      );
    case "hasTarget":
      return resolveTarget(condition.target, context).length > 0;
    case "resources": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(context.playerId) : context.playerId;
      return compare(context.state.players[playerId].resources, condition.comparison);
    }
    case "sourceIsAttacking":
    case "sourceIsDefending":
      return false;
    case "sourceIsUpgraded": {
      const source = context.state.cards[context.sourceId];
      return (source?.upgrades.length ?? 0) > 0;
    }
    case "sourceIsDamaged": {
      const source = context.state.cards[context.sourceId];
      return (source?.damage ?? 0) > 0;
    }
    case "unitsDefeatedThisPhase": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(context.playerId) : context.playerId;
      return compare(
        condition.controller === "any"
          ? context.state.phaseHistory.unitsDefeatedByController["player-one"] +
              context.state.phaseHistory.unitsDefeatedByController["player-two"]
          : context.state.phaseHistory.unitsDefeatedByController[playerId],
        condition.comparison,
      );
    }
  }
}

function controllerFor(
  controller: "any" | "friendly" | "opponent" | undefined,
  playerId: PlayerId,
): PlayerId {
  return controller === "opponent" ? opponentOf(playerId) : playerId;
}

function playerForTarget(
  target: Extract<SwuEffect, { type: "indirectDamage" }>["target"],
  playerId: PlayerId,
): PlayerId {
  if (target.type !== "player") return opponentOf(playerId);
  if (target.controller === "friendly") return playerId;
  return opponentOf(playerId);
}

function playersForTarget(
  target: Extract<SwuEffect, { type: "createToken" }>["target"],
  playerId: PlayerId,
): PlayerId[] {
  if (target?.type !== "player") return [playerId];
  if (target.controller === "any") return [playerId, opponentOf(playerId)];
  if (target.controller === "opponent") return [opponentOf(playerId)];
  return [playerId];
}

function compare(value: number, comparison: SwuComparison): boolean {
  if (!comparison) return true;
  switch (comparison.operator) {
    case "eq":
      return value === comparison.value;
    case "gt":
      return value > comparison.value;
    case "gte":
      return value >= comparison.value;
    case "lt":
      return value < comparison.value;
    case "lte":
      return value <= comparison.value;
  }
}

function dealDamage(
  state: MatchState,
  card: RuntimeCard,
  amount: number,
  playerId: PlayerId,
): boolean {
  if (amount > 0 && consumeDamagePrevention(state, card)) {
    logMove(state, {
      playerId,
      type: "effect.preventDamage",
      message: `${targetLabel(card)} prevented ${amount} damage.`,
      public: true,
    });
    return false;
  }
  const shielded = card.shield > 0;
  if (shielded) {
    card.shield -= 1;
  } else {
    card.damage += amount;
  }
  logMove(state, {
    playerId,
    type: "effect.damage",
    message: `${targetLabel(card)} takes ${amount} damage.`,
    public: true,
  });
  return !shielded && amount > 0;
}

function checkDefeatedUnits(state: MatchState, playerId: PlayerId): void {
  for (const card of Object.values(state.cards)) {
    const hp = effectiveHp(state, card);
    if (
      (card.zone === "groundArena" || card.zone === "spaceArena") &&
      hp > 0 &&
      card.damage >= hp
    ) {
      moveCardToZone(state, card.instanceId, "discard");
      logMove(state, {
        playerId,
        type: "framework.defeat",
        message: `${targetLabel(card)} is defeated by damage.`,
        public: true,
      });
    }
  }
}

function defaultPlayZone(context: ResolutionContext, card: RuntimeCard): RuntimeCard["zone"] {
  const definition = context.state.definitions[card.definitionId];
  if (definition.cardType === "event") return "discard";
  if (definition.cardType === "upgrade") return "discard";
  if (definition.cardType === "leader") return "leader";
  if (definition.cardType === "base") return "base";
  return definition.arena === "space" ? "spaceArena" : "groundArena";
}

const tokenTitle = {
  battleDroid: "Battle Droid",
  cloneTrooper: "Clone Trooper",
  mandalorian: "Mandalorian",
  spy: "Spy",
  tieFighter: "TIE Fighter",
  xWing: "X-Wing",
} as const satisfies Partial<Record<Extract<SwuEffect, { type: "createToken" }>["token"], string>>;

function createUnitTokens(
  state: MatchState,
  token: keyof typeof tokenTitle,
  amount: number,
  playerId: PlayerId,
): void {
  const definition = Object.values(state.definitions).find(
    (candidate) => candidate.cardType === "token" && candidate.title === tokenTitle[token],
  );
  if (!definition) return;
  for (let index = 0; index < amount; index += 1) {
    const card = addCardToState(
      state,
      definition,
      playerId,
      definition.arena === "space" ? "spaceArena" : "groundArena",
    );
    logMove(state, {
      playerId,
      type: "effect.createToken",
      message: `${targetLabel(card)} ${definition.title} token was created.`,
      public: true,
    });
  }
}

export function executeEffects(effects: readonly SwuEffect[], context: ResolutionContext): void {
  for (const effect of effects) {
    executeEffect(effect, context);
  }
}

export function executeEffect(effect: SwuEffect, context: ResolutionContext): void {
  const { state, playerId } = context;
  switch (effect.type) {
    case "attack": {
      const attacker = resolveTarget(effect.attacker ?? { type: "self" }, context)[0];
      const defender = effect.defender ? resolveTarget(effect.defender, context)[0] : undefined;
      if (!attacker || !defender) {
        logMove(state, {
          playerId,
          type: "effect.attack",
          message: "Attack effect had no legal target.",
          public: true,
        });
        break;
      }
      const result = resolveAttack(
        state,
        attacker.controller,
        attacker.instanceId,
        defender.instanceId,
        {
          ignoreExhausted: true,
        },
      );
      if (!result.success) {
        logMove(state, {
          playerId,
          type: "effect.attack",
          message: result.error ?? "Attack effect was not legal.",
          public: true,
        });
      } else {
        logMove(state, {
          playerId,
          type: "effect.attack",
          message: `${targetLabel(attacker)} attacked by an effect.`,
          public: true,
        });
      }
      break;
    }
    case "capture":
      for (const card of resolveTarget(effect.target, context)) {
        moveCardToZone(state, card.instanceId, "capture");
        logMove(state, {
          playerId,
          type: "effect.capture",
          message: `${targetLabel(card)} was captured.`,
          public: true,
        });
      }
      break;
    case "choose":
      state.pendingChoices.push({
        id: `choice-${state.nextChoiceNumber++}`,
        playerId,
        sourceId: context.sourceId,
        prompt: "Choose one",
        options: effect.choices,
      });
      break;
    case "conditional":
      executeEffects(
        conditionMet(effect.condition, context) ? effect.ifTrue : (effect.ifFalse ?? []),
        context,
      );
      break;
    case "createToken":
      if (effect.token === "force") {
        for (const tokenPlayerId of playersForTarget(effect.target, playerId)) {
          state.players[tokenPlayerId].force += effect.amount ?? 1;
        }
      } else if (effect.token === "credit") {
        for (const tokenPlayerId of playersForTarget(effect.target, playerId)) {
          state.players[tokenPlayerId].credits += effect.amount ?? 1;
        }
      } else if (effect.token === "shield") {
        const targets = effect.target
          ? resolveTarget(effect.target, context)
          : [state.cards[context.sourceId]].filter((card): card is RuntimeCard => !!card);
        for (const target of targets) target.shield += effect.amount ?? 1;
      } else {
        for (const tokenPlayerId of playersForTarget(effect.target, playerId)) {
          createUnitTokens(state, effect.token, effect.amount ?? 1, tokenPlayerId);
        }
      }
      logMove(state, {
        playerId,
        type: "effect.createToken",
        message: `Created ${effect.amount ?? 1} ${effect.token} token.`,
        public: true,
      });
      break;
    case "damage":
      for (const card of resolveTarget(effect.target, context))
        dealDamage(state, card, effect.amount, playerId);
      checkDefeatedUnits(state, playerId);
      break;
    case "damageFrom": {
      const source = resolveTarget(effect.source, context)[0];
      if (!source) {
        logMove(state, {
          playerId,
          type: "effect.damageFrom",
          message: "Source-based damage had no legal source.",
          public: true,
        });
        break;
      }
      const amount =
        effect.amount === "damage"
          ? source.damage
          : effect.amount === "damagePlusOne"
            ? source.damage + 1
            : effectivePower(state, source);
      for (const card of resolveTarget(effect.target, context)) {
        dealDamage(state, card, amount, playerId);
        logMove(state, {
          playerId,
          type: "effect.damageFrom",
          message: `${targetLabel(source)} dealt ${amount} damage to ${targetLabel(card)}.`,
          public: true,
        });
      }
      checkDefeatedUnits(state, playerId);
      break;
    }
    case "damagePer": {
      const multiplier = effect.multiplier ?? 1;
      const amount =
        effect.per === "targetCount"
          ? resolveTarget(effect.count, context).length * multiplier
          : Object.values(state.cards).filter(
              (card) =>
                card.controller === controllerFor(effect.controller, playerId) &&
                card.zone === "hand",
            ).length * multiplier;
      for (const card of resolveTarget(effect.target, context)) {
        dealDamage(state, card, amount, playerId);
        logMove(state, {
          playerId,
          type: "effect.damagePer",
          message: `${targetLabel(card)} was dealt ${amount} count-based damage.`,
          public: true,
        });
      }
      checkDefeatedUnits(state, playerId);
      break;
    }
    case "defeat":
      for (const card of resolveTarget(effect.target, context)) {
        moveCardToZone(state, card.instanceId, "discard");
        logMove(state, {
          playerId,
          type: "effect.defeat",
          message: `${targetLabel(card)} is defeated.`,
          public: true,
        });
      }
      break;
    case "delayed":
      state.delayedEffects.push({
        id: `${effect.trigger.event}-${state.nextChoiceNumber++}`,
        label: `Delayed ${effect.trigger.event}`,
        effects: effect.effects,
      });
      logMove(state, {
        playerId,
        type: "effect.delayed",
        message: `Delayed effect registered for ${effect.trigger.event}.`,
        public: true,
      });
      break;
    case "discard":
      for (const card of resolveTarget(effect.target, context).slice(0, effect.amount ?? 1)) {
        moveCardToZone(state, card.instanceId, "discard");
        logMove(state, {
          playerId,
          type: "effect.discard",
          message: `${targetLabel(card)} was discarded.`,
          public: true,
        });
      }
      break;
    case "distribute":
      for (const card of resolveTarget(effect.target, context)) {
        if (effect.mode === "damage") dealDamage(state, card, effect.amount, playerId);
        if (effect.mode === "healing") card.damage = Math.max(0, card.damage - effect.amount);
        if (effect.mode === "experience") card.experience += effect.amount;
        if (effect.mode === "advantage") state.players[card.controller].advantage += effect.amount;
        logMove(state, {
          playerId,
          type: "effect.distribute",
          message: `${effect.amount} ${effect.mode} distributed to ${targetLabel(card)}.`,
          public: true,
        });
      }
      checkDefeatedUnits(state, playerId);
      break;
    case "draw":
      for (const card of Object.values(state.cards)
        .filter(
          (candidate) =>
            candidate.owner === controllerFor(effect.controller, playerId) &&
            candidate.zone === "deck",
        )
        .slice(0, effect.amount)) {
        moveCardToZone(state, card.instanceId, "hand");
        logMove(state, {
          playerId,
          type: "effect.draw",
          message: `${card.instanceId} was drawn.`,
          public: false,
        });
      }
      break;
    case "exhaust":
      for (const card of resolveTarget(effect.target, context)) {
        card.exhausted = true;
        logMove(state, {
          playerId,
          type: "effect.exhaust",
          message: `${targetLabel(card)} was exhausted.`,
          public: true,
        });
      }
      break;
    case "gainKeyword":
      for (const card of resolveTarget(effect.target, context)) {
        if (!card.keywords.includes(effect.keyword)) card.keywords.push(effect.keyword);
        logMove(state, {
          playerId,
          type: "effect.gainKeyword",
          message: `${targetLabel(card)} gained ${effect.keyword}.`,
          public: true,
        });
      }
      break;
    case "gainTrait":
      for (const card of resolveTarget(effect.target, context)) {
        if (!card.traits.some((trait) => trait.toLowerCase() === effect.trait.toLowerCase())) {
          card.traits.push(effect.trait);
        }
        logMove(state, {
          playerId,
          type: "effect.gainTrait",
          message: `${targetLabel(card)} gained ${effect.trait}.`,
          public: true,
        });
      }
      break;
    case "heal":
      for (const card of resolveTarget(effect.target, context)) {
        if (!canBeHealed(state, card)) {
          logMove(state, {
            playerId,
            type: "effect.heal",
            message: `${targetLabel(card)} could not be healed.`,
            public: true,
          });
          continue;
        }
        card.damage = Math.max(0, card.damage - effect.amount);
        logMove(state, {
          playerId,
          type: "effect.heal",
          message: `${targetLabel(card)} healed ${effect.amount} damage.`,
          public: true,
        });
      }
      break;
    case "ifYouDo":
      executeEffect(effect.doEffect, context);
      executeEffects(effect.thenEffects, context);
      break;
    case "indirectDamage": {
      const assignedPlayer = playerForTarget(effect.target, playerId);
      const base = Object.values(state.cards).find((card) => {
        const definition = state.definitions[card.definitionId];
        return card.controller === assignedPlayer && definition?.cardType === "base";
      });
      if (base) base.damage += effect.amount;
      logMove(state, {
        playerId,
        type: "effect.indirectDamage",
        message: `${effect.amount} indirect damage was assigned to ${assignedPlayer}.`,
        public: true,
      });
      break;
    }
    case "lasting":
      executeEffects(effect.effects, context);
      break;
    case "lookAt":
      logMove(state, {
        playerId,
        type: "effect.lookAt",
        message: "Looked at cards.",
        public: false,
      });
      break;
    case "loseKeyword":
      for (const card of resolveTarget(effect.target, context)) {
        card.keywords = card.keywords.filter((keyword) => keyword !== effect.keyword);
        logMove(state, {
          playerId,
          type: "effect.loseKeyword",
          message: `${targetLabel(card)} lost ${effect.keyword}.`,
          public: true,
        });
      }
      break;
    case "modifyStats":
      for (const card of resolveTarget(effect.target, context)) {
        card.temporaryPower += effect.power ?? 0;
        card.temporaryHp += effect.hp ?? 0;
        logMove(state, {
          playerId,
          type: "effect.modifyStats",
          message: `${targetLabel(card)} gets ${effect.power ?? 0}/${effect.hp ?? 0}.`,
          public: true,
        });
      }
      break;
    case "move":
      for (const card of resolveTarget(effect.target, context)) {
        moveCardToZone(state, card.instanceId, effect.to);
        logMove(state, {
          playerId,
          type: "effect.move",
          message: `${targetLabel(card)} moved to ${effect.to}.`,
          public: true,
        });
      }
      break;
    case "optional":
      state.pendingChoices.push({
        id: `choice-${state.nextChoiceNumber++}`,
        playerId,
        sourceId: context.sourceId,
        prompt: "Resolve optional effect?",
        options: [
          { id: "yes", label: "Yes", effects: effect.effects },
          { id: "no", label: "No", effects: [] },
        ],
      });
      break;
    case "payResources": {
      const paid = Math.min(effect.amount, state.players[playerId].readyResources);
      state.players[playerId].readyResources -= paid;
      logMove(state, {
        playerId,
        type: "effect.payResources",
        message: `${playerId} paid ${paid} resources.`,
        public: true,
      });
      break;
    }
    case "play":
      for (const card of resolveTarget(effect.target, context)) {
        moveCardToZone(state, card.instanceId, defaultPlayZone(context, card));
        logMove(state, {
          playerId,
          type: "effect.play",
          message: `${targetLabel(card)} was played by an effect.`,
          public: true,
        });
      }
      break;
    case "preventDamage":
      logMove(state, {
        playerId,
        type: "effect.preventDamage",
        message: "Damage prevention effect is active.",
        public: true,
      });
      break;
    case "ready":
      for (const card of resolveTarget(effect.target, context)) {
        card.exhausted = false;
        logMove(state, {
          playerId,
          type: "effect.ready",
          message: `${targetLabel(card)} was readied.`,
          public: true,
        });
      }
      break;
    case "replacement":
      executeEffects(effect.effects, context);
      break;
    case "restrictAttack":
      for (const card of resolveTarget(effect.target, context)) {
        logMove(state, {
          playerId,
          type: "effect.restrictAttack",
          message: `${targetLabel(card)} has attack restriction ${effect.restriction}.`,
          public: true,
        });
      }
      break;
    case "reorder":
      for (const card of resolveTarget(effect.target, context)) {
        moveCardToZone(state, card.instanceId, "deck");
        logMove(state, {
          playerId,
          type: "effect.reorder",
          message: `${targetLabel(card)} was moved to the ${effect.destination}.`,
          public: false,
        });
      }
      break;
    case "resource":
      for (const card of resolveTarget(effect.target, context)) {
        moveCardToZone(state, card.instanceId, "resource");
        card.exhausted = !effect.ready;
        if (effect.ready) state.players[card.controller].readyResources += 1;
        logMove(state, {
          playerId,
          type: "effect.resource",
          message: `${targetLabel(card)} became a resource.`,
          public: true,
        });
      }
      break;
    case "reveal":
      logMove(state, { playerId, type: "effect.reveal", message: "Cards revealed.", public: true });
      break;
    case "search":
      for (const card of resolveTarget(effect.target, context)) {
        moveCardToZone(state, card.instanceId, effect.destination);
        logMove(state, {
          playerId,
          type: "effect.search",
          message: `${targetLabel(card)} was found by search.`,
          public: effect.reveal ?? false,
        });
      }
      break;
    case "sequential":
    case "simultaneous":
      executeEffects(effect.effects, context);
      break;
    case "takeControl":
      for (const card of resolveTarget(effect.target, context)) {
        card.controller = playerId;
        logMove(state, {
          playerId,
          type: "effect.takeControl",
          message: `${targetLabel(card)} changed controller.`,
          public: true,
        });
      }
      break;
    case "useForce":
      state.players[playerId].force = Math.max(
        0,
        state.players[playerId].force - (effect.amount ?? 1),
      );
      logMove(state, {
        playerId,
        type: "effect.useForce",
        message: "The Force was used.",
        public: true,
      });
      break;
  }
}
