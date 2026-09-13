/**
 * Mechanic leaf-effect proposals: clash (CR 8.3.34).
 *
 * Clash: each player reveals the top card of their deck. The player whose
 * revealed card has the highest {p} wins. Ties produce no winner.
 *
 * The proposal determines the outcome from the immutable rules snapshot and
 * emits three events:
 *  - `clash` (always) with `firstPlayerId` / `secondPlayerId`
 *  - `clash-win` for the winner (skipped on tie)
 *  - `clash-lose` for the loser (skipped on tie)
 *
 * A `clash-result` string binding ("won" | "lost" | "tie") is attached so that
 * subsequent `conditional` effect steps in the same sequence (e.g. Stonewall
 * Impasse's "If you win, +1{d}") can evaluate `has-status: won-clash` without
 * waiting for the event reducer to mutate state.
 */
import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { proposeNegate } from "./effects/negate.ts";
import type { FabObjectSnapshot, ProposedEvent } from "../events.ts";
import { fabActiveAttackIdentity, type FabClashId, type FabWagerPrize } from "../../game/combat.ts";
import { basePropertiesOf, fabCreatedObjectCanonicalId } from "../../cards.ts";
import { createSyntheticFabObjectSnapshot, snapshotObject } from "../snapshots.ts";
import { fabPlayerId } from "../../game/identity.ts";
import { isClashSwapRevealReplacement } from "../../kernel/replacements/admission.ts";
import { initialFabActiveFaceForCreatedName, selectFabActiveFace } from "../../game/active-face.ts";
import { resolveTransformIntoCanonicalId } from "../transform.ts";
import {
  type FabEffectProposalResult,
  type ProposalContext,
  baseEvent,
  heroTargets,
  findObject,
  objectTargets,
  unsupported,
} from "./shared.ts";

export function proposeMechanicEffect(
  ctx: ProposalContext,
  effect: FabEffect,
): FabEffectProposalResult | null {
  if (effect.type === "clash") {
    return proposeClash(ctx, effect);
  }
  if (effect.type === "transform") {
    return proposeTransform(ctx, effect);
  }
  if (effect.type === "transform-into-resolving-card") {
    return proposeTransformIntoResolvingCard(ctx, effect);
  }
  if (effect.type === "wager") {
    return proposeWager(ctx, effect);
  }
  if (effect.type === "win-wager") {
    return unsupported(effect, "win-wager requires a replaceable wager-loss outcome");
  }
  if (effect.type === "become") {
    return proposeBecome(ctx, effect);
  }
  if (effect.type === "contract-task" || effect.type === "contract-watch") {
    return proposeContract(ctx, effect);
  }
  return null;
}

export function proposeTransformIntoResolvingCard(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "transform-into-resolving-card" }>,
): FabEffectProposalResult {
  const { layer, processId, state, effectTargets, effectPath, targetPath } = ctx;
  if (layer.kind !== "card") {
    return unsupported(effect, "resolving-card transform requires a physical card layer");
  }
  const definition = layer.source.canonicalId
    ? state.cardDefinitions[layer.source.canonicalId]
    : undefined;
  if (
    definition?.layout.kind !== "flip" ||
    (definition.layout.family !== "invocation" && definition.layout.family !== "construct")
  ) {
    return unsupported(effect, "resolving-card transform requires an Invocation or Construct");
  }
  const targetGroups = [effect.target, ...(effect.additionalTargets ?? [])].map((target, index) =>
    objectTargets(
      state,
      layer,
      target,
      targetPath,
      effectTargets,
      effectPath,
      false,
      index === 0 ? "target" : `additional-target-${index - 1}`,
    ),
  );
  if (targetGroups.some((targets) => !targets || targets.length === 0)) {
    if (effect.onIncomplete === "negate-resolving-card") {
      return proposeNegate(ctx, { type: "negate", target: { selector: "self" } });
    }
    // CR 5.1.4 / 8.5.36: the target was legal when declared, but transform
    // changes only the exact object incarnation that was targeted. A stale
    // target makes this effect a successful no-op; it must not reject or
    // rewind the rest of the resolving Invocation/Construct layer.
    return { supported: true, events: [] };
  }
  const targets = targetGroups.flatMap((group) => group ?? []);
  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "transform",
        affected: targets,
        bindings: { transformed: targets },
        data: {
          object: targets[0]!,
          previous: targets[0]!,
          destination: { kind: "resolving-card", object: layer.source },
        },
      },
    ],
  };
}

/**
 * CR 8.5 wager: emit a `wager` observation and persist its prize on the
 * active chain link. The winner creates the prize only when that link resolves
 * (CR 8.5.46); creating it now incorrectly awards the attacker on a miss.
 */
function proposeWager(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "wager" }>,
): FabEffectProposalResult {
  const { layer, processId, state, effectTargets, effectPath, targetPath } = ctx;
  // Default wager subject is the open chain-link attack (CR 8.5 wager is a
  // prize on that attack). Attack reactions that wager without an explicit
  // attacker (Downswing) must not use the reaction layer as the subject.
  const link = state.combat?.activeLink;
  let attack = layer.source;
  if (!effect.attacker && link) {
    const identity = fabActiveAttackIdentity(link.activeAttack);
    const sourceId = link.activeAttack.sourceObjectId;
    attack =
      (identity ? findObject(state, identity) : undefined) ??
      (sourceId ? findObject(state, sourceId) : undefined) ??
      attack;
  } else if (effect.attacker) {
    const objects = objectTargets(
      state,
      layer,
      effect.attacker,
      `${targetPath}:wager-attacker`,
      effectTargets,
      effectPath,
    );
    if (objects && objects[0]) {
      attack = objects[0];
    } else if (
      effect.attacker.selector === "object" &&
      effect.attacker.declared === "at-resolution"
    ) {
      // Weapon attacks are proxies whose selected combat-chain target is the
      // physical weapon source. The target decision has already validated the
      // filter and persists one exact id at this effect path; recover that
      // object without confusing it with the activated equipment source.
      const selected = effectTargets[effectPath.join(".")];
      const activeSourceId = state.combat?.activeLink?.activeAttack.sourceObjectId;
      if (
        selected?.length === 1 &&
        selected[0]?.kind === "object" &&
        selected[0].ref.instanceId === activeSourceId &&
        state.objects[activeSourceId]?.incarnation === selected[0].ref.incarnation
      ) {
        attack = findObject(state, activeSourceId) ?? attack;
      }
    }
  }
  if (
    !link ||
    (fabActiveAttackIdentity(link.activeAttack) !== attack.instanceId &&
      link.activeAttack.sourceObjectId !== attack.instanceId)
  ) {
    return unsupported(effect, "wager requires the active attack and its defending hero");
  }
  const prize = capturedWagerPrize(effect);
  if (prize === undefined) {
    return unsupported(effect, "wager prize cannot be captured");
  }
  const wagerId = `wager-${processId}-${effectPath.join("-") || "root"}` as const;
  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "wager",
        affected: [attack],
        bindings: { attack, wagered: attack },
        data: {
          actorId: layer.controllerId,
          object: attack,
          wagerId,
          attackingPlayerId: link.attackingPlayerId,
          defendingPlayerId: link.defendingPlayerId,
          prize,
        },
      },
    ],
  };
}

function capturedWagerPrize(
  effect: Extract<FabEffect, { readonly type: "wager" }>,
): FabWagerPrize | null | undefined {
  if (effect.prize) {
    if (
      effect.prize.type === "create-token" &&
      typeof effect.prize.token === "string" &&
      effect.prize.controller === "winner" &&
      (effect.prize.count === undefined || effect.prize.count === 1)
    ) {
      return {
        kind: "create-token",
        canonicalIds: [fabCreatedObjectCanonicalId(effect.prize.token)],
      };
    }
    return { kind: "effect", effect: effect.prize };
  }
  if (!effect.stake) return null;
  const tokens =
    effect.stake === "gold-might-and-vigor" ? ["gold", "might", "vigor"] : [effect.stake];
  return {
    kind: "create-token",
    canonicalIds: tokens.map(fabCreatedObjectCanonicalId),
  };
}

/**
 * CR become: observation event when a hero becomes a demi-hero (or ally form).
 * Full identity swap lives in continuous/reducer paths; this emits the
 * subscriber-facing event with previous LKI on the controller's hero.
 */
function proposeBecome(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "become" }>,
): FabEffectProposalResult {
  const { layer, processId, state } = ctx;
  void effect;
  const heroId = state.containers.zonesByPlayerId[layer.controllerId]?.heroZone[0];
  const subject = heroId
    ? snapshotObject(state, heroId, layer.controllerId, "heroZone")
    : layer.source;
  const event: ProposedEvent = {
    ...baseEvent(layer, processId),
    name: "become",
    affected: [subject],
    bindings: { became: subject },
    data: {
      playerId: layer.controllerId,
      object: subject,
      previous: subject,
    },
  };
  return { supported: true, events: [event] };
}

/**
 * Contract label keyword (`{ type: "contract-task", completeOn, filter }`):
 * seat the contract on the source. Completion is CR 8.5.39a — the contracted
 * player must perform `completeOn` while the effect exists. Pre-existing
 * matching cards in banished do not complete a newly seated contract.
 */
function proposeContract(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "contract-task" | "contract-watch" }>,
): FabEffectProposalResult {
  if (effect.type !== "contract-task") {
    return unsupported(effect, "contract-watch form is not yet canonical");
  }
  const { layer, processId } = ctx;
  const task = effect.task;
  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "set-status",
        affected: [layer.source],
        bindings: { contract: layer.source, "active-contract": task },
        data: { object: layer.source, status: `contract:${task}` },
      },
    ],
  };
}

/**
 * Transform / flip identity. Paths:
 * - self / controller hero (traverse, transcend, agent-of-chaos, become-face)
 * - object on-stack when printed "target" (Silken Form: target ash, CR 1.8.5)
 * - object at-resolution when the transform has no printed target
 *
 * `into` is a token slug (`aether-ashwing`), special keyword (`traverse`),
 * or `this` (Evo equip). English article residue (`an-aether-ashwing`) is
 * normalized at reduce time so partial catalog models still resolve.
 */
function proposeTransform(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "transform" }>,
): FabEffectProposalResult {
  const { layer, processId, state, effectTargets, effectPath, targetPath } = ctx;
  // Self-target on the source (hero ability) is the common path. Equipment
  // "you become …" (Mask of Deceit) targets the controller's seated hero.
  let targets: FabObjectSnapshot[] = [];
  if (effect.target.selector === "self") {
    targets = [layer.source];
  } else if (effect.target.selector === "controller") {
    const heroId = state.containers.zonesByPlayerId[layer.controllerId]?.heroZone[0];
    if (heroId) {
      const hero = snapshotObject(state, heroId, layer.controllerId, "heroZone");
      if (hero) targets = [hero];
    }
  } else {
    // Silken Form / Dromai family: target ash (or other permanents) you control.
    const objects = objectTargets(
      state,
      layer,
      effect.target,
      targetPath,
      effectTargets,
      effectPath,
    );
    if (objects) targets = [...objects];
  }
  if (targets.length === 0) {
    // A required at-resolution target can cease to exist, or its legal pool
    // can be empty. The targeted effect then does nothing; the layer itself
    // still resolves normally. `objectTargets` returning null above remains
    // the distinct "selection not declared yet" state.
    return { supported: true, events: [] };
  }
  const into = effect.into;
  if (into !== "traverse" && into !== "token" && typeof into !== "string") {
    return unsupported(effect, "transform into is not canonical");
  }
  const events: ProposedEvent[] = [];
  // CR 8.5.36a: the committed event carries BOTH identities of the transform.
  // Named-into destinations resolve to an incoming-identity snapshot so
  // source-bound "transforms from or into [spec]" triggers can filter the
  // partner even when the destination is not an existing arena object.
  const intoDefinitionId =
    typeof into === "string" && into !== "traverse" && into !== "token" && into !== "this"
      ? resolveTransformIntoCanonicalId(state.cardDefinitions, into)
      : null;
  const intoDefinition = intoDefinitionId
    ? (state.cardDefinitions[intoDefinitionId] ?? null)
    : null;
  for (const targetObject of targets) {
    const targetCanonicalId = targetObject.canonicalId;
    if (!targetCanonicalId) continue;
    const targetDefinition = state.cardDefinitions[targetCanonicalId];
    const traverseActiveFace =
      into === "traverse" && targetDefinition?.layout.kind === "twin"
        ? selectFabActiveFace(
            targetDefinition,
            targetObject.activeFace?.kind === "paired" &&
              targetObject.activeFace.activeFaceIds.includes(targetDefinition.layout.back.faceId)
              ? targetDefinition.layout.front.faceId
              : targetDefinition.layout.back.faceId,
          )
        : null;
    const intoObject =
      traverseActiveFace && targetDefinition
        ? createSyntheticFabObjectSnapshot({
            ref: targetObject.ref,
            canonicalId: targetCanonicalId,
            objectKind: targetObject.objectKind,
            baseSource: targetObject.baseSource,
            ownerId: targetObject.ownerId,
            controllerId: targetObject.controllerId,
            zone: targetObject.zone,
            zoneRef: targetObject.zoneRef,
            base: basePropertiesOf(targetDefinition, { kind: "whole-card" }, traverseActiveFace),
            activeFace: traverseActiveFace,
          })
        : into === "this"
          ? layer.source
          : intoDefinition && intoDefinitionId
            ? createSyntheticFabObjectSnapshot({
                ref: {
                  instanceId: `${processId}:${layer.layerId}:${targetPath}:transform-into`,
                  incarnation: state.counters.objectIncarnation + 1,
                },
                canonicalId: intoDefinitionId,
                objectKind: "catalog-card",
                baseSource: { kind: "registered" },
                ownerId: layer.controllerId,
                controllerId: layer.controllerId,
                zone: "unknown",
                zoneRef: { playerId: fabPlayerId(layer.controllerId), zone: "arena" },
                base: basePropertiesOf(intoDefinition),
                activeFace: initialFabActiveFaceForCreatedName(intoDefinition, into),
              })
            : null;
    events.push({
      ...baseEvent(layer, processId),
      name: "transform",
      affected: [targetObject],
      bindings: { transformed: targetObject },
      data: {
        object: targetObject,
        previous: targetObject,
        into,
        ...(intoObject ? { intoObject } : {}),
      },
    });
  }
  return { supported: true, events };
}

function proposeClash(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "clash" }>,
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  const controllerId = layer.controllerId;

  // Determine the opponent from the `with` selector (default: attacking-hero).
  const opponentIds = heroTargets(state, layer, effect.with, ctx.targetPath);
  if (!opponentIds || opponentIds.length === 0) {
    return unsupported(effect, "clash has no opposing hero target");
  }
  const opponentId = opponentIds[0]!;

  const clashId = `clash-${processId}-${ctx.effectPath.join("-") || "root"}` as const;
  const events = proposeFreshClashEvents(
    state,
    {
      ...baseEvent(layer, processId),
      name: "clash",
      affected: [],
      bindings: layer.bindings,
      data: { firstPlayerId: controllerId, secondPlayerId: opponentId },
    },
    clashId,
    controllerId,
    opponentId,
  );

  return {
    supported: true,
    events,
    eventGroups: [events],
  };
}

/**
 * Build one complete provisional clash from the current snapshot. Re-clash
 * calls this only after the selected original reveal has moved, so deck tops
 * are never cached across that movement boundary.
 */
export function proposeFreshClashEvents(
  state: ProposalContext["state"],
  template: ProposedEvent,
  clashId: FabClashId,
  firstPlayerId: string,
  secondPlayerId: string,
): ProposedEvent[] {
  const swap = (state.replacementEffects ?? []).find(
    (replacement) =>
      isClashSwapRevealReplacement(replacement.effect) &&
      replacement.controllerId === firstPlayerId,
  );
  const firstDeck = state.containers.zonesByPlayerId[firstPlayerId]?.deck ?? [];
  const secondDeck = state.containers.zonesByPlayerId[secondPlayerId]?.deck ?? [];
  const firstRevealDeck = swap ? secondDeck : firstDeck;
  const secondRevealDeck = swap ? firstDeck : secondDeck;
  const firstRevealOwnerId = swap ? secondPlayerId : firstPlayerId;
  const secondRevealOwnerId = swap ? firstPlayerId : secondPlayerId;
  const firstTopId = firstRevealDeck[firstRevealDeck.length - 1];
  const secondTopId = secondRevealDeck[secondRevealDeck.length - 1];
  const firstTop = firstTopId
    ? snapshotObject(state, firstTopId, firstRevealOwnerId, "deck")
    : null;
  const secondTop = secondTopId
    ? snapshotObject(state, secondTopId, secondRevealOwnerId, "deck")
    : null;
  const firstPowerBonus = revealPowerBonus(state, firstPlayerId);
  const secondPowerBonus = revealPowerBonus(state, secondPlayerId);
  const firstPower = firstTop ? topCardPower(state, firstTop) + firstPowerBonus : null;
  const secondPower = secondTop ? topCardPower(state, secondTop) + secondPowerBonus : null;
  const firstComparisonValue = firstPower ?? -1;
  const secondComparisonValue = secondPower ?? -1;
  const firstWins = firstComparisonValue > secondComparisonValue;
  const secondWins = secondComparisonValue > firstComparisonValue;
  const winnerId = firstWins ? firstPlayerId : secondWins ? secondPlayerId : null;
  const loserId = firstWins ? secondPlayerId : secondWins ? firstPlayerId : null;
  const clashBinding: Record<string, string | FabObjectSnapshot> = {
    "clash-result": firstWins ? "won" : secondWins ? "lost" : "tie",
    ...(winnerId ? { winner: winnerId } : {}),
    ...(loserId ? { loser: loserId } : {}),
    ...(firstTop ? { "revealed-clash-controller": firstTop } : {}),
    ...(secondTop ? { "revealed-clash-opponent": secondTop } : {}),
  };
  const events: ProposedEvent[] = [];
  if (firstTop) {
    events.push({
      ...template,
      name: "reveal",
      affected: [firstTop],
      bindings: { ...template.bindings, revealed: firstTop },
      data: { playerId: firstPlayerId, object: firstTop },
    });
  }
  if (secondTop) {
    events.push({
      ...template,
      name: "reveal",
      affected: [secondTop],
      bindings: { ...template.bindings, revealed: secondTop },
      data: { playerId: secondPlayerId, object: secondTop },
    });
  }
  events.push({
    ...template,
    name: "clash",
    affected: [firstTop, secondTop].filter(
      (object): object is FabObjectSnapshot => object !== null,
    ),
    bindings: { ...template.bindings, ...clashBinding },
    data: { firstPlayerId, secondPlayerId },
  });
  events.push({
    ...template,
    name: "clash-outcome",
    affected: [firstTop, secondTop].filter(
      (object): object is FabObjectSnapshot => object !== null,
    ),
    bindings: { ...template.bindings, ...clashBinding },
    data: {
      clashId,
      firstPlayerId,
      secondPlayerId,
      winnerId,
      firstPower,
      secondPower,
      firstHasPower: firstTop !== null && hasClashPower(firstTop, firstPowerBonus),
      secondHasPower: secondTop !== null && hasClashPower(secondTop, secondPowerBonus),
      revealed: [firstTop, secondTop].filter(
        (object): object is FabObjectSnapshot => object !== null,
      ),
    },
  });
  const swapPrize =
    swap && isClashSwapRevealReplacement(swap.effect) ? swap.effect.modification.prize : undefined;
  if (swapPrize && winnerId === firstPlayerId) {
    events.push({
      ...template,
      name: "clash-prize",
      affected: [firstTop, secondTop].filter(
        (object): object is FabObjectSnapshot => object !== null,
      ),
      bindings: { ...template.bindings, ...clashBinding },
      data: {
        clashId,
        branches: [],
        deferredEffect: swapPrize,
      },
    });
  }
  return events;
}

/** Printed {p} of a deck-top snapshot. Non-power cards compare as 0 (CR 8.5.45b). */
function topCardPower(_state: ProposalContext["state"], snapshot: FabObjectSnapshot): number {
  return snapshot.baseNumeric?.power ?? snapshot.current.numeric?.power ?? 0;
}

function hasClashPower(snapshot: FabObjectSnapshot, revealPowerBonusAmount: number): boolean {
  return (
    snapshot.baseNumeric?.power !== undefined ||
    snapshot.current.numeric?.power !== undefined ||
    revealPowerBonusAmount !== 0
  );
}

/**
 * Match-fixer style continuous: +N power for the first revealed clash card of
 * a player this turn. Sum remaining futureApplicability power-add atoms whose
 * filter is hasStatus:"revealed" and whose controller is not the revealed
 * player (the buff is granted BY someone ELSE onto "their" reveals) OR whose
 * controller is anyone with remaining quota.
 *
 * Controllers register the continuous; the bonus applies when THAT controller
 * is comparing against a card revealed by another player — for match-fixer,
 * the buff targets the chosen opponent's reveal. We approximate: any active
 * remaining revealed-filter power-add applies to reveals by non-controllers
 * of the continuous (the "they" in "the first card they reveal").
 */
function revealPowerBonus(state: ProposalContext["state"], revealedByPlayerId: string): number {
  let bonus = 0;
  for (const instance of state.continuousEffectInstances ?? []) {
    const future = instance.futureApplicability;
    if (!future || future.remaining <= 0) continue;
    if (future.filter?.hasStatus !== "revealed") continue;
    // Buff is registered by match-fixer (controller) and applies to the
    // opponent's reveal — not the controller's own top.
    if (instance.controllerId === revealedByPlayerId) continue;
    for (const atom of instance.atoms) {
      if (
        atom.kind === "numeric" &&
        atom.property === "power" &&
        atom.operation === "add" &&
        typeof atom.amount === "number"
      ) {
        bonus += atom.amount;
      }
    }
  }
  return bonus;
}
