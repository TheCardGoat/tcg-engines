import {
  type Ability,
  type AbilityModel,
  type CardModel,
  cardEffectTargetPredicate,
  type Effect,
  type EffectModel,
  exhaustiveCheck,
  type MobXRootStore,
  type ResolvingParam,
  type StackLayerModel,
  scryEffectPredicate,
  singleEffectAbility,
  targetConditionalEffectPredicate,
} from "@lorcanito/lorcana-engine";
import {
  type EffectTargets,
  type PlayerEffectTarget,
  playerEffectTargetPredicate,
} from "@lorcanito/lorcana-engine/effects/effectTargets";
import { isDynamicAmount } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { FloatingTriggeredAbilityModel } from "@lorcanito/lorcana-engine/store/models/FloatingTriggeredAbilityModel";
import type { TriggeredAbilityModel } from "@lorcanito/lorcana-engine/store/models/TriggeredAbilityModel";
import { calculateDynamicAmount } from "@lorcanito/lorcana-engine/store/resolvers/dynamicAmount";
import type { StackLayerStore } from "@lorcanito/lorcana-engine/store/StackLayerStore";

export function resolveCardTargets(
  effectModel: EffectModel,
  rootStore: MobXRootStore,
  targets?: EffectTargets,
  params: {
    targets?: CardModel[];
    mode?: string;
  } = {},
): CardModel[] {
  if (!targets) {
    return [];
  }

  if (params.mode && !params.targets) {
    return [];
  }

  if (params.targets) {
    let result: CardModel[] = [];

    if (effectModel.target && "includeSelf" in effectModel.target) {
      result = result.concat(effectModel.source);
    }

    result = result.concat(params.targets);

    return result;
  }

  switch (targets.type) {
    case "card": {
      const topCardFilter = targets.filters.find(
        (filter) => filter.filter === "top-deck",
      );

      if (topCardFilter) {
        const effectResponder = rootStore.resolveResponder(
          effectModel.responder,
          effectModel.source,
        );
        const topDeck = rootStore.tableStore.getTopDeckCard(
          topCardFilter.value === "self"
            ? effectResponder
            : rootStore.opponentPlayer(effectResponder),
        );

        if (topDeck) {
          return [topDeck];
        }

        console.log("NO TOP DECK FOUND");
        return [];
      }

      const cards = rootStore.cardStore.getCardsByTargetFilter(
        targets.filters,
        effectModel.responder,
        effectModel.source,
        undefined,
        params,
      );

      if (targets.excludeSelf) {
        return cards.filter(
          (card) => card.instanceId !== effectModel.source.instanceId,
        );
      }

      if (targets.value === "all") {
        return cards;
      }

      const amount = isDynamicAmount(targets.value)
        ? calculateDynamicAmount(
            targets.value,
            rootStore,
            params.targets,
            effectModel.source,
          )
        : targets.value;

      if (targets.random) {
        const randomCards: CardModel[] = [];

        for (let i = 0; i < amount; i++) {
          const cardsToPickAtRandom = cards.filter(
            (card) => !randomCards.includes(card),
          );
          const randomCard =
            rootStore.cardStore.pickACardAtRandom(cardsToPickAtRandom);
          if (randomCard) {
            randomCards.push(randomCard);
          } else {
            rootStore.debug("No random card found", cards);
          }
        }

        return randomCards;
      }

      // TODO: Adding this broke Daisy Donald's Date, we have to fix targeting
      // if (!params.targets) {
      //   console.log("NO TARGETS");
      //   return [];
      // }

      if (typeof amount !== "number") {
        console.error("NOT IMPLEMENTED");
        return cards;
      }

      // TODO: THIS IS PRETTY BAD!
      // TODO: This is causing effects to be resolved to any card in the match filters when there's no params.targets
      // I alleviated the issue by filtering out cards right after this function is called
      return cards.slice(0, amount);
    }

    case "player":
      return [];
    default: {
      return [];
    }
  }
}

export function resolvePlayerTargets(
  effectModel: EffectModel,
  rootStore: MobXRootStore,
  targets?: EffectTargets,
  layerParams: ResolvingParam = {},
): string[] {
  if (!targets) {
    return [];
  }

  if (targets.type === "player") {
    const opponentPlayer = rootStore.opponentPlayer(effectModel.responder);

    switch (targets.value) {
      case "self": {
        return [effectModel.responder];
      }
      case "opponent": {
        return [opponentPlayer];
      }
      case "all": {
        return [opponentPlayer, effectModel.responder];
      }
      case "target_owner": {
        const layerTarget = layerParams.targets?.[0];
        if (layerTarget) {
          return [layerTarget.ownerId];
        }

        rootStore.debug("Invalid target", JSON.stringify(targets));
        return [];
      }
      case "player_id": {
        return [targets.id];
      }
      case "target": {
        console.log(
          "Target",
          JSON.stringify(layerParams),
          JSON.stringify(effectModel),
        );
        console.warn(
          "Player target should have been replaced during effect resolution",
        );
        return [];
      }
      default: {
        exhaustiveCheck(targets);
      }
    }
  }

  return [];
}

export function canCardBeTargeted(
  effectModel: EffectModel,
  rootStore: MobXRootStore,
  cardTarget: CardModel,
  responder: string,
  effectTarget?: EffectTargets,
  skipNotification?: boolean,
  params?: ResolvingParam,
  debug = false,
) {
  if (!cardEffectTargetPredicate(effectTarget)) {
    if (debug) {
      console.warn(
        `[canCardBeTargeted] Effect target is not a card effect target: ${JSON.stringify(
          effectTarget,
        )}`,
      );
    }
    return true;
  }

  if (effectTarget.excludeSelf && effectModel.source.isCard(cardTarget)) {
    if (debug) {
      console.warn(
        `[canCardBeTargeted] Card ${cardTarget.instanceId} is excluded by excludeSelf filter`,
      );
    }
    return false;
  }

  if (
    cardTarget.hasWard &&
    cardTarget.zone === "play" &&
    responder !== cardTarget.ownerId &&
    effectTarget?.value !== "all"
  ) {
    if (debug) {
      console.warn(
        `[canCardBeTargeted] Card ${cardTarget.instanceId} has Ward and is not owned by responder ${responder}`,
      );
    }

    return false;
  }

  const effect = effectModel.effect;

  let isTargetValid = matchesTargetFilters(
    rootStore,
    cardTarget,
    effectTarget,
    responder,
    effectModel.source,
    params,
  );
  const conditionalEffect = targetConditionalEffectPredicate(effect);
  if (!isTargetValid && !!conditionalEffect) {
    isTargetValid = matchesTargetFilters(
      rootStore,
      cardTarget,
      effect.fallback[0]?.target,
      responder,
      effectModel.source,
      params,
    );
  }

  if (!isTargetValid) {
    if (!skipNotification) {
      if (debug) {
        console.warn(
          `[canCardBeTargeted] Card ${cardTarget.instanceId} does not match target filters`,
        );
        console.log(
          `[targetsResolver] Filters: ${JSON.stringify(effectTarget?.filters)}`,
        );
        console.log(
          `effect: ${effectModel.source.fullName}, owner: ${effectModel.source.ownerId} , responder: ${responder}`,
        );
        console.log(`Required Targets: ${JSON.stringify(effectTarget)}`);
        console.log(
          `Actual Targets: ${cardTarget.fullName}, owner: ${cardTarget.ownerId}`,
        );
      }

      rootStore.sendNotification({
        type: "icon",
        title: "Can't target this card",
        message: "You selected an invalid target for the effect",
        icon: "warning",
        autoClear: true,
      });
    }

    return false;
  }

  return true;
}

export function doesItRequireTarget(effectModel: EffectModel) {
  const target = effectModel.target;

  if (effectModel.effect.type === "modal") {
    return true;
  }

  if (effectModel.hasRandomTarget()) {
    return false;
  }

  if (scryEffectPredicate(effectModel.effect)) {
    return true;
  }

  if (target?.type === "player") {
    return false;
  }

  if (effectModel.effect.type === "reveal-and-play") {
    return false;
  }

  if (cardEffectTargetPredicate(target)) {
    if (target.value === "all") {
      return false;
    }

    if (target.filters.find((filter) => filter.filter === "top-deck")) {
      return false;
    }

    if (
      target.filters.find(
        (filter) => filter.filter === "instanceId" && !!filter.value,
      )
    ) {
      return false;
    }

    // This should only be true if there's only one filter
    if (
      target.filters.find((filter) => filter.filter === "source") &&
      target.filters.length === 1
    ) {
      return false;
    }
  }

  return !!target;
}

// This function doesn't take into consideration cards that can't be targeted (e.g. cards with Ward)
export function matchesTargetFilters(
  rootStore: MobXRootStore,
  card: CardModel,
  target?: EffectTargets | PlayerEffectTarget,
  expectedOwner?: string,
  source?: CardModel,
  params?: ResolvingParam,
) {
  if (!(cardEffectTargetPredicate(target) && target)) {
    return false;
  }

  if ("excludeSelf" in target && target.excludeSelf) {
    if (card.instanceId === source?.instanceId) {
      return false;
    }
  }

  if ("filters" in target) {
    return card.matchesTargetFilter(
      target.filters,
      expectedOwner || source?.ownerId,
      source,
      params,
    );
  }

  return false;
}

export function isValidAbilityTriggerTarget(
  rootStore: MobXRootStore,
  ability: TriggeredAbilityModel | FloatingTriggeredAbilityModel,
  target?: CardModel,
  source?: CardModel,
  debug = false,
) {
  if (debug) {
    console.log(
      `[isValidAbilityTriggerTarget] Evaluating ability trigger target: ${target?.instanceId || "undefined"}`,
    );
  }

  if (!target) {
    if (debug) {
      console.log(
        "[isValidAbilityTriggerTarget] No target provided, returning false",
      );
    }
    return false;
  }

  const trigger = ability.trigger;
  if (debug) {
    console.log("Trigger:", JSON.stringify(trigger));
  }

  if ("exclude" in trigger && trigger.exclude === "source") {
    if (debug) {
      console.log(
        "[isValidAbilityTriggerTarget] Checking exclude source condition",
      );
    }
    if (target.instanceId === source?.instanceId) {
      if (debug) {
        console.log(
          `[isValidAbilityTriggerTarget] Target ${target.instanceId} is source, excluded by trigger.exclude === "source"`,
        );
      }
      return false;
    }
    if (debug) {
      console.log(
        `[isValidAbilityTriggerTarget] Target ${target.instanceId} is not source, passed exclusion check`,
      );
    }
  }

  if ("filters" in trigger && trigger.filters) {
    if (debug) {
      console.log(
        "[isValidAbilityTriggerTarget] Checking filters in trigger:",
        JSON.stringify(trigger.filters),
      );
    }
    const result = matchesTargetFilters(
      rootStore,
      target,
      { type: "card", filters: trigger.filters, value: 1 },
      undefined,
      source,
    );
    if (debug) {
      console.log(
        `[isValidAbilityTriggerTarget] Filter match result for ${target.instanceId}: ${result}`,
      );
    }
    return result;
  }

  if (
    trigger &&
    "target" in trigger &&
    trigger.target &&
    "filters" in trigger.target &&
    trigger.target.filters
  ) {
    if (debug) {
      console.log(
        "Checking filters in trigger.target:",
        JSON.stringify(trigger.target.filters),
      );
    }
    const result = matchesTargetFilters(
      rootStore,
      target,
      trigger.target,
      undefined,
      source,
    );
    if (debug)
      console.log(
        `Target filter match result for ${target.instanceId}: ${result}`,
      );
    return result;
  }

  if (debug)
    console.log(
      `No specific conditions found, target ${target.instanceId} is valid by default`,
    );
  return true;
}

// This is a future feature I'm working on, the idea is to automatically target the best target for the player.
// This is usually going to work when there's a single target
export function autoTarget(
  stackLayerStore: StackLayerStore,
  rootStore: MobXRootStore,
  layer: StackLayerModel,
) {
  if (!(layer.isOptional() || layer.targetsPlayer) && layer.hasValidTarget()) {
    const potentialTargets = layer.ability.potentialTargets();
    const amount = layer.targetAmount();

    if (typeof amount === "number" && potentialTargets.length <= amount) {
      rootStore.log({
        type: "AUTO_TARGET_ENGAGED",
        targets: potentialTargets.map((target) => target.instanceId),
      });
      stackLayerStore.resolveLayerById(layer.id, { targets: potentialTargets });
    }
  }
}

export function calculateHowManyTargets(
  ability: AbilityModel,
  store: MobXRootStore,
) {
  const targets = ability.effectTargets();
  const effectTarget = targets.find(cardEffectTargetPredicate);

  if (effectTarget && isDynamicAmount(effectTarget.value)) {
    const dynamicAmount = effectTarget.value;

    // TODO: resolveAmount is a better function to use
    return calculateDynamicAmount(dynamicAmount, store, [], ability.source);
  }

  return effectTarget?.value || 1;
}

export function hasValidTarget(ability: AbilityModel) {
  if (doesAbilityTargetPlayer(ability)) {
    return true;
  }

  // TODO: better organize this, they should have been handled by doesAbilityTargetPlayer
  const exceptions = (effect?: EffectModel) => {
    return ["replacement", "scry", "shuffle-deck", "modal"].includes(
      effect?.type || "",
    );
  };
  if (ability.effects.filter(exceptions).length > 0) {
    return true;
  }

  // This is problematic, as consider all effect targets at once.
  // We should instead evaluate individually. Take a look at a whole new world test
  if (
    ability.effects.some((effect) => !effect.requiresTarget()) &&
    !ability.ability.dependentEffects
  ) {
    return true;
  }

  return ability.potentialTargets().length > 0;
}

export function doesEffectTargetPlayer(effect: Effect) {
  if (effect.target?.type === "player") {
    return true;
  }

  return ["lore", "draw", "scry", "shuffle-deck"].includes(effect.type || "");
}

export function doesAbilityTargetPlayer(ability: AbilityModel) {
  if (cardEffectTargetPredicate(ability.ability.target)) {
    return false;
  }

  if (playerEffectTargetPredicate(ability.ability.target)) {
    return true;
  }

  return ability.effects?.every((model) =>
    doesEffectTargetPlayer(model.effect),
  );
}

export function isUpToTarget(ability: AbilityModel) {
  const find = ability
    .effectTargets()
    .find((effect) => "upTo" in effect && effect.upTo);
  return !!find;
}

export function isValidPlayerEffectTarget(
  source: CardModel,
  effect: Effect,
  playerId: string,
) {
  const target = effect.target;

  if (target?.type !== "player") {
    return false;
  }

  switch (target.value) {
    case "self":
      return playerId === source.ownerId;
    case "all":
      return true;
    case "opponent":
      return playerId !== source.ownerId;
    case "player_id":
      return target.id === playerId;
    case "target_owner":
      console.log("Target owner", playerId, source.ownerId);
      console.warn("not implemented");
      break;
    case "target":
      console.log("Target", playerId, source.instanceId);
      console.warn(
        "Player target should have been replaced during effect resolution",
      );
      break;
    default:
      exhaustiveCheck(target);
      return false;
  }
}

export function isValidPlayerTarget(
  source: CardModel,
  ability: Ability,
  playerId: string,
) {
  const isValid = (effect: Effect) => {
    return isValidPlayerEffectTarget(source, effect, playerId);
  };

  if (singleEffectAbility(ability)) {
    return isValid(ability.effect);
  }

  return ability.effects?.some(isValid);
}
