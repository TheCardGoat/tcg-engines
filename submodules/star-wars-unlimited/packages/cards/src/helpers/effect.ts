import type {
  SwuChoice,
  SwuCondition,
  SwuController,
  SwuEffect,
  SwuEffectDuration,
  SwuKeyword,
  SwuTrait,
  SwuTarget,
  SwuTrigger,
  SwuZone,
} from "@tcg/star-wars-unlimited-types";

export const effect = {
  attack(args: { readonly attacker?: SwuTarget; readonly defender?: SwuTarget } = {}): SwuEffect {
    return { type: "attack", ...args };
  },
  capture(target: SwuTarget): SwuEffect {
    return { type: "capture", target };
  },
  choose(choices: readonly SwuChoice[]): SwuEffect {
    return { type: "choose", choices };
  },
  combatDamageFirst(target: SwuTarget): SwuEffect {
    return { type: "combatDamageFirst", target };
  },
  conditional(
    condition: SwuCondition,
    ifTrue: readonly SwuEffect[],
    ifFalse?: readonly SwuEffect[],
  ): SwuEffect {
    return ifFalse
      ? { type: "conditional", condition, ifTrue, ifFalse }
      : { type: "conditional", condition, ifTrue };
  },
  createToken(
    token: Extract<SwuEffect, { type: "createToken" }>["token"],
    amount = 1,
    target?: SwuTarget,
  ): SwuEffect {
    return target
      ? { type: "createToken", token, amount, target }
      : { type: "createToken", token, amount };
  },
  damage(target: SwuTarget, amount: number): SwuEffect {
    return { type: "damage", target, amount };
  },
  damageFrom(
    source: SwuTarget,
    target: SwuTarget,
    amount: Extract<SwuEffect, { type: "damageFrom" }>["amount"],
  ): SwuEffect {
    return { type: "damageFrom", source, target, amount };
  },
  damagePerCardsInHand(
    target: SwuTarget,
    controller: Extract<SwuEffect, { type: "damagePer"; per: "cardsInHand" }>["controller"],
    multiplier?: number,
  ): SwuEffect {
    return multiplier
      ? { type: "damagePer", target, per: "cardsInHand", controller, multiplier }
      : { type: "damagePer", target, per: "cardsInHand", controller };
  },
  damagePerTargetCount(target: SwuTarget, count: SwuTarget, multiplier?: number): SwuEffect {
    return multiplier
      ? { type: "damagePer", target, per: "targetCount", count, multiplier }
      : { type: "damagePer", target, per: "targetCount", count };
  },
  defeat(target: SwuTarget): SwuEffect {
    return { type: "defeat", target };
  },
  delayed(trigger: SwuTrigger, effects: readonly SwuEffect[]): SwuEffect {
    return { type: "delayed", trigger, effects };
  },
  discard(target: SwuTarget, amount = 1): SwuEffect {
    return { type: "discard", target, amount };
  },
  distribute(
    mode: Extract<SwuEffect, { type: "distribute" }>["mode"],
    target: SwuTarget,
    amount: number,
  ): SwuEffect {
    return { type: "distribute", mode, target, amount };
  },
  draw(controller: SwuController = "friendly", amount = 1): SwuEffect {
    return { type: "draw", controller, amount };
  },
  exhaust(target: SwuTarget): SwuEffect {
    return { type: "exhaust", target };
  },
  gainKeyword(target: SwuTarget, keyword: SwuKeyword, duration?: SwuEffectDuration): SwuEffect {
    return duration
      ? { type: "gainKeyword", target, keyword, duration }
      : { type: "gainKeyword", target, keyword };
  },
  gainTrait(target: SwuTarget, trait: SwuTrait, duration?: SwuEffectDuration): SwuEffect {
    return duration
      ? { type: "gainTrait", target, trait, duration }
      : { type: "gainTrait", target, trait };
  },
  heal(target: SwuTarget, amount: number): SwuEffect {
    return { type: "heal", target, amount };
  },
  ifYouDo(doEffect: SwuEffect, thenEffects: readonly SwuEffect[]): SwuEffect {
    return { type: "ifYouDo", doEffect, thenEffects };
  },
  indirectDamage(target: SwuTarget, amount: number): SwuEffect {
    return { type: "indirectDamage", target, amount };
  },
  lasting(duration: SwuEffectDuration, effects: readonly SwuEffect[]): SwuEffect {
    return { type: "lasting", duration, effects };
  },
  lookAt(target: SwuTarget): SwuEffect {
    return { type: "lookAt", target };
  },
  loseHealing(target: SwuTarget, duration?: SwuEffectDuration): SwuEffect {
    return duration ? { type: "loseHealing", target, duration } : { type: "loseHealing", target };
  },
  loseKeyword(target: SwuTarget, keyword: SwuKeyword, duration?: SwuEffectDuration): SwuEffect {
    return duration
      ? { type: "loseKeyword", target, keyword, duration }
      : { type: "loseKeyword", target, keyword };
  },
  modifyStats(
    target: SwuTarget,
    stats: { readonly power?: number; readonly hp?: number; readonly duration?: SwuEffectDuration },
  ): SwuEffect {
    return { type: "modifyStats", target, ...stats };
  },
  modifyStatsPer(
    target: SwuTarget,
    per: Extract<SwuEffect, { type: "modifyStatsPer" }>["per"],
    stats: { readonly power?: number; readonly hp?: number; readonly duration?: SwuEffectDuration },
    count?: SwuTarget,
  ): SwuEffect {
    return per === "targetCount"
      ? { type: "modifyStatsPer", target, per, count: count ?? target, ...stats }
      : { type: "modifyStatsPer", target, per, ...stats };
  },
  move(target: SwuTarget, to: SwuZone): SwuEffect {
    return { type: "move", target, to };
  },
  optional(effects: readonly SwuEffect[]): SwuEffect {
    return { type: "optional", effects };
  },
  payResources(amount: number): SwuEffect {
    return { type: "payResources", amount };
  },
  play(target: SwuTarget, free = false): SwuEffect {
    return { type: "play", target, free };
  },
  preventDamage(target: SwuTarget, duration?: SwuEffectDuration): SwuEffect {
    return duration
      ? { type: "preventDamage", target, duration }
      : { type: "preventDamage", target };
  },
  ready(target: SwuTarget): SwuEffect {
    return { type: "ready", target };
  },
  restrictAttack(
    target: SwuTarget,
    restriction: Extract<SwuEffect, { type: "restrictAttack" }>["restriction"],
    duration?: SwuEffectDuration,
  ): SwuEffect {
    return duration
      ? { type: "restrictAttack", target, restriction, duration }
      : { type: "restrictAttack", target, restriction };
  },
  reorder(
    target: SwuTarget,
    destination: Extract<SwuEffect, { type: "reorder" }>["destination"],
    order: Extract<SwuEffect, { type: "reorder" }>["order"] = "any",
  ): SwuEffect {
    return { type: "reorder", target, destination, order };
  },
  resource(target: SwuTarget, ready = false): SwuEffect {
    return { type: "resource", target, ready };
  },
  reveal(target: SwuTarget): SwuEffect {
    return { type: "reveal", target };
  },
  search(target: SwuTarget, destination: SwuZone, reveal = false): SwuEffect {
    return { type: "search", target, destination, reveal };
  },
  sequential(effects: readonly SwuEffect[]): SwuEffect {
    return { type: "sequential", effects };
  },
  simultaneous(effects: readonly SwuEffect[]): SwuEffect {
    return { type: "simultaneous", effects };
  },
  takeControl(target: SwuTarget): SwuEffect {
    return { type: "takeControl", target };
  },
  useForce(amount = 1): SwuEffect {
    return { type: "useForce", amount };
  },
};
