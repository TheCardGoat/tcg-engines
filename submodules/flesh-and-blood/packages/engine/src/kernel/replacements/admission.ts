import type { FabAmount, FabCardFilter, FabCondition, FabEffect } from "@tcg/flesh-and-blood-types";
import { isAdmissibleCanonicalAmount } from "./amounts.ts";

export type CanonicalReplacement = Extract<FabEffect, { readonly type: "replacement" }>;
export type CanonicalPrevention = Extract<FabEffect, { readonly type: "prevention" }>;

export function supportedCanonicalReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type === "prevention") {
    const shieldedOk =
      !effect.shielded ||
      effect.shielded.selector === "controller" ||
      effect.shielded.selector === "self" ||
      effect.shielded.selector === "any-hero" ||
      // Yoji: another target hero declared on-stack (bound at register time).
      (effect.shielded.selector === "object" &&
        "declared" in effect.shielded &&
        effect.shielded.declared === "on-stack") ||
      // Class shield: "you or a Pirate you control" (Sawbones). Evaluated
      // against the damaged object at application time.
      isClassShield(effect.shielded);
    const redirectOk =
      !effect.redirectTo ||
      effect.redirectTo.selector === "self" ||
      effect.redirectTo.selector === "controller";
    const optionalDiscardInstant =
      effect.optionalCost?.class === "effect" &&
      effect.optionalCost.type === "discard" &&
      effect.optionalCost.count === 1 &&
      (effect.optionalCost.filter?.typeBox?.types?.includes("Instant") ?? false);
    // Shroud of Darkness family: "you may banish this to prevent N".
    const optionalBanishSelf =
      effect.optionalCost?.class === "effect" && effect.optionalCost.type === "banish-self";
    // Solray Plating family: "you may banish a card from your soul to prevent 1".
    const optionalBanishSoul = isBanishFromSoulCost(effect.optionalCost);
    // mBrio / Hyper Driver family: remove a named steam counter from a filtered
    // permanent (Hyper Driver) as the optional prevention cost.
    const optionalRemoveSteam =
      effect.optionalCost?.class === "effect" &&
      effect.optionalCost.type === "remove-counters" &&
      effect.optionalCost.counter.kind === "named" &&
      effect.optionalCost.counter.name === "steam" &&
      (typeof effect.optionalCost.count === "number"
        ? effect.optionalCost.count >= 1
        : effect.optionalCost.count === undefined);
    const optionalCostOk =
      !effect.optionalCost ||
      optionalDiscardInstant ||
      optionalBanishSelf ||
      optionalBanishSoul ||
      optionalRemoveSteam;
    // CR 6.4.1a / 6.4.10h: additional modifications are sub-events of the
    // modified damage event and still occur when the damage is unpreventable
    // (only the reduction is suppressed). Admit single-card draws (Cap of
    // Quick Thinking) and immediate destroy-self (Enchanting Melody: "instead
    // destroy Enchanting Melody and prevent 4 damage that source would deal").
    const additionalModificationOk =
      !effect.additionalModification ||
      (effect.additionalModification.type === "draw" &&
        effect.additionalModification.count === 1) ||
      isAdmissiblePreventionAdditionalCreateToken(effect.additionalModification) ||
      isPreventionSourceBanish(effect.additionalModification) ||
      (effect.additionalModification.type === "destroy" &&
        effect.additionalModification.target.selector === "self" &&
        (effect.additionalModification.delay === undefined ||
          effect.additionalModification.delay === "end-phase"));
    const sourceOk =
      !effect.source ||
      effect.source.selector === "self" ||
      effect.source.selector === "opponent" ||
      (effect.source.selector === "object" &&
        "declared" in effect.source &&
        (effect.source.declared === "on-stack" || effect.source.declared === "at-resolution"));
    return (
      // CR 6.4.10j: shielding preventions register with a resolved numeric
      // budget (see continuous-rule-effects registration); the consumption
      // boundary decrements it per point prevented and it ceases at 0.
      // CR 6.4.10: any evaluatable FabAmount is also admitted here — the apply
      // path resolves it via evaluateAmount (see resolveCanonicalAmount), so
      // count/event-amount/conditional preventions (e.g. static variants of
      // Dissipation Shield's steam-counter count) register and resolve.
      // Shielding semantics (budget decrement per 6.4.10a, cease at 0) are
      // realized on the REGISTERED path only — preventionApplies keeps
      // static-origin shielding candidates inert.
      (effect.preventionKind === "fixed" || effect.preventionKind === "shielding") &&
      isAdmissibleCanonicalAmount(effect.amount) &&
      optionalCostOk &&
      additionalModificationOk &&
      sourceOk &&
      (effect.times === undefined || effect.times === 1) &&
      shieldedOk &&
      redirectOk
    );
  }
  // Vambrace of Determination: the next physical prevention effect prevents
  // one less damage. The prevention event is emitted before the already
  // reduced damage event is committed, so this shape rewrites that record and
  // queues the restored damage as a sibling event.
  if (
    effect.replaces.name === "prevent" &&
    "damageType" in effect.replaces &&
    effect.replaces.damageType === "physical" &&
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "power" &&
    effect.modification.op === "subtract" &&
    typeof effect.modification.amount === "number"
  )
    return true;
  // A typed cancel-event replacement may suppress any event its pattern can
  // match. Restricting this to continuous reconciliation made event-cost
  // cancellation invisible to conditional "if you do" semantics.
  if (effect.modification.type === "cancel-event") return true;
  // CR 8.5.33 Ignore: same suppression scope as cancel-event — any event its
  // pattern can match may be ignored (considered to never have happened).
  if (effect.modification.type === "ignore") return true;
  if (
    (effect.replaces.name === "continuous-effect-applied" ||
      effect.replaces.name === "continuous-effect-changed") &&
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "count" &&
    effect.modification.op !== "set-base" &&
    typeof effect.modification.amount === "number"
  )
    return true;
  if (
    effect.replaces.name === "pitch" &&
    effect.modification.type === "sequence" &&
    effect.modification.steps.length === 2 &&
    effect.modification.steps[0]?.type === "destroy" &&
    effect.modification.steps[0].target.selector === "self" &&
    effect.modification.steps[1]?.type === "gain-resources" &&
    typeof effect.modification.steps[1].amount === "number"
  )
    return true;
  // Vestige of Sol: "whenever you pitch a Light card, instead gain that many
  // {r} plus 1" — additive boost on pitch resourcesGenerated.
  if (isPitchResourceBoostReplacement(effect)) return true;
  // Frankie / "instead banish it": rewrite a put-into-graveyard zone move.
  if (isGraveyardToBanishReplacement(effect)) return true;
  // Drone of Brutality: "instead put it on the bottom of your deck".
  if (isGraveyardToDeckBottomReplacement(effect)) return true;
  // Topsy Turvy: put on top of a deck → put on bottom instead.
  if (isDeckTopToBottomReplacement(effect)) return true;
  // Florian / Promising Terrain: "create that many plus 1 of each of those tokens".
  if (isCreateExtraReplacement(effect)) return true;
  // Not So Fast / SEA149 family: "the next time an opponent would draw a card
  // from the effect of a Gold token, instead you draw a card" — the draw is
  // redirected wholesale to the replacement's controller.
  if (isOpponentDrawRedirectToControllerReplacement(effect)) return true;
  // Myrkhellir Helm: "draw from a Gold token → instead draw N" (count + extra draws).
  if (isDrawCountBoostReplacement(effect)) return true;
  if (isDrawToTokenReplacement(effect)) return true;
  // Enter-arena + named counters:
  // - subject "self" (Hyper Driver own "enters with N steam")
  // - subject filter (Puffer Jacket: non-token Hyper Drivers you control enter
  //   with an additional steam counter)
  if (isEnterArenaAddCounterReplacement(effect)) return true;
  // Vox Necropolis family: the affected permanent enters already tapped.
  // This modifies the enter-arena event itself; it is not a discrete tap event.
  if (isEnterArenaTappedReplacement(effect)) return true;
  // Vestige of Flagellation: first opponent {h} gain each turn → you lose that
  // much and create that many Vigor tokens.
  if (isOpponentGainLifeToLoseLifeCreateTokensReplacement(effect)) return true;
  // Talisman of Tithes: opponent would draw during your action phase → destroy
  // this and they draw that many minus 1 (one-card draw events: cancel that card).
  if (isOpponentDrawMinusOneDestroySelfReplacement(effect)) return true;
  // Poison the Well: the next hero life gain this turn becomes an equal life
  // loss for that same hero.
  if (isGainLifeToLoseLifeReplacement(effect)) return true;
  // Smoldering Scales: Frostbite create under you → instead you may destroy this.
  if (isOptionalDestroySelfCreateReplacement(effect)) return true;
  // Swordmaster's Path family: "instead sharpen it an additional time".
  if (isAdditionalSharpenReplacement(effect)) return true;
  // Reverent Rerebrace: "instead you may pay {r} and destroy this. If you do,
  // sharpen it an additional time."
  if (isOptionalPayDestroyAdditionalSharpenReplacement(effect)) return true;
  // Metacarpus Node / Crucible of Aetherweave / Wizard "plus 1 arcane" family:
  // "instead it deals that much arcane damage plus N".
  if (isDamageAmountBoostReplacement(effect)) return true;
  // Gambler's Gloves: "instead after the roll you may destroy this. If you do,
  // that hero rerolls" (optional destroy-self + re-roll dN).
  if (isOptionalDestroySelfRerollReplacement(effect)) return true;
  // Ready to Roll: "instead roll that many dice plus 1 and ignore the lowest".
  if (isRollPlusOneIgnoreLowestReplacement(effect)) return true;
  // Blasmophet, Levia Consumed: "If you would lose {h} from blood debt,
  // instead banish the top card of the deck." The loss is fully replaced by a
  // deterministic move of the controller's deck top.
  if (isBloodDebtLoseLifeToTopDeckBanishReplacement(effect)) return true;
  // Flourish / Thrive / Gauntlets of Iron Will: "if an attack would gain {p},
  // instead it gains that much ± N" (continuous power contribution rewrite).
  if (isPowerGainAmountReplacement(effect)) return true;
  // Victor Goldmane: "The first time you would fail to win a clash, instead you
  // may destroy a Gold you control. If you do, put the revealed card on the
  // bottom, then clash again" (optional destroy + re-clash).
  if (clashOutcomeOptionalReclash(effect)) return true;
  // Brutus: if all heroes would fail to win a clash, instead you win
  // (1v1 choose-which-hero is the controller winning the tie).
  if (isClashTieWinClashReplacement(effect)) return true;
  // Overturn the Results: fail to win a clash revealing this → you win
  // (and optional crowd-boos). clash-lose is observation-only.
  if (isClashFailToWinRevealingThisReplacement(effect)) return true;
  // The Old Switcheroo: the next clash this turn reveals their top for you
  // and your top for them. Prize (discard) is staged on that clash if you win.
  if (isClashSwapRevealReplacement(effect)) return true;
  // Cheating Scoundrel: expose the provisional wager loser as an outcome-stage
  // replacement, bind one exact hand card as the optional cost, then reverse
  // winner and loser while preserving the wager and its original prize.
  if (isWagerLossOptionalDiscardWinReplacement(effect)) return true;
  // Catch of the Day: "If a go fish effect would trigger this turn, instead it
  // triggers twice" — count ×2 on a trigger event whose source has Go Fish.
  if (isGoFishDoubleTriggerReplacement(effect)) return true;
  return false;
}

/**
 * Printed "if a go fish effect would trigger this turn, instead it triggers
 * twice." Pattern name is DSL "trigger"; live observation events are also
 * named "trigger". Modification is count ×2 (same numeric-count family as
 * create-extra / power-gain amount rewrites).
 */
export function isGoFishDoubleTriggerReplacement(
  effect: CanonicalReplacement | CanonicalPrevention | FabEffect,
): effect is CanonicalReplacement {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "trigger") return false;
  if (effect.replaces.filter?.hasLabel !== "go-fish") return false;
  return (
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "count" &&
    effect.modification.op === "multiply" &&
    effect.modification.amount === 2
  );
}

export function wagerLossOptionalDiscardWin(
  effect: CanonicalReplacement | CanonicalPrevention | FabEffect,
): { readonly filter?: FabCardFilter } | null {
  if (effect.type !== "replacement" || effect.replaces.name !== "wager-loss") return null;
  if (effect.replacementKind !== "outcome") return null;
  if (effect.modification.type !== "optional") return null;
  const discard = effect.modification.effect;
  if (discard.type !== "discard") return null;
  const target = discard.target;
  if (target.selector !== "object" || target.declared !== "at-resolution") return null;
  if (target.player !== "controller" || target.count !== 1) return null;
  if (target.zones.length !== 1 || target.zones[0] !== "hand") return null;
  return "then" in effect.modification && effect.modification.then?.type === "win-wager"
    ? target.filter
      ? { filter: target.filter }
      : {}
    : null;
}

export function isWagerLossOptionalDiscardWinReplacement(
  effect: CanonicalReplacement | CanonicalPrevention | FabEffect,
): boolean {
  return wagerLossOptionalDiscardWin(effect) !== null;
}

/**
 * "would gain {p}" family — DSL replaces.name "gain" (Flourish/Thrive/Iron Will)
 * or "modify-power". Live events: continuous-effect-applied with a power
 * contribution that is increasing. Modification rewrites the contribution
 * value (add/subtract/set) so the attack gains that much ± N.
 *
 * Returns boolean (not a type predicate): calling sites already narrow
 * candidate.effect to CanonicalReplacement; a false type-predicate would
 * collapse that to `never` for later pitch/graveyard branches.
 */
export function isPowerGainAmountReplacement(
  effect: CanonicalReplacement | CanonicalPrevention | FabEffect,
): boolean {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "gain" && effect.replaces.name !== "modify-power") return false;
  if (effect.modification.type !== "modify-numeric") return false;
  if (effect.modification.property !== "power") return false;
  if (effect.modification.op === "set-base") return false;
  return typeof effect.modification.amount === "number";
}

/** Signed delta / op payload for a power-gain replacement (null if not applicable). */
export function powerGainModification(effect: CanonicalReplacement): {
  readonly amount: number;
  readonly op: "add" | "subtract" | "multiply" | "set" | "divide";
} | null {
  if (
    effect.modification.type !== "modify-numeric" ||
    effect.modification.property !== "power" ||
    effect.modification.op === "set-base" ||
    typeof effect.modification.amount !== "number"
  ) {
    return null;
  }
  return { amount: effect.modification.amount, op: effect.modification.op };
}

/**
 * Gambler's Gloves family: replaces a die roll with optional destroy-self then
 * re-roll the same number of sides. Application runs only after the persisted
 * replacement choice is accepted while the source is still seated.
 */
export function isOptionalDestroySelfRerollReplacement(
  effect: CanonicalReplacement | CanonicalPrevention | FabEffect,
): effect is CanonicalReplacement {
  if (effect.type !== "replacement") return false;
  // DSL event pattern is "roll"; live proposal events are roll-request.
  if (effect.replaces.name !== "roll") return false;
  if (effect.modification.type !== "optional") return false;
  if (effect.modification.effect.type !== "destroy") return false;
  if (effect.modification.effect.target?.selector !== "self") return false;
  const then = "then" in effect.modification ? effect.modification.then : undefined;
  if (!then || then.type !== "roll") return false;
  return Number.isInteger(then.sides) && then.sides >= 2;
}

export function optionalDestroyRerollSides(effect: CanonicalReplacement): number | null {
  if (!isOptionalDestroySelfRerollReplacement(effect)) return null;
  const then = "then" in effect.modification ? effect.modification.then : undefined;
  if (!then || then.type !== "roll") return null;
  return then.sides;
}

/**
 * Ready to Roll: if you would roll 1 or more dice this turn, instead roll that
 * many plus 1 and ignore the lowest. Modification is a roll leaf with extraDice
 * and ignore:"lowest" — not a this-way status slug.
 */
export function isRollPlusOneIgnoreLowestReplacement(
  effect: CanonicalReplacement | CanonicalPrevention | FabEffect,
): effect is CanonicalReplacement {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "roll") return false;
  const modification = effect.modification;
  if (modification.type !== "roll") return false;
  return (
    "extraDice" in modification &&
    (modification.extraDice ?? 0) >= 1 &&
    "ignore" in modification &&
    modification.ignore === "lowest"
  );
}

export function rollPlusOneIgnoreLowestExtraDice(effect: CanonicalReplacement): number {
  if (!isRollPlusOneIgnoreLowestReplacement(effect)) return 0;
  const modification = effect.modification;
  return modification.type === "roll" && "extraDice" in modification
    ? (modification.extraDice ?? 0)
    : 0;
}

export function isDamageAmountBoostReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "damage" && effect.replaces.name !== "deal-damage") return false;
  return (
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "count" &&
    effect.modification.op === "add" &&
    // CR 6.4.10: admit any evaluatable FabAmount boost (number OR `{ type }`
    // object). The apply path resolves a live amount via evaluateAmount (see
    // resolveCanonicalAmount), so Aether Flare's "plus the arcane damage dealt
    // this turn" count-amount registers and resolves. A numeric amount must
    // still be positive; a FabAmount's positivity is enforced at apply time.
    (typeof effect.modification.amount === "number"
      ? effect.modification.amount > 0
      : isAdmissibleCanonicalAmount(effect.modification.amount))
  );
}

export function damageAmountBoostAmount(effect: CanonicalReplacement): FabAmount | null {
  if (
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "count" &&
    effect.modification.op === "add"
  ) {
    return effect.modification.amount;
  }
  return null;
}

/**
 * "The next time you would sharpen a sword this turn, instead sharpen it an
 * additional time." Modification is a bare `sharpen` leaf with times = extra
 * iterations beyond the original (proposeSharpen times semantics).
 */
export function isAdditionalSharpenReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "sharpen") return false;
  if (effect.modification.type !== "sharpen") return false;
  return (
    typeof effect.modification.times === "number" &&
    effect.modification.times > 0 &&
    Number.isFinite(effect.modification.times)
  );
}

/**
 * AHA005 Reverent Rerebrace: when you would sharpen a Zenith Blade, instead
 * you may pay {r} and destroy this; if you do, sharpen an additional time.
 * The candidate is offered only when the controller can pay 1{r} and the
 * source is still seated; application runs only after explicit acceptance.
 */
export function isOptionalPayDestroyAdditionalSharpenReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "sharpen") return false;
  if (effect.modification.type !== "optional") return false;
  const principal = effect.modification.effect;
  if (principal.type !== "sequence" || principal.steps.length !== 2) return false;
  const pay = principal.steps[0];
  const destroy = principal.steps[1];
  if (!pay || pay.type !== "pay") return false;
  if (pay.cost?.class !== "asset" || pay.cost.type !== "resources") return false;
  if (typeof pay.cost.amount !== "number" || pay.cost.amount < 1) return false;
  if (!destroy || destroy.type !== "destroy") return false;
  if (destroy.target?.selector !== "self") return false;
  const then = effect.modification.then;
  if (!then || then.type !== "sharpen") return false;
  // times:1 = one additional sharpen (base event already carries 1).
  return (
    then.times === undefined ||
    (typeof then.times === "number" && then.times > 0 && Number.isFinite(then.times))
  );
}

export function additionalSharpenExtra(effect: CanonicalReplacement): number {
  if (effect.modification.type === "sharpen" && typeof effect.modification.times === "number") {
    return Math.max(0, effect.modification.times);
  }
  if (
    effect.modification.type === "optional" &&
    effect.modification.then?.type === "sharpen" &&
    typeof effect.modification.then.times === "number"
  ) {
    return Math.max(0, effect.modification.then.times);
  }
  // Bare "additional time" with omitted times defaults to +1.
  if (effect.modification.type === "optional" && effect.modification.then?.type === "sharpen") {
    return 1;
  }
  return 0;
}

export function optionalPayDestroyResourceCost(effect: CanonicalReplacement): number {
  if (effect.modification.type !== "optional") return 0;
  const principal = effect.modification.effect;
  if (principal.type !== "sequence") return 0;
  const pay = principal.steps[0];
  if (
    pay?.type === "pay" &&
    pay.cost?.class === "asset" &&
    pay.cost.type === "resources" &&
    typeof pay.cost.amount === "number"
  ) {
    return pay.cost.amount;
  }
  return 0;
}

/**
 * "If one or more Frostbite tokens would be created under your control,
 * instead you may destroy/banish this." Application runs only after the
 * controller explicitly accepts the collected replacement.
 */
export function isOptionalDestroySelfCreateReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): effect is CanonicalReplacement {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "create") return false;
  const leaf =
    effect.modification.type === "optional" ? effect.modification.effect : effect.modification;
  if (leaf.type !== "destroy" && leaf.type !== "banish") return false;
  if (leaf.target?.selector !== "self") return false;
  return true;
}

/**
 * "If an opponent would draw 1 or more cards during your action phase, instead
 * destroy this and they draw that many minus 1."
 *
 * Draws are one-card-per-event, so minus 1 on a matching event cancels it
 * after destroying the source. Later draws in the same batch see a destroyed
 * source and are unreduced.
 */
/**
 * Returns boolean (not `effect is CanonicalReplacement`): after a prevention
 * branch has already narrowed `effect` to CanonicalReplacement, a failing
 * identity type-predicate collapses the remainder to `never`.
 */
export function isOpponentDrawMinusOneDestroySelfReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "draw") return false;
  if (effect.replaces.player !== "opponent") return false;
  if (effect.modification.type !== "sequence") return false;
  const [destroy, draw] = effect.modification.steps;
  if (!destroy || destroy.type !== "destroy") return false;
  if (destroy.target?.selector !== "self") return false;
  if (!draw || draw.type !== "draw") return false;
  if (draw.player !== "opponent") return false;
  const count = draw.count;
  if (typeof count !== "object" || count === null || !("type" in count)) return false;
  if (count.type !== "difference") return false;
  const operands = "operands" in count ? count.operands : null;
  if (!Array.isArray(operands) || operands.length !== 2) return false;
  return isEventAmount(operands[0]) && operands[1] === 1;
}

/**
 * "The first time an opponent would gain {h} each turn, instead you lose that
 * much and create that many [token] tokens."
 */
export function isOpponentGainLifeToLoseLifeCreateTokensReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): effect is CanonicalReplacement {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "gain-life") return false;
  if (effect.replaces.player !== "opponent") return false;
  if (effect.modification.type !== "sequence") return false;
  const steps = effect.modification.steps;
  if (steps.length !== 2) return false;
  const lose = steps[0];
  const create = steps[1];
  if (!lose || lose.type !== "lose-life") return false;
  if (lose.target?.selector !== "controller") return false;
  if (!isEventAmount(lose.amount)) return false;
  if (!create || create.type !== "create-token") return false;
  if (typeof create.token !== "string") return false;
  if (create.controller !== "controller") return false;
  if (!isEventAmount(create.count)) return false;
  return true;
}

/** "The next time a hero would gain {h}, instead they lose that much {h}." */
export function isGainLifeToLoseLifeReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): effect is CanonicalReplacement {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "gain-life") return false;
  if (effect.modification.type !== "lose-life") return false;
  if (effect.modification.target?.selector !== "each-hero") return false;
  return isEventAmount(effect.modification.amount);
}

/** Printed “instead you reveal their top and they reveal yours”. */
export function isClashSwapRevealReplacement(
  effect: CanonicalReplacement | CanonicalPrevention | FabEffect,
): effect is CanonicalReplacement & {
  readonly modification: Extract<FabEffect, { type: "swap-clash-reveals" }>;
} {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "clash" && effect.replaces.name !== "clash-outcome") return false;
  return effect.modification.type === "swap-clash-reveals";
}

/**
 * Outcome-stage re-clash shape: an optional typed `reclash` owns its exact
 * destroy cost and can only continue from the immutable replaced clash.
 */
/** Clash-outcome replacement: a tied clash instead has the controller win. */
export function isClashTieWinClashReplacement(
  effect: CanonicalReplacement | CanonicalPrevention | FabEffect,
): boolean {
  if (effect.type !== "replacement" || effect.replacementKind !== "outcome") return false;
  if (effect.replaces.name !== "clash-outcome" && effect.replaces.name !== "clash") return false;
  return effect.modification.type === "win-clash";
}

/**
 * Printed “If you would fail to win a clash revealing this, instead you win”
 * (Overturn the Results). `clash-lose` is an observation of clash-outcome;
 * the replaceable event is clash-outcome, and `subject: "self"` is the
 * revealed card.
 */
export function isClashFailToWinRevealingThisReplacement(
  effect: CanonicalReplacement | CanonicalPrevention | FabEffect,
): boolean {
  if (effect.type !== "replacement") return false;
  const name = effect.replaces.name;
  if (name !== "clash-outcome" && name !== "clash" && name !== "clash-lose") return false;
  if (effect.replaces.subject !== "self") return false;
  const modification = effect.modification;
  if (modification.type === "win-clash") return true;
  if (modification.type !== "sequence") return false;
  if (!modification.steps.some((step) => step.type === "win-clash")) return false;
  return modification.steps.every(
    (step) => step.type === "win-clash" || step.type === "crowd-boos",
  );
}

export function clashOutcomeOptionalReclash(
  effect: CanonicalReplacement | CanonicalPrevention | FabEffect,
): { readonly goldFilter: FabCardFilter } | null {
  if (effect.type !== "replacement" || effect.replacementKind !== "outcome") return null;
  if (effect.replaces.name !== "clash-outcome") return null;
  if (effect.modification.type !== "optional") return null;
  const reclash = effect.modification.effect;
  if (reclash.type !== "reclash" || reclash.from !== "replaced-clash") return null;
  if (reclash.cost.type !== "destroy") return null;
  const target = reclash.cost.target;
  if (target.selector !== "object" || target.declared !== "at-resolution") return null;
  if (target.player !== "controller" || target.count !== 1) return null;
  if (target.zones.length !== 1 || target.zones[0] !== "permanent" || !target.filter) return null;
  return { goldFilter: target.filter };
}

export function isEventAmount(amount: unknown): boolean {
  return (
    typeof amount === "object" &&
    amount !== null &&
    "type" in amount &&
    (amount as { type?: string }).type === "event-amount"
  );
}

export function isOncePerTurnReplacementLimit(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement" || !effect.limit) return false;
  return effect.limit.per === "turn" && effect.limit.count === 1;
}

/**
 * Self or filtered permanent enter-arena adds named counters on the entering
 * object. Apply path always attaches counters to event.data.object; target
 * self/object/binding is accepted when the modification is clearly "add N of
 * named counter X".
 */
export function isEnterArenaAddCounterReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "enter-arena") return false;
  if (effect.modification.type !== "add-counter") return false;
  const counter = effect.modification.counter;
  const namedOk = counter.kind === "named";
  const numericOk =
    counter.kind === "numeric" &&
    (counter.property === "power" ||
      counter.property === "defense" ||
      counter.property === "life") &&
    typeof counter.value === "number";
  if (!namedOk && !numericOk) return false;
  if (!isAdmissibleCanonicalAmount(effect.modification.count)) return false;
  if (typeof effect.modification.count === "number" && effect.modification.count < 1) return false;
  const subject = effect.replaces.subject;
  const subjectOk =
    subject === "self" ||
    subject === "any" ||
    (typeof subject === "object" && subject !== null && !Array.isArray(subject));
  if (!subjectOk) return false;
  const target = effect.modification.target;
  return (
    target.selector === "self" || target.selector === "binding" || target.selector === "object"
  );
}

/** CR 1.3.3b identity replacement: a matching permanent enters tapped. */
export function isEnterArenaTappedReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement" || effect.replaces.name !== "enter-arena") return false;
  if (effect.modification.type !== "tap") return false;
  const subject = effect.replaces.subject;
  if (
    subject !== "self" &&
    subject !== "any" &&
    !(typeof subject === "object" && subject !== null && !Array.isArray(subject))
  ) {
    return false;
  }
  return effect.modification.target.selector === "self";
}

/**
 * CR 1.9.2 / 6.4: "if you would create 1 or more tokens, instead create that
 * many plus/minus N of each of those tokens." Add and subtract share one path.
 */
export function isCreateExtraReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "create") return false;
  if (effect.modification.type === "create-extra") {
    return typeof effect.modification.amount === "number" && effect.modification.amount !== 0;
  }
  return (
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "count" &&
    (effect.modification.op === "add" || effect.modification.op === "subtract") &&
    typeof effect.modification.amount === "number" &&
    effect.modification.amount > 0
  );
}

export function createExtraAmount(effect: CanonicalReplacement): number {
  if (effect.modification.type === "create-extra") {
    return typeof effect.modification.amount === "number" ? effect.modification.amount : 0;
  }
  if (
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "count" &&
    typeof effect.modification.amount === "number"
  ) {
    if (effect.modification.op === "add") return effect.modification.amount;
    if (effect.modification.op === "subtract") return -effect.modification.amount;
  }
  return 0;
}

/** Static "would be put into a graveyard, instead put on the bottom of the deck". */
export function isGraveyardToDeckBottomReplacement(effect: CanonicalReplacement): boolean {
  if (effect.modification.type !== "move-card") return false;
  const to = effect.modification.to;
  if (to.zone !== "deck" || to.position !== "bottom") return false;
  const target = effect.modification.target;
  const targetOk = target.selector === "self" || target.selector === "binding";
  return (
    targetOk &&
    "to" in effect.replaces &&
    effect.replaces.to === "graveyard" &&
    (effect.replaces.name === "move-zone" ||
      effect.replaces.name === "put-into-graveyard" ||
      effect.replaces.name === "destroy" ||
      effect.replaces.name === "discard")
  );
}

/** Static "would be put into a graveyard, instead banish" destination rewrite. */
export function isGraveyardToBanishReplacement(effect: CanonicalReplacement): boolean {
  if (effect.modification.type !== "banish") return false;
  const target = effect.modification.target;
  const targetOk =
    target.selector === "self" ||
    target.selector === "binding" ||
    (target.selector === "object" && "zones" in target);
  // Printed patterns use move-zone to graveyard (Frankie) or self put-into-GY.
  return (
    targetOk &&
    "to" in effect.replaces &&
    effect.replaces.to === "graveyard" &&
    (effect.replaces.name === "move-zone" ||
      effect.replaces.name === "put-into-graveyard" ||
      effect.replaces.name === "destroy")
  );
}

/**
 * PEN276 Topsy Turvy: "if one or more cards would be put on top of a deck,
 * instead they're put on the bottom."
 * Rewrites move-zone → deck with position top to position bottom.
 */
export function isDeckTopToBottomReplacement(effect: CanonicalReplacement): boolean {
  if (effect.modification.type !== "move-card") return false;
  const to = effect.modification.to;
  if (to.zone !== "deck" || to.position !== "bottom") return false;
  const target = effect.modification.target;
  const targetOk =
    target.selector === "binding" ||
    target.selector === "self" ||
    (target.selector === "object" && "zones" in target);
  return (
    targetOk &&
    effect.replaces.name === "move-zone" &&
    "to" in effect.replaces &&
    effect.replaces.to === "deck" &&
    "position" in effect.replaces &&
    effect.replaces.position === "top"
  );
}

/** DTD164 Blasmophet: blood-debt lose-life → banish the controller's deck top. */
export function isBloodDebtLoseLifeToTopDeckBanishReplacement(
  effect: CanonicalReplacement,
): boolean {
  if (effect.replaces.name !== "lose-life") return false;
  if (effect.replaces.player !== "controller" || effect.replaces.source !== "blood-debt") {
    return false;
  }
  if (effect.modification.type !== "banish") return false;
  const target = effect.modification.target;
  return (
    target.selector === "object" &&
    target.declared === "at-resolution" &&
    target.player === "controller" &&
    target.zones.length === 1 &&
    target.zones[0] === "deck" &&
    target.position === "top" &&
    target.count === 1
  );
}

/**
 * PEN315 Myrkhellir Helm family: "The next time you would draw a card from a
 * [filter] token this turn, instead draw N cards."
 *
 * Architecture:
 * - Draw is one-card-per-event. Printed "draw 2 instead of 1" is modeled as
 *   modify-numeric count +1 → that many extra draw sub-events.
 * - `replaces.filter` qualifies the **source** of the draw (Gold token ability),
 *   not the drawn card. Matching the drawn card against name "Gold" never fires.
 * - Sub-events commit before the original (transaction-kernel order). Each deck
 *   move requires destinationRef.incarnation === objectIncarnation+1 at reduce
 *   time, so extras use resetOffset 0..N-1 and the original is rewritten to N.
 */
/**
 * SEA149 Not So Fast family: an OPPONENT draw sourced from a Gold token
 * (metatype Token, printed name Gold) is redirected wholesale to the
 * replacement controller — "instead you draw a card".
 */
export function isOpponentDrawRedirectToControllerReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "draw") return false;
  if (effect.replaces.player !== "opponent") return false;
  if (!effect.replaces.filter) return false;
  return (
    effect.modification.type === "draw" &&
    effect.modification.count === 1 &&
    effect.modification.player === "controller"
  );
}

export function isDrawCountBoostReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "draw") return false;
  if (!effect.replaces.filter) return false;
  return (
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "count" &&
    effect.modification.op === "add" &&
    typeof effect.modification.amount === "number" &&
    effect.modification.amount > 0
  );
}

/**
 * Vestige of Sol: pitch replacement that adds a fixed number of resources to
 * the pitch event's resourcesGenerated ("that many {r} plus 1" → amount 1).
 * Does not destroy the source (unlike Talisman of Recompense).
 */
export function isPitchResourceBoostReplacement(
  effect: CanonicalReplacement | CanonicalPrevention,
): boolean {
  if (effect.type !== "replacement") return false;
  if (effect.replaces.name !== "pitch") return false;
  return (
    effect.modification.type === "gain-resources" &&
    typeof effect.modification.amount === "number" &&
    effect.modification.amount > 0
  );
}

export function drawCountBoostExtra(effect: CanonicalReplacement): number {
  if (
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "count" &&
    effect.modification.op === "add" &&
    typeof effect.modification.amount === "number"
  ) {
    return effect.modification.amount;
  }
  return 0;
}

export type NamedCounterRemovalCost = {
  readonly class: "effect";
  readonly type: "remove-counters";
  readonly counter: { readonly kind: "named"; readonly name: string };
  readonly count?: unknown;
  readonly filter?: import("@tcg/flesh-and-blood-types").FabCardFilter;
};

export function isNamedCounterRemovalCost(cost: unknown): cost is NamedCounterRemovalCost {
  if (!cost || typeof cost !== "object") return false;
  const c = cost as {
    class?: string;
    type?: string;
    counter?: { kind?: string; name?: string };
  };
  return (
    c.class === "effect" &&
    c.type === "remove-counters" &&
    c.counter?.kind === "named" &&
    typeof c.counter.name === "string"
  );
}

export type BanishFromSoulCost = {
  readonly class: "effect";
  readonly type: "banish";
  readonly from: "soul";
  readonly count?: number;
};

/** Solray Plating family: optionalCost banish N from soul. */
export function isBanishFromSoulCost(cost: unknown): cost is BanishFromSoulCost {
  if (!cost || typeof cost !== "object") return false;
  const c = cost as {
    class?: string;
    type?: string;
    from?: string;
    count?: unknown;
  };
  return (
    c.class === "effect" &&
    c.type === "banish" &&
    c.from === "soul" &&
    (c.count === undefined || (typeof c.count === "number" && c.count >= 1))
  );
}

function isCreateTokenModification(
  effect: FabEffect | undefined,
): effect is FabEffect & { type: "create-token"; token: string } {
  return effect?.type === "create-token" && typeof effect.token === "string";
}

/** Calmveil-style create-token, or Interlude's "if another hero" conditional wrapper. */
export function isAdmissiblePreventionAdditionalCreateToken(effect: FabEffect): boolean {
  if (isCreateTokenModification(effect)) return true;
  return (
    effect.type === "conditional" &&
    isCreateTokenModification(effect.then) &&
    isAdmissiblePreventionFollowUpCondition(effect.condition)
  );
}

function isAdmissiblePreventionFollowUpCondition(condition: FabCondition): boolean {
  switch (condition.type) {
    case "and":
    case "or":
      return condition.conditions.every(isAdmissiblePreventionFollowUpCondition);
    case "not":
      return isAdmissiblePreventionFollowUpCondition(condition.condition);
    case "target-exists":
      return condition.target.selector === "hero" && condition.target.who === "another-hero";
    default:
      return false;
  }
}

/** Token slug if this prevention's additionalModification should fire for this recipient. */
export function preventionFollowUpCreateToken(
  effect: CanonicalPrevention,
  args: { readonly controllerId: string; readonly recipientPlayerId: string | null },
): string | null {
  const modification = effect.additionalModification;
  if (!modification) return null;
  if (isCreateTokenModification(modification)) return modification.token;
  if (modification.type !== "conditional" || !isCreateTokenModification(modification.then)) {
    return null;
  }
  if (!preventionFollowUpConditionHolds(modification.condition, args)) return null;
  return modification.then.token;
}

function preventionFollowUpConditionHolds(
  condition: FabCondition,
  args: { readonly controllerId: string; readonly recipientPlayerId: string | null },
): boolean {
  switch (condition.type) {
    case "and":
      return condition.conditions.every((part) => preventionFollowUpConditionHolds(part, args));
    case "or":
      return condition.conditions.some((part) => preventionFollowUpConditionHolds(part, args));
    case "not":
      return !preventionFollowUpConditionHolds(condition.condition, args);
    case "target-exists":
      return (
        condition.target.selector === "hero" &&
        condition.target.who === "another-hero" &&
        args.recipientPlayerId !== null &&
        args.recipientPlayerId !== args.controllerId
      );
    default:
      return false;
  }
}

/** Printed class shield ("you or a Pirate you control") — filter, not a chosen object. */
export function isClassShield(shielded: CanonicalPrevention["shielded"]): shielded is Extract<
  NonNullable<CanonicalPrevention["shielded"]>,
  { selector: "object" }
> & {
  readonly filter: FabCardFilter;
} {
  return Boolean(
    shielded &&
    shielded.selector === "object" &&
    "filter" in shielded &&
    shielded.filter &&
    (!("declared" in shielded) ||
      shielded.declared === "at-resolution" ||
      shielded.declared === "on-stack"),
  );
}

/** A one-card draw becomes one token controlled by the would-be drawer. */
export function isDrawToTokenReplacement(effect: CanonicalReplacement): boolean {
  return (
    effect.replaces.name === "draw" &&
    effect.modification.type === "create-token" &&
    typeof effect.modification.token === "string" &&
    effect.modification.controller === "target-controller" &&
    typeof effect.modification.count === "object" &&
    effect.modification.count.type === "event-amount"
  );
}

export function isPreventionSourceBanish(
  effect: FabEffect,
): effect is FabEffect & { type: "banish" } {
  return (
    effect.type === "banish" &&
    effect.target.selector === "binding" &&
    effect.target.binding === "damage-source"
  );
}
