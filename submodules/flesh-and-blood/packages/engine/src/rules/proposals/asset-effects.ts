import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { nextRandom } from "../../random.ts";
import type { ProposedEvent } from "../events.ts";
import {
  staticOptionalDestroyRerollCount,
  staticRollPlusOneIgnoreLowestExtraDice,
} from "../../kernel/replacements/index.ts";
import { buildFabRulesView, matchesFabSnapshotFilter } from "../state-rules-view.ts";
import { nextFabDestinationRef, snapshotObject } from "../snapshots.ts";
import {
  type FabEffectProposalResult,
  type ProposalContext,
  baseEvent,
  damageTargets,
  heroTargets,
  isExactAttackBinding,
  isObjectSnapshot,
  objectTargets,
  playersForFabPlayer,
  resolveLayerAmount,
  unsupported,
  withObjectIncarnationOffset,
} from "./shared.ts";

export function proposeGainLife(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "gain-life" | "lose-life" }>,
): FabEffectProposalResult {
  return proposeLifeChange(ctx, effect);
}

export function proposeLoseLife(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "gain-life" | "lose-life" }>,
): FabEffectProposalResult {
  return proposeLifeChange(ctx, effect);
}

function proposeLifeChange(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "gain-life" | "lose-life" }>,
): FabEffectProposalResult {
  const { state, layer, processId, targetPath } = ctx;
  const amount =
    typeof effect.amount === "number"
      ? effect.amount
      : resolveLayerAmount(state, layer, effect.amount);
  if (amount === null) return unsupported(effect, "non-constant life amount");
  const objectEvents: ProposedEvent[] = [];
  let playerIds = heroTargets(state, layer, effect.target, targetPath);
  if (!playerIds) {
    if (!("selector" in effect.target) || effect.target.selector !== "object") {
      return unsupported(effect, "life target requires a decision or binding");
    }
    // Object-selector life changes (HNT016) may match both seated heroes and
    // living objects such as allies. Preserve that distinction in the event:
    // player life and object life have separate reducers and history.
    const objects = objectTargets(
      state,
      layer,
      effect.target,
      targetPath,
      ctx.effectTargets,
      ctx.effectPath,
    );
    if (!objects) return unsupported(effect, "life target is unresolved");
    playerIds = [
      ...new Set(
        objects.flatMap((object) => {
          if (!object.current.typeBox.types.includes("Hero")) return [];
          const controllerId = object.controllerId ?? object.ownerId;
          return state.playerIds.filter((id) => id === controllerId);
        }),
      ),
    ];
    for (const object of objects) {
      if (
        object.current.typeBox.types.includes("Hero") ||
        object.current.numeric.life === undefined
      ) {
        continue;
      }
      const playerId = object.controllerId ?? object.ownerId;
      if (!state.playerIds.some((id) => id === playerId)) continue;
      if (effect.type === "gain-life") {
        objectEvents.push({
          ...baseEvent(layer, processId),
          name: "gain-life",
          affected: [object],
          data: { playerId, amount, objectInstanceId: object.instanceId },
        });
      } else {
        objectEvents.push({
          ...baseEvent(layer, processId),
          name: "lose-life",
          affected: [object],
          data: {
            playerId,
            amount,
            objectInstanceId: object.instanceId,
            source: layer.source.instanceId,
          },
        });
      }
    }
  }
  let eligiblePlayerIds = playerIds;
  if (effect.type === "gain-life") {
    const view = buildFabRulesView(state);
    const restrictedPlayers = new Set<string>();
    for (const rule of view.rules("gain-life")) {
      if (rule.mode !== "restrict") continue;
      // A subjectless restriction is game-wide ("Heroes can't gain life").
      // Subject-bound rules instead name the exact hero object whose gain is
      // prohibited (Reaping Blade, Dread Scythe).
      if (rule.scope.kind === "game") {
        for (const playerId of state.playerIds) restrictedPlayers.add(playerId);
        continue;
      }
      for (const subject of rule.scope.subjects) {
        const hero = view.object(subject);
        if (!hero?.current.typeBox.types.includes("Hero")) continue;
        restrictedPlayers.add(hero.controllerId ?? hero.ownerId);
      }
    }
    // CR 1.9.2c: "each hero" is a multi-event. A restriction cancels only
    // the prohibited hero's individual gain, not the other recipient's event.
    eligiblePlayerIds = playerIds.filter((playerId) => !restrictedPlayers.has(playerId));
  }
  return {
    supported: true,
    events: [
      ...eligiblePlayerIds.map((playerId) => ({
        ...baseEvent(layer, processId),
        name: effect.type,
        affected: [],
        data:
          effect.type === "gain-life"
            ? { playerId, amount }
            : { playerId, amount, source: layer.source.instanceId },
      })),
      ...objectEvents,
    ] as ProposedEvent[],
  };
}

export function proposeLoseGame(
  ctx: ProposalContext,
  effect: FabEffect & { type: "lose-game" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  const playerIds = playersForFabPlayer(state, layer.controllerId, effect.player);
  if (!playerIds || playerIds.length !== 1)
    return unsupported(effect, "losing player requires one deterministic player");
  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "lose-game",
        affected: [],
        data: { playerId: playerIds[0]!, reason: "effect" },
      },
    ],
  };
}

function proposeAssetGain(
  ctx: ProposalContext,
  effect:
    | Extract<FabEffect, { type: "gain-action-points" | "gain-resources" | "gain-chi" }>
    | (FabEffect & { type: "amp" }),
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  const amount =
    typeof effect.amount === "number"
      ? effect.amount
      : resolveLayerAmount(state, layer, effect.amount);
  if (amount === null) return unsupported(effect, "non-constant asset amount");
  const playerIds = playersForFabPlayer(
    state,
    layer.controllerId,
    "target" in effect ? (effect.target ?? "controller") : "controller",
    layer.bindings,
  );
  if (!playerIds) return unsupported(effect, "asset recipient requires a binding or outcome");
  // CR 1.13.2b: outside its own action phase a player does not gain AP. Keep
  // the enclosing effect resolved (for example, an accepted Beaten Trackers
  // destroy), but do not emit an impossible asset event.
  if (
    effect.type === "gain-action-points" &&
    playerIds.every((playerId) => state.phase !== "action" || playerId !== state.activePlayerId)
  ) {
    return { supported: true, events: [] };
  }
  return {
    supported: true,
    events: playerIds.map((playerId) => ({
      ...baseEvent(layer, processId),
      name: "gain-assets" as const,
      affected: [],
      data: {
        playerId,
        resources: effect.type === "gain-resources" ? amount : 0,
        chi: effect.type === "gain-chi" ? amount : 0,
        actionPoints: effect.type === "gain-action-points" ? amount : 0,
        amp: effect.type === "amp" ? amount : 0,
        origin: "effect" as const,
      },
    })),
  };
}

export function proposeGainActionPoints(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "gain-action-points" | "gain-resources" | "gain-chi" }>,
): FabEffectProposalResult {
  return proposeAssetGain(ctx, effect);
}

export function proposeGainResources(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "gain-action-points" | "gain-resources" | "gain-chi" }>,
): FabEffectProposalResult {
  return proposeAssetGain(ctx, effect);
}

export function proposeGainChi(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "gain-action-points" | "gain-resources" | "gain-chi" }>,
): FabEffectProposalResult {
  return proposeAssetGain(ctx, effect);
}

export function proposeAmp(
  ctx: ProposalContext,
  effect: FabEffect & { type: "amp" },
): FabEffectProposalResult {
  const gained = proposeAssetGain(ctx, effect);
  if (!gained.supported) return gained;
  const { state, layer, processId, targetPath } = ctx;
  const amount =
    typeof effect.amount === "number"
      ? effect.amount
      : resolveLayerAmount(state, layer, effect.amount);
  if (amount === null) return unsupported(effect, "amp amount is unresolved");
  // Amp 0 (no life gained this turn) is a determined no-op, not unresolved.
  if (amount <= 0) return gained;

  // CR 8.5.47: Amp is not merely a turn observation. It creates a one-shot
  // replacement for the next arcane damage event controlled by its recipient.
  // Keep the gain-assets event for the public mechanic journal, and register
  // the replacement in the same resolving batch so it is available before
  // the next card can resolve.
  return {
    supported: true,
    events: [
      ...gained.events,
      {
        ...baseEvent(layer, processId),
        name: "register-replacement",
        affected: [layer.source],
        data: {
          replacementId: `${processId}:${layer.layerId}:${targetPath}:amp-replacement`,
          controllerId: layer.controllerId,
          source: layer.source,
          effect: {
            type: "replacement",
            replacementKind: "standard",
            replaces: {
              name: "damage",
              damageType: "arcane",
              // Keyword Amp has no source-type restriction (CR 8.5.47).
              // Cards with narrower printed text carry it explicitly.
              ...(effect.sourceFilter ? { filter: effect.sourceFilter } : {}),
            },
            modification: {
              type: "modify-numeric",
              property: "count",
              op: "add",
              amount,
              target: { selector: "self" },
              duration: "permanent",
            },
            duration: "this-turn",
          },
          applicationPolicy: { kind: "mandatory" },
          consumptionPolicy: { kind: "on-application" },
        },
      },
    ],
  };
}

function proposeCrowd(
  ctx: ProposalContext,
  effect: FabEffect & { type: "crowd-cheers" | "crowd-boos" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  const playerIds = playersForFabPlayer(state, layer.controllerId, effect.target);
  if (!playerIds) return unsupported(effect, `${effect.type} target is unresolved`);
  const recipients = playerIds.filter((playerId) => {
    if (!effect.filter) return true;
    const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
    if (!heroId) return false;
    const hero = snapshotObject(state, heroId, playerId, "heroZone");
    return matchesFabSnapshotFilter(
      state,
      hero,
      effect.filter,
      layer.bindings,
      layer.controllerId,
      layer.source.ref,
    );
  });
  return {
    supported: true,
    events: recipients.map((playerId) => ({
      ...baseEvent(layer, processId),
      // CR 8.5.57: the recipient is the player considered cheered/booed.
      actorId: playerId,
      name: effect.type,
      affected: [],
      data: { playerId },
    })),
  };
}

export function proposeCrowdCheers(
  ctx: ProposalContext,
  effect: FabEffect & { type: "crowd-cheers" },
): FabEffectProposalResult {
  return proposeCrowd(ctx, effect);
}

export function proposeCrowdBoos(
  ctx: ProposalContext,
  effect: FabEffect & { type: "crowd-boos" },
): FabEffectProposalResult {
  return proposeCrowd(ctx, effect);
}

export function proposeDealDamage(
  ctx: ProposalContext,
  effect: FabEffect & { type: "deal-damage" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const targets = damageTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
  if (!targets) return unsupported(effect, "damage target is unresolved");
  // Optional explicit damage source (Danger Digits / Throw Dagger family:
  // "target dagger … deals 1 damage"). On-stack source is keyed as
  // `${targetPath}:source` via collectDeclaredTargets.
  let damageSource = layer.source;
  if (effect.source) {
    if (effect.source.selector === "object") {
      const sourceTarget =
        effect.source.selector === "object" &&
        effect.source.zones?.includes("combat-chain") &&
        !effect.source.zones.includes("weapon") &&
        ((effect.source.filter?.typeBox?.subtypes as readonly string[] | undefined)?.includes(
          "Dagger",
        ) ||
          (effect.source.filter?.and ?? []).some((part) =>
            (part.typeBox?.subtypes as readonly string[] | undefined)?.includes("Dagger"),
          ))
          ? {
              ...effect.source,
              player: effect.source.player ?? ("controller" as const),
              zones: ["weapon", "permanent", "combat-chain"] as const,
            }
          : effect.source;
      const sources = objectTargets(
        state,
        layer,
        sourceTarget,
        targetPath,
        effectTargets,
        effectPath,
        false,
        "source",
      );
      if (!sources || sources.length === 0) {
        return unsupported(effect, "damage source is unresolved");
      }
      // Single-source pings (count:1); multi-source star dealt elsewhere.
      damageSource = sources[0]!;
    } else if (effect.source.selector === "self") {
      damageSource = layer.source;
    } else if (effect.source.selector === "controller") {
      // "your hero deals 1 arcane" — Nucleus Aetherbolt / Echoflash.
      const heroId = state.containers.zonesByPlayerId[layer.controllerId]?.heroZone[0];
      const hero = heroId ? snapshotObject(state, heroId, layer.controllerId, "heroZone") : null;
      if (!hero) return unsupported(effect, "damage source controller hero is unresolved");
      damageSource = hero;
    } else if (effect.source.selector === "binding") {
      const binding = layer.bindings[effect.source.binding];
      if (isExactAttackBinding(binding)) {
        damageSource = binding.object;
      } else if (isObjectSnapshot(binding)) {
        damageSource = binding;
      } else {
        return unsupported(effect, "damage source binding is unresolved");
      }
    } else {
      return unsupported(effect, "unsupported damage source selector");
    }
  }
  // Stamp resolution bindings so sequence follow-ups can read "it" (the
  // dealing object) and has-status "damage-dealt-this-way".
  const events: ProposedEvent[] = [];
  // Built once and reused per target: the loop body only reads `state` and
  // pushes to the local `events` array, so the view is stable across iterations
  // (the memo in state-rules-view keys on the state ref + counters, but hoisting
  // removes reliance on that invariant surviving future edits).
  const damageTargetView = buildFabRulesView(state);
  for (const target of targets) {
    // CR 8.5.3c: a non-living object cannot be dealt damage — the effect fails
    // for it. Defense-in-depth: non-living permanents are also excluded from
    // damage targeting by objectTargets zone-matching, but this gate guarantees
    // 8.5.3c for any non-living object that reaches proposal (e.g. via a
    // binding target path). Hero targets always have life and always pass.
    if (typeof target !== "string" && "instanceId" in target) {
      const life = damageTargetView.object({
        instanceId: target.instanceId,
        incarnation: target.ref.incarnation,
      })?.current.numeric.life;
      if (life === undefined) continue;
    }
    const targetControllerId =
      typeof target === "string"
        ? target
        : "controllerId" in target
          ? target.controllerId
          : target.playerId;
    const amount = resolveLayerAmount(
      state,
      {
        ...layer,
        bindings:
          targetControllerId === null
            ? layer.bindings
            : { ...layer.bindings, "target-controller": targetControllerId },
      },
      effect.amount,
    );
    if (amount === null) return unsupported(effect, "damage amount is unresolved");
    events.push({
      ...baseEvent(layer, processId),
      name: "deal-damage",
      source: damageSource,
      affected: "instanceId" in target ? [target] : [],
      bindings: {
        ...layer.bindings,
        ...(targetControllerId === null ? {} : { "target-controller": targetControllerId }),
        // Default `it` is the damage source only when an earlier sequence step
        // has not already stamped `it` (Gateway: reveal then "banish it").
        ...(layer.bindings["it"] === undefined && effect.outputBinding === undefined
          ? { it: damageSource }
          : {}),
        ...(effect.outputBinding ? { [effect.outputBinding]: damageSource } : {}),
        ...("instanceId" in target ? { "damage-target": target } : {}),
        ...(amount > 0 ? { "damage-dealt-this-way": amount } : {}),
        ...heroDealtDamageThisWayBindings(target, amount),
        ...iceFusionDamageTargetBindings(target, amount),
      },
      data: { source: damageSource, target, amount, damageType: effect.damageType },
    });
  }
  return {
    supported: true,
    events,
  };
}

/** Ice Fusion riders (Encase, Polar Cap, Icevein, Succumb) read these after
 * the just-proposed packet. Target facts are independent of prevention.
 * `proposeSequence` overwrites `dealt-damage-to-hero` from the committed
 * post-replacement preview (CR 6.4 / 8.5.3a). Wizard arcane is not combat, so
 * these are not `attack-target`. */
function heroDealtDamageThisWayBindings(target: unknown, amount: number): Record<string, unknown> {
  if (amount <= 0 || target === null || typeof target !== "object") return {};
  if ("kind" in target && (target as { kind: string }).kind === "hero") {
    return { "heroes-dealt-damage-this-way-count": 1 };
  }
  if ("instanceId" in target) {
    const types =
      (target as { current?: { typeBox?: { types?: readonly string[] } } }).current?.typeBox
        ?.types ?? [];
    if (types.includes("Hero")) {
      return {
        "heroes-dealt-damage-this-way": [target],
        "heroes-dealt-damage-this-way-count": 1,
      };
    }
  }
  return {};
}

function iceFusionDamageTargetBindings(
  target:
    | { readonly kind: "hero"; readonly playerId: string }
    | {
        readonly current?: { readonly typeBox?: { readonly subtypes?: readonly string[] } };
        readonly markers?: readonly { readonly kind: string }[];
      },
  amount: number,
): Record<string, string> {
  const isHero = "kind" in target && target.kind === "hero";
  let isFrozenAlly = false;
  if (!isHero && "current" in target) {
    const isAlly = (target.current?.typeBox?.subtypes ?? []).includes("Ally");
    const frozen = target.markers?.some((marker) => marker.kind === "frozen") === true;
    isFrozenAlly = isAlly && frozen;
  }
  return {
    "targets-a-hero": isHero ? "true" : "false",
    "dealt-damage-to-hero": isHero && amount > 0 ? "true" : "false",
    "targets-a-frozen-ally": isFrozenAlly ? "true" : "false",
  };
}

export function proposePay(
  ctx: ProposalContext,
  effect: FabEffect & { type: "pay" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  const playerIds = playersForFabPlayer(state, layer.controllerId, effect.payer, layer.bindings);
  if (!playerIds || playerIds.length !== 1) {
    return unsupported(effect, "pay payer requires one deterministic player");
  }
  const playerId = playerIds[0]!;

  // Mixed package: "you may {t} this and pay {r}" (Magmatic Carapace) and
  // "you may {t} your hero and destroy this" (Prizeworn). All parts must be
  // payable or the package fails closed (empty events) so optional.then
  // does not fire.
  if (effect.cost.class === "mixed" && effect.cost.type === "all") {
    const events: ProposedEvent[] = [];
    const sourceLive = state.objects[layer.source.instanceId];
    if (!sourceLive) {
      return { supported: true, events: [] };
    }
    const sourceSnap = layer.source;
    const resources = state.players[playerId]?.resourcePoints ?? 0;
    let resetOffset = 0;
    for (const part of effect.cost.costs) {
      if (part.class === "asset" && part.type === "resources" && typeof part.amount === "number") {
        if (part.amount > 0 && resources < part.amount) {
          return { supported: true, events: [] };
        }
        if (part.amount > 0) {
          events.push({
            ...baseEvent(layer, processId),
            name: "pay-resources",
            affected: [],
            bindings: { "resources-paid-this-way": part.amount },
            data: { playerId, amount: part.amount },
          });
        }
        continue;
      }
      if (part.class === "effect" && part.type === "tap-self") {
        if (sourceLive.markers.some((marker) => marker.kind === "tapped")) {
          return { supported: true, events: [] };
        }
        events.push({
          ...baseEvent(layer, processId),
          name: "set-tapped",
          affected: [sourceSnap],
          data: { object: sourceSnap, tapped: true },
        });
        continue;
      }
      if (part.class === "effect" && part.type === "tap-hero") {
        const heroId = state.players[playerId]?.heroCardId;
        if (!heroId) return { supported: true, events: [] };
        const heroLive = state.objects[heroId];
        if (!heroLive || heroLive.markers.some((marker) => marker.kind === "tapped")) {
          return { supported: true, events: [] };
        }
        const hero = snapshotObject(state, heroId, playerId, "heroZone");
        events.push({
          ...baseEvent(layer, processId),
          name: "set-tapped",
          affected: [hero],
          data: { object: hero, tapped: true },
        });
        continue;
      }
      if (part.class === "effect" && part.type === "destroy-self") {
        events.push({
          ...baseEvent(layer, processId),
          name: "destroy",
          affected: [sourceSnap],
          data: {
            object: sourceSnap,
            destinationRef: nextFabDestinationRef(state, sourceSnap, resetOffset++),
            from: sourceSnap.zone,
            to: "graveyard",
            reason: "destroy",
          },
        });
        continue;
      }
      return unsupported(
        effect,
        "pay mixed cost supports only constant resources, tap-self, tap-hero, and destroy-self",
      );
    }
    if (events.length === 0) {
      return unsupported(effect, "pay mixed cost is empty");
    }
    return { supported: true, events };
  }

  if (effect.cost.class !== "asset") {
    return unsupported(effect, "pay cost must be an asset amount");
  }
  const resolvedAmount =
    typeof effect.cost.amount === "number"
      ? effect.cost.amount
      : resolveLayerAmount(state, layer, effect.cost.amount);
  if (resolvedAmount === null) {
    return unsupported(effect, "pay cost amount could not be resolved");
  }
  const isUpToPayment =
    typeof effect.cost.amount !== "number" && effect.cost.amount.type === "up-to";
  const paymentKey = ctx.effectPath.join(".");
  const receipt = layer.effectPaymentReceipts?.[paymentKey];
  if (receipt) {
    const amountMatches = isUpToPayment
      ? receipt.amount >= 0 && receipt.amount <= resolvedAmount
      : receipt.amount === resolvedAmount;
    return receipt.status === "committed" &&
      receipt.playerId === playerId &&
      receipt.costType === effect.cost.type &&
      amountMatches
      ? { supported: true, events: [], outcome: "committed" }
      : { supported: true, events: [], outcome: "failed" };
  }
  const amount =
    effect.cost.type === "resources" && isUpToPayment
      ? Math.min(state.players[playerId]?.resourcePoints ?? 0, resolvedAmount)
      : resolvedAmount;

  const selectedPitchIds = ctx.effectPaymentPitches[ctx.effectPath.join(".")] ?? [];
  const paymentView = buildFabRulesView(state);
  const pitchEvents: ProposedEvent[] = [];
  let generatedResources = 0;
  for (const selectedRef of selectedPitchIds) {
    const instanceId = selectedRef.instanceId;
    const record = state.objects[instanceId];
    if (
      !record ||
      record.incarnation !== selectedRef.incarnation ||
      !state.containers.zonesByPlayerId[playerId]?.hand.includes(instanceId)
    ) {
      return { supported: true, events: [], outcome: "failed" };
    }
    const evaluated = paymentView.object({ instanceId, incarnation: record.incarnation });
    const generated = evaluated?.current.numeric.pitch ?? 0;
    if (generated <= 0 || evaluated?.current.typeBox.subtypes.includes("Chi")) {
      return { supported: true, events: [], outcome: "failed" };
    }
    const object = snapshotObject(state, instanceId, playerId, "hand");
    pitchEvents.push({
      ...baseEvent(layer, processId),
      name: "pitch",
      source: object,
      affected: [object],
      bindings: { ...layer.bindings, pitchedCard: object },
      data: {
        playerId,
        object,
        destinationRef: nextFabDestinationRef(
          withObjectIncarnationOffset(state, pitchEvents.length),
          object,
        ),
        resourcesGenerated: generated,
      },
    });
    generatedResources += generated;
  }

  // Life payment ("you may pay {h}") — Vynnset et al. Emits lose-life so
  // optional.then continuations can stage after a successful payment.
  if (effect.cost.type === "life") {
    const life = state.players[playerId]?.life ?? 0;
    // A life cost cannot be paid by reducing the payer to 0 (same legality
    // boundary as activated life costs).
    if (life <= amount) {
      return { supported: true, events: [], outcome: "failed" };
    }
    return {
      supported: true,
      outcome: "proposed",
      events: [
        {
          ...baseEvent(layer, processId),
          name: "lose-life",
          affected: [],
          data: {
            playerId,
            amount,
            source: layer.source.instanceId,
          },
        },
      ],
    };
  }

  if (effect.cost.type !== "resources") {
    return unsupported(effect, "pay cost must be a constant resource or life asset");
  }
  const resources = (state.players[playerId]?.resourcePoints ?? 0) + generatedResources;
  if (resources < amount) {
    return { supported: true, events: [], outcome: "failed" };
  }
  return {
    supported: true,
    outcome: "proposed",
    events: [
      ...pitchEvents,
      {
        ...baseEvent(layer, processId),
        name: "pay-resources",
        affected: [],
        bindings: { "resources-paid-this-way": amount },
        data: { playerId, amount },
      },
    ],
  };
}

export function proposeRoll(
  ctx: ProposalContext,
  effect: FabEffect & { type: "roll" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  if (!Number.isInteger(effect.sides) || effect.sides < 2)
    return unsupported(effect, "die must have at least 2 sides");
  // Peek the same faces the roll-request reducer will produce from this
  // rngState so sequence steps (die-result conditionals) can stage bindings.
  // Gambler's Gloves rerolls the complete pool after Ready to Roll and other
  // dice-count replacements have modified it.
  const rerollCount = staticOptionalDestroyRerollCount(state, effect.sides);
  const authoredExtraDice = effect.extraDice ?? 0;
  if (!Number.isInteger(authoredExtraDice) || authoredExtraDice < 0) {
    return unsupported(effect, "roll.extraDice must be a non-negative integer");
  }
  const extraDice =
    authoredExtraDice + staticRollPlusOneIgnoreLowestExtraDice(state, layer.controllerId);
  const discardFaces = rerollCount * (extraDice + 1);
  let peekState = state.rngState;
  for (let i = 0; i < discardFaces; i += 1) {
    peekState = nextRandom(peekState).state;
  }
  const faces: number[] = [];
  for (let remaining = extraDice + 1; remaining > 0; remaining -= 1) {
    const peek = nextRandom(peekState);
    peekState = peek.state;
    faces.push(Math.floor(peek.value * effect.sides) + 1);
  }
  const ignoreLowest = effect.ignore === "lowest" || extraDice > authoredExtraDice;
  const result = ignoreLowest && faces.length > 1 ? Math.max(...faces) : faces[faces.length - 1]!;
  const bindingKey = effect.outputBinding ?? "roll-result";
  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "roll-request",
        affected: [],
        // die-result is the canonical condition binding (evaluateDieResult);
        // roll-result + outputBinding cover amount/roll-result DSL shapes.
        bindings: {
          [bindingKey]: result,
          "roll-result": result,
          "die-result": result,
        },
        data: {
          playerId: layer.controllerId,
          sides: effect.sides,
          outputBinding: effect.outputBinding ?? "roll-result",
          ...(rerollCount > 0 ? { rerollCount } : {}),
          ...(authoredExtraDice > 0 ? { extraDice: authoredExtraDice } : {}),
          ...(effect.ignore ? { ignore: effect.ignore } : {}),
        },
      },
    ],
  };
}
