import type { FabEffect, FabNameCardSuggestionSource, FabTarget } from "@tcg/flesh-and-blood-types";
import type { FabMatchState, FabZoneKind } from "../../state.ts";
import type { FabTargetMap, MutableFabTargetMap, FabTargetRef } from "../../rules/targets.ts";
import { nextRandom } from "../../random.ts";
import { conditionHolds } from "../../rules/effect-event-proposals.ts";
import type { FabObjectSnapshot } from "../../rules/events.ts";
import { fabLayerTargets, type FabRulesStackLayer } from "../../rules/layers.ts";
import type {
  FabUnansweredLayerDecision,
  FabAtResolutionObjectTarget,
} from "../../rules/decision-dispatch/decision-types.ts";
import {
  availableChoiceOptionIndexes,
  heroTargets,
  lookCohortBindingRole,
  objectTargets,
  retrieveOptionalIsUnavailable,
  scanAtResolutionObjectPool,
  damageTargets,
  eventZoneForSnapshot,
  isUpToCountValue,
  playersForFabPlayer,
  resolveLayerAmount,
  resolveSearchCount,
  resolveAtResolutionSelectionCount,
  objectTargetPlayerBinding,
} from "../../rules/proposals/shared.ts";
import {
  chooseOptionBindingKey,
  orderChooseOptionChoosers,
} from "../../rules/proposals/effects/choose-option.ts";
import { chooseNewTargetsAlternatives } from "../../rules/proposals/effects/choose-new-targets.ts";
import {
  chooseNumberBindingKey,
  proposeChooseNumber,
} from "../../rules/proposals/effects/choose-number.ts";
import {
  staticOptionalDestroyRerollCount,
  staticRollPlusOneIgnoreLowestExtraDice,
} from "../../kernel/replacements/index.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { sharedConditionalBranchTarget } from "../../rules/conditional-targets.ts";
import { currentFabState, prepareFabStateWithResult } from "../../copy-on-write.ts";
import { catalogZoneToEngine } from "../../rules/zones.ts";
import { activationPaymentCandidates } from "../activate-ability/helpers.ts";
import { effectsForLayer } from "./meld.ts";
import { resolveRepeatTimes } from "../../rules/proposals/resolve-repeat-times.ts";
import { assertNever } from "../../rules/evaluation/assert-never.ts";

function heroTargetsForDecision(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  target: FabTarget,
  targetPath: string,
): readonly string[] {
  return heroTargets(state, layer, target, targetPath) ?? [];
}

function isFabTarget(value: unknown): value is FabTarget {
  return typeof value === "object" && value !== null && "selector" in value;
}

type PendingLayerDecision = {
  readonly decision: FabUnansweredLayerDecision;
  readonly layer: FabRulesStackLayer;
};

function isAtResolutionObjectTarget(target: FabTarget): target is FabAtResolutionObjectTarget {
  return target.selector === "object" && target.declared === "at-resolution";
}

/** Hidden-zone picks: the zone owner determines the card (CR 1.8.6). */
const PRIVATE_PICK_ZONES: ReadonlySet<string> = new Set(["hand", "deck", "arsenal"]);

/** Repeat-until-declined: a false optional under this iteration ends the loop. */
function iterationWasDeclined(
  choices: Readonly<Record<string, boolean>>,
  iterationPath: readonly number[],
): boolean {
  const prefix = iterationPath.join(".");
  return Object.entries(choices).some(
    ([key, value]) => value === false && (key === prefix || key.startsWith(`${prefix}.`)),
  );
}

/** Repeat-until-declined: do not scan iteration N+1 until N accepted its optional. */
function iterationWasAccepted(
  choices: Readonly<Record<string, boolean>>,
  iterationPath: readonly number[],
): boolean {
  const prefix = iterationPath.join(".");
  return Object.entries(choices).some(
    ([key, value]) => value === true && (key === prefix || key.startsWith(`${prefix}.`)),
  );
}

export function firstUnansweredDecision(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  choices: Readonly<Record<string, boolean>>,
  partitions: Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>,
  options: Readonly<Record<string, string>>,
  targets: FabTargetMap,
): PendingLayerDecision | null {
  for (const [index, effect] of effectsForLayer(layer).entries()) {
    const found = findDecision(
      state,
      layer,
      effect,
      [index],
      `effect-${index}`,
      choices,
      partitions,
      options,
      targets,
    );
    if (found) return found;
  }
  return null;
}

function pending(
  decision: FabUnansweredLayerDecision,
  layer: FabRulesStackLayer,
): PendingLayerDecision {
  return { decision, layer };
}

const NAME_CARD_SUGGESTION_LABELS: Readonly<Record<FabNameCardSuggestionSource, string>> = {
  "your-hand": "In your hand",
  "revealed-this-resolution": "Just revealed",
  "opponent-graveyard": "In their graveyard",
  "face-up-banished": "Face-up in banished zones",
  "combat-chain": "On the combat chain",
  "visible-cards": "Visible on the table",
};

const PUBLIC_NAME_SUGGESTION_ZONES = [
  "pitch",
  "graveyard",
  "banished",
  "soul",
  "under",
  "combatChain",
  "stack",
  "arena",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
  "heroZone",
] as const satisfies readonly FabZoneKind[];

function isObjectSnapshot(value: unknown): value is FabObjectSnapshot {
  return (
    typeof value === "object" &&
    value !== null &&
    "instanceId" in value &&
    "current" in value &&
    "ref" in value
  );
}

function boundObjectSnapshots(value: unknown): readonly FabObjectSnapshot[] {
  if (isObjectSnapshot(value)) return [value];
  return Array.isArray(value) ? value.filter(isObjectSnapshot) : [];
}

function snapshotsInZones(
  state: Readonly<FabMatchState>,
  playerIds: readonly string[],
  zones: readonly FabZoneKind[],
  include: (instanceId: string, zone: FabZoneKind) => boolean = () => true,
): readonly FabObjectSnapshot[] {
  return playerIds.flatMap((playerId) => {
    const playerZones = state.containers.zonesByPlayerId[playerId];
    if (!playerZones) return [];
    return zones.flatMap((zone) =>
      playerZones[zone]
        .filter((instanceId) => include(instanceId, zone))
        .map((instanceId) => snapshotObject(state, instanceId, playerId, zone)),
    );
  });
}

function nameCardSuggestionSnapshots(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  source: FabNameCardSuggestionSource,
): readonly FabObjectSnapshot[] {
  const opponents = state.playerIds.filter((playerId) => playerId !== layer.controllerId);
  switch (source) {
    case "your-hand":
      return snapshotsInZones(state, [layer.controllerId], ["hand"]);
    case "revealed-this-resolution":
      return boundObjectSnapshots(layer.bindings["revealed-this-way"]);
    case "opponent-graveyard":
      return snapshotsInZones(state, opponents, ["graveyard"]);
    case "face-up-banished":
      return snapshotsInZones(
        state,
        state.playerIds,
        ["banished"],
        (instanceId) =>
          !state.objects[instanceId]?.markers.some((marker) => marker.kind === "face-down"),
      );
    case "combat-chain":
      return snapshotsInZones(state, state.playerIds, ["combatChain", "stack"]);
    case "visible-cards":
      return snapshotsInZones(
        state,
        state.playerIds,
        PUBLIC_NAME_SUGGESTION_ZONES,
        (instanceId, zone) =>
          zone !== "banished" ||
          !state.objects[instanceId]?.markers.some((marker) => marker.kind === "face-down"),
      );
  }
}

function nameCardOptions(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effect: Extract<FabEffect, { type: "name-card" }>,
): readonly { readonly id: string; readonly name: string }[] {
  const sourceNames = new Set(layer.source.current.names);
  const byName = new Map<string, { readonly id: string; readonly name: string }>();
  for (const identity of state.publicCardIdentities) {
    if (
      effect.restriction === "living-legend-hero" &&
      (!identity.isHero || !identity.legalInLivingLegend)
    ) {
      continue;
    }
    for (const name of identity.names) {
      if (effect.restriction === "another-card" && sourceNames.has(name)) continue;
      if (!byName.has(name)) {
        byName.set(name, { id: `fab-card-name:${encodeURIComponent(name)}`, name });
      }
    }
  }
  return [...byName.values()].sort((left, right) => left.name.localeCompare(right.name));
}

function nameCardSuggestionGroups(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effect: Extract<FabEffect, { type: "name-card" }>,
  options: readonly { readonly id: string; readonly name: string }[],
): readonly {
  readonly id: string;
  readonly label: string;
  readonly optionIds: readonly string[];
}[] {
  const optionIdByName = new Map(options.map((option) => [option.name, option.id] as const));
  return (effect.suggestions ?? []).flatMap((source) => {
    const optionIds = [
      ...new Set(
        nameCardSuggestionSnapshots(state, layer, source).flatMap((snapshot) =>
          snapshot.current.names.flatMap((name) => {
            const optionId = optionIdByName.get(name);
            return optionId ? [optionId] : [];
          }),
        ),
      ),
    ];
    return optionIds.length > 0
      ? [{ id: source, label: NAME_CARD_SUGGESTION_LABELS[source], optionIds }]
      : [];
  });
}

/**
 * Whether a canonical `unless` escape can actually be performed now.
 *
 * Choosing an impossible escape must not suppress the principal effect. The
 * effect proposer emits no counter-removal event when the source lacks the
 * requested counter, but the decision walker runs first; without this guard a
 * player can answer "yes" and make both branches do nothing.
 */
function unlessEscapeIsAvailable(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  escape: FabEffect,
): boolean {
  if (
    escape.type === "pay" &&
    escape.cost.class === "asset" &&
    escape.cost.type === "resources" &&
    typeof escape.cost.amount === "number"
  ) {
    const payerIds = playersForFabPlayer(state, layer.controllerId, escape.payer, layer.bindings);
    const payerId = payerIds?.length === 1 ? payerIds[0]! : null;
    if (payerId === null) return false;
    const pitchable = activationPaymentCandidates(state, payerId, [], "resources").reduce(
      (total, candidate) => total + candidate.value,
      0,
    );
    const available = (state.players[payerId]?.resourcePoints ?? 0) + pitchable;
    return available >= escape.cost.amount;
  }

  if (
    escape.type === "remove-counters" &&
    escape.target.selector === "self" &&
    escape.counter.kind === "named" &&
    typeof escape.count === "number"
  ) {
    const source = state.objects[layer.source.ref.instanceId];
    if (!source || source.incarnation !== layer.source.ref.incarnation) return false;
    const counterName = escape.counter.name;
    const available =
      source.counters.find((counter) => counter.kind === "named" && counter.name === counterName)
        ?.count ?? 0;
    return available >= escape.count;
  }

  if (escape.type === "reveal" && escape.target.selector === "object") {
    const pool = scanAtResolutionObjectPool(state, layer, escape.target);
    return (pool?.length ?? 0) >= 1;
  }

  if (escape.type === "add-counter" && escape.target.selector === "object") {
    const pool = scanAtResolutionObjectPool(state, layer, escape.target);
    return (pool?.length ?? 0) >= 1;
  }

  if (escape.type === "discard" && escape.target.selector === "object") {
    const pool = scanAtResolutionObjectPool(state, layer, escape.target);
    const required = typeof escape.target.count === "number" ? escape.target.count : 1;
    return (pool?.length ?? 0) >= required;
  }

  // Other escape shapes can carry target declarations or nested effects;
  // their own decision and proposal paths remain authoritative.
  return true;
}

export function findDecision(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effect: FabEffect,
  path: readonly number[],
  targetPath: string,
  choices: Readonly<Record<string, boolean>>,
  partitions: Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>,
  options: Readonly<Record<string, string>>,
  targets: FabTargetMap,
): PendingLayerDecision | null {
  switch (effect.type) {
    case "sequence":
    case "if-you-do":
    case "self-replacement":
    case "choice":
    case "conditional":
    case "optional":
    case "for-each":
    case "remove-counters":
    case "repeat":
    case "delayed-trigger":
    case "inline-trigger":
    case "deal-damage":
    case "gain-life":
    case "lose-life":
    case "gain-action-points":
    case "gain-resources":
    case "gain-chi":
    case "draw":
    case "take-extra-turn":
    case "lose-game":
    case "discard":
    case "banish":
    case "destroy":
    case "negate":
    case "turn-face-down":
    case "turn-face-up":
    case "unless":
    case "move-card":
    case "bind-aura":
    case "reorder-deck":
    case "search":
    case "shuffle":
    case "reveal":
    case "look":
    case "choose-same-name-group":
    case "opt":
    case "amp":
    case "sharpen":
    case "crowd-boos":
    case "crowd-cheers":
    case "awaken":
    case "win-clash":
    case "guess":
    case "choose-color":
    case "choose-option":
    case "choose-and-create-token":
    case "choose-number":
    case "choose-card":
    case "choose-new-targets":
    case "contract-task":
    case "contract-watch":
    case "start-game":
    case "remove-all-counters":
    case "choose-opponent":
    case "create-token":
    case "create-card":
    case "cancel-event":
    case "ignore":
    case "create-extra":
    case "add-counter":
    case "move-counter":
    case "distribute-counters":
    case "roll":
    case "clash":
    case "reclash":
    case "swap-clash-reveals":
    case "name-card":
    case "intimidate":
    case "charge":
    case "pitch-card":
    case "equip":
    case "retrieve":
    case "transform":
    case "transcend":
    case "transform-into-resolving-card":
    case "copy":
    case "return-to-brood":
    case "exchange":
    case "gain-control":
    case "give":
    case "steal":
    case "mark":
    case "set-status":
    case "freeze":
    case "unfreeze":
    case "tap":
    case "untap":
    case "add-defending":
    case "attack-with":
    case "modify-activation-limit":
    case "play-card":
    case "pay":
    case "wager":
    case "win-wager":
    case "become":
    case "modify-numeric":
    case "modify-activation-cost":
    case "grant-property":
    case "remove-property":
    case "can-be-attacked":
    case "replacement":
    case "prevention":
    case "rule-modification":
      return findDecisionImpl(
        state,
        layer,
        effect,
        path,
        targetPath,
        choices,
        partitions,
        options,
        targets,
      );
    default:
      return assertNever(effect, "FabEffect.type");
  }
}

function findDecisionImpl(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effect: FabEffect,
  path: readonly number[],
  targetPath: string,
  choices: Readonly<Record<string, boolean>>,
  partitions: Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>,
  options: Readonly<Record<string, string>>,
  targets: FabTargetMap,
): PendingLayerDecision | null {
  if (
    effect.type === "pay" &&
    effect.cost.class === "asset" &&
    (effect.cost.type === "resources" || effect.cost.type === "life")
  ) {
    if (layer.effectPaymentReceipts?.[path.join(".")]) {
      return null;
    }
    const payerIds = playersForFabPlayer(state, layer.controllerId, effect.payer, layer.bindings);
    const resolvedAmount =
      typeof effect.cost.amount === "number"
        ? effect.cost.amount
        : resolveLayerAmount(state, layer, effect.cost.amount);
    if (payerIds?.length === 1 && resolvedAmount !== null) {
      const actorId = payerIds[0]!;
      const paymentKey = path.join(".");
      const isUpTo = typeof effect.cost.amount !== "number" && effect.cost.amount.type === "up-to";
      const declaredAmount = state.rulesProcess?.effectPaymentAmounts?.[paymentKey];
      if (isUpTo && declaredAmount === undefined) {
        const payable =
          effect.cost.type === "resources"
            ? (state.players[actorId]?.resourcePoints ?? 0) +
              activationPaymentCandidates(state, actorId, [], "resources").reduce(
                (total, candidate) => total + candidate.value,
                0,
              )
            : Math.max(0, (state.players[actorId]?.life ?? 0) - 1);
        return pending(
          {
            kind: "payment-amount",
            path,
            effect,
            actorId,
            max: Math.min(resolvedAmount, payable),
          },
          layer,
        );
      }
      const amount = declaredAmount ?? resolvedAmount;
      if (effect.cost.type === "life") {
        if ((state.players[actorId]?.life ?? 0) > amount) {
          return pending(
            {
              kind: "payment-commit",
              path,
              optionalPath: optionalPrincipalAncestor(effectsForLayer(layer), path),
              effect,
              actorId,
              amount,
            },
            layer,
          );
        }
        return null;
      }
      const selected = (state.rulesProcess?.effectPaymentPitches?.[path.join(".")] ?? []).filter(
        (ref) =>
          state.objects[ref.instanceId]?.incarnation === ref.incarnation &&
          state.containers.zonesByPlayerId[actorId]?.hand.includes(ref.instanceId),
      );
      const paymentCandidates = activationPaymentCandidates(state, actorId, [], "resources");
      const candidateValue = (instanceId: string): number =>
        paymentCandidates.find((candidate) => candidate.instanceId === instanceId)?.value ?? 0;
      const generated = selected.reduce((total, ref) => total + candidateValue(ref.instanceId), 0);
      const remaining = Math.max(
        0,
        amount - (state.players[actorId]?.resourcePoints ?? 0) - generated,
      );
      if (remaining > 0) {
        const candidates = paymentCandidates.filter(
          (candidate) => !selected.some((ref) => ref.instanceId === candidate.instanceId),
        );
        if (candidates.reduce((total, candidate) => total + candidate.value, 0) >= remaining) {
          return pending(
            { kind: "payment", path, effect, actorId, amount: remaining, candidates },
            layer,
          );
        }
      } else {
        return pending(
          {
            kind: "payment-commit",
            path,
            optionalPath: optionalPrincipalAncestor(effectsForLayer(layer), path),
            effect,
            actorId,
            amount,
          },
          layer,
        );
      }
    }
  }
  if (effect.type === "if-you-do") {
    const mainFound = findDecision(
      state,
      layer,
      effect.effect,
      [...path, 0],
      `${targetPath}:effect`,
      choices,
      partitions,
      options,
      targets,
    );
    if (mainFound) return mainFound;
    return findDecision(
      state,
      layer,
      effect.then,
      [...path, 1],
      `${targetPath}:then`,
      choices,
      partitions,
      options,
      targets,
    );
  }
  if (effect.type === "exchange") {
    for (const [index, side] of [effect.first, effect.second].entries()) {
      if (!isAtResolutionObjectTarget(side)) continue;
      const sidePath = [...path, index];
      if (targets[sidePath.join(".")]) continue;
      const pool = scanAtResolutionObjectPool(state, layer, side);
      if (pool?.length === 0) {
        (targets as MutableFabTargetMap)[sidePath.join(".")] = [];
        continue;
      }
      return pending(
        {
          kind: "target",
          path: sidePath,
          target: side,
          actorId: layer.controllerId,
        },
        layer,
      );
    }
  }
  if (effect.type === "optional") {
    // EVR170: optional + appliesTo.next is a delayed next-hit trigger, not a
    // resolution-time "you may". The delayed layer asks when it later fires.
    if (effect.appliesTo) return null;
    // CR 8.5.51a: a retrieve may is only offered when a legal pay exists —
    // an at-resolution object pool that provably admits no candidate
    // suppresses the "may retrieve?" entirely instead of letting an accept
    // reject the layer.
    if (retrieveOptionalIsUnavailable(state, layer, effect.effect)) return null;
    const choice = choices[path.join(".")];
    if (choice === undefined) return pending({ kind: "optional", path, targetPath, effect }, layer);
    if (!choice) return null;
    const mainPath = [...path, 0] as const;
    const mainFound = findDecision(
      state,
      layer,
      effect.effect,
      mainPath,
      `${targetPath}:effect`,
      choices,
      partitions,
      options,
      targets,
    );
    if (mainFound) return mainFound;
    if (!effect.then) return null;
    // CR 6.1.2: generate the dependent instruction only after the accepted
    // principal has committed. Its targets may depend on output bindings or
    // on a seat/zone vacated by that principal (Taylor).
    return pending({ kind: "optional-commit", path: [...path, 1] }, layer);
  }

  // "Do X unless they pay Y": interactive escape payment (Coronet Peak family).
  // Boolean choice at `path` means "pay escape?" (answered by the escape payer
  // via optional.chooser). True → walk escape; false / unaffordable → principal.
  if (effect.type === "unless") {
    const choice = choices[path.join(".")];
    if (choice === undefined) {
      // An unavailable escape is not a choice. Resolve the principal branch
      // directly instead of allowing a "yes" answer to suppress both effects.
      if (!unlessEscapeIsAvailable(state, layer, effect.escape)) {
        return findDecision(
          state,
          layer,
          effect.effect,
          [...path, 0],
          `${targetPath}:unless`,
          choices,
          partitions,
          options,
          targets,
        );
      }
      // Offer escape as an optional answered by the escape payer (not controller).
      // Reveal-from-hand escapes ("unless they reveal…") are answered by that seat.
      const chooser =
        effect.escape.type === "pay"
          ? effect.escape.payer
          : effect.escape.type === "reveal" &&
              effect.escape.target.selector === "object" &&
              typeof effect.escape.target.player === "string"
            ? effect.escape.target.player
            : effect.escape.type === "discard" &&
                effect.escape.target.selector === "object" &&
                typeof effect.escape.target.player === "string"
              ? effect.escape.target.player
              : effect.escape.type === "add-counter" &&
                  effect.escape.target.selector === "object" &&
                  typeof effect.escape.target.player === "string"
                ? effect.escape.target.player
                : ("controller" as const);
      return pending(
        {
          kind: "optional",
          path,
          targetPath,
          effect: {
            type: "optional",
            effect: effect.escape,
            chooser,
          },
        },
        layer,
      );
    }
    if (choice === true) {
      return findDecision(
        state,
        layer,
        effect.escape,
        [...path, 1],
        `${targetPath}:unless-escape`,
        choices,
        partitions,
        options,
        targets,
      );
    }
    return findDecision(
      state,
      layer,
      effect.effect,
      [...path, 0],
      `${targetPath}:unless`,
      choices,
      partitions,
      options,
      targets,
    );
  }
  if (effect.type === "opt" && !partitions[path.join(".")]) {
    return pending({ kind: "opt", path, effect }, layer);
  }
  if (effect.type === "reorder-deck" && !partitions[path.join(".")]) {
    const objects = objectTargets(state, layer, effect.target, targetPath, targets, path);
    if (objects && objects.length > 0) {
      return pending({ kind: "reorder-deck", path, effect }, layer);
    }
  }
  if (effect.type === "choose-same-name-group" && !partitions[path.join(".")]) {
    return pending({ kind: "group-choice", path, effect }, layer);
  }
  if (effect.type === "name-card" && !options[path.join(".")]) {
    const nameOptions = nameCardOptions(state, layer, effect);
    if (nameOptions.length > 0) {
      return pending(
        {
          kind: "name-card",
          path,
          effect,
          options: nameOptions,
          suggestionGroups: nameCardSuggestionGroups(state, layer, effect, nameOptions),
        },
        layer,
      );
    }
  }
  if (effect.type === "choose-color" && !options[path.join(".")]) {
    return pending({ kind: "choose-color", path, effect }, layer);
  }
  if (effect.type === "guess" && !options[path.join(".")]) {
    const guesserIds = playersForFabPlayer(
      state,
      layer.controllerId,
      effect.guesser,
      layer.bindings,
    );
    const guesserId = guesserIds?.[0];
    if (guesserId) return pending({ kind: "guess-match", path, effect, actorId: guesserId }, layer);
  }
  if (
    effect.type === "move-counter" &&
    typeof effect.count === "object" &&
    effect.count.type === "any-number" &&
    !partitions[path.join(".")]
  ) {
    const sources = objectTargets(state, layer, effect.from, `${targetPath}:from`, targets, path);
    if (sources && effect.counter.kind === "numeric" && typeof effect.counter.value === "number") {
      const selectedCounter = effect.counter;
      const entries = sources.flatMap((source) => {
        const live = state.objects[source.instanceId];
        const available =
          live?.counters.reduce((sum, counter) => {
            return counter.kind === "numeric" &&
              counter.property === selectedCounter.property &&
              counter.value === selectedCounter.value
              ? sum + counter.count
              : sum;
          }, 0) ?? 0;
        const name = source.current.names.join(" // ") || source.instanceId;
        return Array.from({ length: available }, (_, index) => ({
          id: JSON.stringify([source.instanceId, index]),
          label: `Counter ${index + 1} from ${name}`,
        }));
      });
      if (entries.length > 0) {
        return pending({ kind: "move-counter-selection", path, effect, entries }, layer);
      }
    }
  }
  if (effect.type === "choose-and-create-token" && !effect.random && !options[path.join(".")]) {
    const chooserIds = playersForFabPlayer(
      state,
      layer.controllerId,
      effect.chooser ?? "controller",
      layer.bindings,
    );
    const chooserId = chooserIds?.[0];
    if (chooserId)
      return pending({ kind: "choose-and-create-token", path, effect, actorId: chooserId }, layer);
  }
  if (effect.type === "choose-option") {
    const chooserIds = playersForFabPlayer(
      state,
      layer.controllerId,
      effect.chooser ?? "controller",
      layer.bindings,
    );
    if (chooserIds && chooserIds.length > 0) {
      const ordered =
        chooserIds.length > 1
          ? orderChooseOptionChoosers(layer.controllerId, chooserIds)
          : chooserIds;
      for (const chooserId of ordered) {
        if (!options[chooseOptionBindingKey(path, chooserId)]) {
          return pending({ kind: "choose-option", path, effect, actorId: chooserId }, layer);
        }
      }
    }
  }
  if (
    effect.type === "choose-number" &&
    (effect.min !== undefined || effect.max !== undefined || effect.chooser !== undefined)
  ) {
    const chooserIds = playersForFabPlayer(
      state,
      layer.controllerId,
      effect.chooser ?? "controller",
      layer.bindings,
    );
    if (chooserIds && chooserIds.length > 0) {
      const ordered =
        chooserIds.length > 1
          ? orderChooseOptionChoosers(layer.controllerId, chooserIds)
          : chooserIds;
      for (const chooserId of ordered) {
        if (!options[chooseNumberBindingKey(path, chooserId)]) {
          return pending({ kind: "choose-number", path, effect, actorId: chooserId }, layer);
        }
      }
    }
  }
  // "Put on the top or bottom of your deck" — player chooses destination position.
  // Store the answer in effectOptions[path] as option-0 (top) / option-1 (bottom);
  // card-movement proposal rewrites top-or-bottom using that answer.
  if (
    effect.type === "move-card" &&
    effect.to.position === "top-or-bottom" &&
    !options[path.join(".")]
  ) {
    return pending(
      {
        kind: "choice",
        path,
        effect: {
          type: "choice",
          options: [
            {
              type: "move-card",
              target: effect.target,
              to: { zone: effect.to.zone, position: "top" },
            },
            {
              type: "move-card",
              target: effect.target,
              to: { zone: effect.to.zone, position: "bottom" },
            },
          ],
        },
      },
      layer,
    );
  }
  if (effect.type === "choice") {
    // A choice arm whose at-resolution pool is provably empty can never be
    // paid; with every arm empty the choice is suppressed outright.
    if (availableChoiceOptionIndexes(state, layer, effect).length === 0) return null;
    const selected = options[path.join(".")];
    if (!selected) return pending({ kind: "choice", path, effect }, layer);
    const match = selected.match(/^option-(\d+)$/);
    const index = match ? Number(match[1]) : -1;
    const option = effect.options[index];
    return option
      ? findDecision(
          state,
          layer,
          option,
          [...path, index],
          `${targetPath}:option-${index}`,
          choices,
          partitions,
          options,
          targets,
        )
      : pending({ kind: "choice", path, effect }, layer);
  }
  if (effect.type === "conditional") {
    const matches = conditionHolds(state, layer, effect.condition);
    const branch = matches ? effect.then : effect.else;
    return branch
      ? findDecision(
          state,
          layer,
          branch,
          [...path, matches ? 0 : 1],
          sharedConditionalBranchTarget(effect)
            ? `${targetPath}:then`
            : `${targetPath}:${matches ? "then" : "else"}`,
          choices,
          partitions,
          options,
          targets,
        )
      : null;
  }
  if (effect.type === "search" && !targets[path.join(".")]) {
    // CR: search selects filter-matching cards from the printed zone. Never
    // auto-take the top N of the deck without the filter — that made every
    // named/typed tutor (EVR037 pouncing lynx, Inner Chi, Sun Kiss, …)
    // fail-closed whenever the top card was not a match. Open the search
    // decision so legalTargets applies the filter; mayFail allows empty picks.
    if (resolveSearchCount(state, layer, effect) === null) return null;
    return pending({ kind: "search", path, effect }, layer);
  }
  if (effect.type === "choose-new-targets" && !targets[path.join(".")]) {
    const alternatives = chooseNewTargetsAlternatives({ state, layer });
    if (alternatives.length > 1) {
      return pending(
        {
          kind: "target",
          path,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "any",
            zones: ["hero", "permanent"],
            count: 1,
          },
          actorId: layer.controllerId,
          candidates: alternatives.map((candidate) => ({
            instanceId: candidate.targetId,
            label: candidate.label,
            target:
              candidate.target.kind === "hero"
                ? { kind: "player", playerId: candidate.target.playerId }
                : { kind: "object", ref: candidate.target.ref },
          })),
        },
        layer,
      );
    }
    return null;
  }
  if (effect.type === "choose-card" && !effect.random && !targets[path.join(".")]) {
    // Pick-1 from a looked/revealed binding is a player parameter when the
    // cohort is larger than 1. Count-N zone scans use the generic
    // at-resolution path (CR 1.8.6c) instead of always opening pick-1.
    const chooseCount =
      "count" in effect.target && typeof effect.target.count === "number" ? effect.target.count : 1;
    if (effect.target.selector === "binding" && chooseCount === 1) {
      const cohort = objectTargets(state, layer, effect.target, targetPath, targets, path);
      if (cohort && cohort.length > 1) {
        const zones = [
          ...new Set(
            cohort.flatMap((object) => {
              const zone = eventZoneForSnapshot(object.zone);
              return zone ? [zone] : [];
            }),
          ),
        ];
        const actorId = effect.chooser
          ? resolveChooserSeat(state, layer, effect.chooser)
          : layer.controllerId;
        const bindingFilter = { inObjectBinding: effect.target.binding };
        const extraFilter = effect.target.filter;
        return pending(
          {
            kind: "target",
            path,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: zones.length > 0 ? zones : ["deck"],
              count: 1,
              filter: extraFilter ? { and: [bindingFilter, extraFilter] } : bindingFilter,
            },
            actorId,
          },
          layer,
        );
      }
    }
  }
  if (
    effect.type === "move-card" &&
    !targets[path.join(".")] &&
    lookCohortBindingRole(layer, path, effect) === "top-pick" &&
    effect.target.selector === "binding"
  ) {
    const cohort = objectTargets(state, layer, effect.target, targetPath, targets, path);
    if (cohort && cohort.length > 1) {
      return pending(
        {
          kind: "target",
          path,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["deck"],
            count: 1,
            filter: { inObjectBinding: effect.target.binding },
          },
          actorId: layer.controllerId,
        },
        layer,
      );
    }
  }
  if (
    "target" in effect &&
    effect.target &&
    typeof effect.target === "object" &&
    "selector" in effect.target &&
    effect.target.selector === "any-hero" &&
    (fabLayerTargets(layer)[`${targetPath}:target`]?.length ?? 0) === 0 &&
    !targets[path.join(".")]
  ) {
    // CR 1.8.5: any-hero is a player-chosen parameter of the effect that
    // generated it. Resolution abilities declare this on the stack; optional
    // "If you do" packets and later triggered layers declare it here.
    return pending(
      { kind: "target", path, target: { selector: "any-hero" }, actorId: layer.controllerId },
      layer,
    );
  }
  const target = atResolutionDecisionTarget(effect);
  const randomTarget =
    (effect.type === "discard" && effect.random === true) ||
    Boolean(target && "random" in target && target.random === true);
  if (target && !targets[path.join(".")] && !target.random && !randomTarget) {
    // A required at-resolution target can cease to exist before the effect
    // resolves. It is not an impossible player decision: the effect simply
    // has no objects to perform on (Gang Robbery with no opposing aura token,
    // a destroyed permanent, an empty hand, …). Persist an explicit empty
    // selection so proposal code resolves it as a no-op instead of presenting
    // an entity-target prompt with zero legal candidates.
    // Authored targets without a printed count mean every matching object;
    // `all` also keeps the isAutoAll fall-through to the live pool.
    const countValue =
      resolveAtResolutionSelectionCount(state, layer, target.count) ?? ({ type: "all" } as const);
    const boundPlayer = objectTargetPlayerBinding(state, layer, target, targetPath);
    if (boundPlayer.kind === "unbound") {
      return pending(
        {
          kind: "target",
          path,
          target: { selector: "any-hero" },
          actorId: layer.controllerId,
          playerTargetPath: targetPath,
          playerTargetBinding: target.playerTargetBinding,
        },
        layer,
      );
    }
    const scanLayer =
      boundPlayer.kind === "bound"
        ? {
            ...layer,
            bindings: { ...layer.bindings, "declared-zone-player": boundPlayer.playerId },
          }
        : layer;
    const resolvedTarget =
      boundPlayer.kind === "bound"
        ? {
            ...target,
            count: countValue,
            player: { binding: "declared-zone-player" } as const,
          }
        : { ...target, count: countValue };
    const pool = scanAtResolutionObjectPool(state, scanLayer, resolvedTarget);
    if (pool?.length === 0) {
      (targets as MutableFabTargetMap)[path.join(".")] = [];
      return null;
    }
    const isAutoAll =
      typeof countValue === "object" &&
      countValue !== null &&
      "type" in countValue &&
      countValue.type === "all";
    // `{ type: "all" }` is every matching object — no player choice.
    // `{ type: "any-number" }` is printed "any number" and still opens 0..N.
    if (isAutoAll) {
      // Fall through so the leaf proposes against the live pool.
    } else if (
      resolvedTarget.position &&
      typeof countValue === "number" &&
      resolvedTarget.player !== "each"
    ) {
      if (pool && pool.length > countValue) {
        const actorId = resolutionTargetActorId(state, scanLayer, effect, resolvedTarget);
        return pending({ kind: "target", path, target: resolvedTarget, actorId }, layer);
      }
    } else if (!resolvedTarget.position) {
      const exactCount = typeof countValue === "number" ? countValue : null;
      const isUpTo = Boolean(resolvedTarget.upTo) || isUpToCountValue(countValue);
      // CR 1.8.6c: exact N with pool.length === N is determined. Fewer than N
      // cannot be chosen — persist empty so later steps no-op. "up to" still
      // opens a 0..N chooser. Exact 0 is determined empty even when the pool
      // is non-empty (Equip X=0 / Destroy X=0).
      if (exactCount === 0 && !isUpTo) {
        (targets as MutableFabTargetMap)[path.join(".")] = [];
        return null;
      }
      if (exactCount !== null && !isUpTo && pool && pool.length < exactCount) {
        (targets as MutableFabTargetMap)[path.join(".")] = [];
        return null;
      }
      if (exactCount !== null && !isUpTo && pool && pool.length === exactCount) {
        // Fall through so the leaf proposes against the live pool.
      } else {
        // CR 1.8.6a: "each hero …" has every instructed hero determine their
        // own private-zone pick in turn order. A single decision carries one
        // actorId, so a bare `each` over a private zone cannot be represented —
        // author the per-hero loop (for-each + iteration-subject, Codex of
        // Frailty) or an explicit chooser instead of silently asking one seat.
        if (
          resolvedTarget.player === "each" &&
          (resolvedTarget.zones ?? []).some((zone) => PRIVATE_PICK_ZONES.has(zone))
        ) {
          throw new Error(
            `at-resolution target ${JSON.stringify(targetPath)}: player "each" over a private zone (${(resolvedTarget.zones ?? []).join(", ")}) needs one chooser per hero — author for-each + iteration-subject (Codex of Frailty pattern) or an explicit chooser`,
          );
        }
        const actorId = resolutionTargetActorId(state, scanLayer, effect, resolvedTarget);
        return pending({ kind: "target", path, target: resolvedTarget, actorId }, layer);
      }
    }
  }
  if (effect.type === "sequence") {
    // Prior look/reveal steps bind LKI for later conditionals/optionals. Stage those
    // deterministic observation bindings while walking the sequence for decisions —
    // otherwise binding-matches conditionals never see the looked-at card.
    //
    // Also simulate decisionless prefix steps (draw/gain-life/…) on a state clone
    // so later hand/deck choices see post-prefix zone contents. Without this,
    // "draw, then look at their hand and choose" (PEN299 Two-Faced) only offered
    // pre-draw cards because findDecision never applies intermediate events.
    let stagedLayer = layer;
    let simState: Readonly<FabMatchState> = state;
    for (const [index, step] of effect.steps.entries()) {
      const found = findDecision(
        simState,
        stagedLayer,
        step,
        [...path, index],
        `${targetPath}:step-${index}`,
        choices,
        partitions,
        options,
        targets,
      );
      if (found) return found;
      // A declaration-time choose-card is already an authoritative player
      // choice. Publish its output binding before inspecting a following
      // conditional/optional step (Take Up the Mantle's selected stealth
      // attacker is the canonical example).
      stagedLayer = stageBindingsFromAnsweredTarget(
        simState,
        stagedLayer,
        step,
        [...path, index],
        targets,
        `${targetPath}:step-${index}`,
      );
      stagedLayer = stageBindingsFromDeterministicObservation(
        simState,
        stagedLayer,
        step,
        `${targetPath}:step-${index}`,
        [...path, index],
        targets,
      );
      if (step.type === "choose-number") {
        const processId = simState.rulesProcess?.processId;
        if (!processId) continue;
        const staged = proposeChooseNumber(
          {
            state: simState,
            layer: stagedLayer,
            processId,
            effectPath: [...path, index],
            targetPath: `${targetPath}:step-${index}`,
            effectChoices: choices,
            effectPartitions: partitions,
            effectOptions: options,
            effectTargets: targets,
            effectPaymentPitches: {},
          },
          step,
        );
        if (staged.supported) {
          const last = staged.events.at(-1);
          if (last) {
            stagedLayer = {
              ...stagedLayer,
              bindings: { ...stagedLayer.bindings, ...last.bindings },
            };
          }
        }
      }
      simState = applyDeterminedPrefixStepToClone(simState, stagedLayer, step) ?? simState;
    }
  }
  if (effect.type === "for-each") {
    // Walk each hero subject with iteration-subject bound so optionals/targets
    // under the loop resolve for the correct seat (Genis cycle, etc.). The
    // subject layer is returned with the decision so legal-target scans see
    // the binding without rebinding controllerId to the chooser.
    const subjects = heroTargetsForDecision(state, layer, effect.target, targetPath);
    for (const [index, playerId] of subjects.entries()) {
      const subjectLayer = {
        ...layer,
        bindings: { ...layer.bindings, "iteration-subject": playerId },
      };
      const found = findDecision(
        state,
        subjectLayer,
        effect.effect,
        [...path, index],
        `${targetPath}:for-each-${index}`,
        choices,
        partitions,
        options,
        targets,
      );
      if (found) return found;
    }
  }
  if (effect.type === "repeat") {
    const frame = layer.repeatFrames?.[path.join(".")];
    const limit = frame?.limit ?? resolveRepeatTimes(state, layer, effect.times, effect.until);
    if (limit === null || limit === 0) return null;
    if (!frame)
      return pending(
        { kind: "repeat-start", path, repeatPath: path, targetPath, effect, limit, index: 0 },
        layer,
      );
    const iterationPath = [...path, frame.index];
    const found = findDecision(
      state,
      layer,
      effect.effect,
      iterationPath,
      `${targetPath}:repeat-${frame.index}`,
      choices,
      partitions,
      options,
      targets,
    );
    if (found) return found;
    return pending(
      {
        kind: "repeat-commit",
        path: iterationPath,
        repeatPath: path,
        targetPath,
        effect,
        limit,
        index: frame.index,
      },
      layer,
    );
  }
  // "Do X. If you do, Y" continuation on leaves that carry FabEffectBase.then
  // (conditional/unless already walked their branches above — TS has narrowed
  // those variants away by this point).
  if ("then" in effect && effect.then && typeof effect.then === "object") {
    const found = findDecision(
      state,
      layer,
      effect.then as FabEffect,
      [...path, 1],
      `${targetPath}:then`,
      choices,
      partitions,
      options,
      targets,
    );
    if (found) return found;
  }
  return null;
}

function optionalPrincipalAncestor(
  effects: readonly FabEffect[],
  path: readonly number[],
): readonly number[] | null {
  const [rootIndex, ...rest] = path;
  const root = rootIndex === undefined ? undefined : effects[rootIndex];
  if (!root) return null;
  const walk = (
    effect: FabEffect,
    remaining: readonly number[],
    base: readonly number[],
    ancestor: readonly number[] | null,
  ): readonly number[] | null => {
    if (remaining.length === 0) return ancestor;
    const [index, ...tail] = remaining;
    if (index === undefined) return ancestor;
    switch (effect.type) {
      case "optional":
        return index === 0
          ? walk(effect.effect, tail, [...base, 0], base)
          : effect.then && index === 1
            ? walk(effect.then, tail, [...base, 1], ancestor)
            : ancestor;
      case "sequence": {
        const child = effect.steps[index];
        return child ? walk(child, tail, [...base, index], ancestor) : ancestor;
      }
      case "conditional": {
        const child = index === 0 ? effect.then : index === 1 ? effect.else : undefined;
        return child ? walk(child, tail, [...base, index], ancestor) : ancestor;
      }
      case "choice": {
        const child = effect.options[index];
        return child ? walk(child, tail, [...base, index], ancestor) : ancestor;
      }
      case "for-each":
      case "repeat":
        return walk(effect.effect, tail, [...base, index], ancestor);
      case "unless": {
        const child = index === 0 ? effect.effect : index === 1 ? effect.escape : undefined;
        return child
          ? walk(child, tail, [...base, index], index === 1 ? base : ancestor)
          : ancestor;
      }
      default:
        return ancestor;
    }
  };
  return walk(root, rest, [rootIndex], null);
}

/**
 * Stage an answered at-resolution object target into layer bindings when the
 * leaf effect declares `outputBinding` (banish/equip/move…). Used so optional
 * then-branches can filter candidates against the chosen principal target
 * before the principal events are committed.
 */
function stageBindingsFromAnsweredTarget(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effect: FabEffect,
  path: readonly number[],
  targets: FabTargetMap,
  targetPath?: string,
): FabRulesStackLayer {
  const outputBinding =
    "outputBinding" in effect && typeof effect.outputBinding === "string"
      ? effect.outputBinding
      : null;
  if (!outputBinding) return layer;
  const selected = targets[path.join(".")];
  // Explicit empty persist (exact-N with pool < N) must bind [] so later
  // opponent-pick / banish / move steps no-op instead of re-scanning the zone.
  if (selected && selected.length === 0) {
    return {
      ...layer,
      bindings: { ...layer.bindings, [outputBinding]: [] },
    };
  }
  const fromResolutionTarget = selected?.length
    ? findLiveObjectSnapshot(state, selected[0]!)
    : null;
  // On-stack targets are declared in the card layer's resolution plan rather
  // than process.effectTargets. Resolve them through the canonical target
  // resolver so a following conditional sees the same LKI as proposals do.
  const declaredTarget = "target" in effect ? effect.target : null;
  const fromDeclaredTarget =
    !fromResolutionTarget && isFabTarget(declaredTarget) && targetPath
      ? (objectTargets(state, layer, declaredTarget, targetPath, targets, path)?.[0] ?? null)
      : null;
  const found = fromResolutionTarget ?? fromDeclaredTarget;
  if (!found) return layer;
  return {
    ...layer,
    bindings: { ...layer.bindings, [outputBinding]: found },
  };
}

/**
 * Walk the layer effect tree and stage every answered at-resolution target that
 * carries an `outputBinding`, respecting optional accept/decline.
 */
export function stageAnsweredOutputBindings(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effects: readonly FabEffect[],
  basePath: readonly number[],
  choices: Readonly<Record<string, boolean>>,
  targets: FabTargetMap,
): FabRulesStackLayer {
  let current = layer;
  for (const [index, effect] of effects.entries()) {
    current = stageAnsweredOutputBindingsForEffect(
      state,
      current,
      effect,
      [...basePath, index],
      choices,
      targets,
    );
  }
  return current;
}

function stageAnsweredOutputBindingsForEffect(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effect: FabEffect,
  path: readonly number[],
  choices: Readonly<Record<string, boolean>>,
  targets: FabTargetMap,
): FabRulesStackLayer {
  let current = stageBindingsFromAnsweredTarget(state, layer, effect, path, targets);
  if (effect.type === "optional") {
    const accepted = choices[path.join(".")];
    if (accepted === true) {
      current = stageAnsweredOutputBindingsForEffect(
        state,
        current,
        effect.effect,
        [...path, 0],
        choices,
        targets,
      );
      if (effect.then) {
        current = stageAnsweredOutputBindingsForEffect(
          state,
          current,
          effect.then,
          [...path, 1],
          choices,
          targets,
        );
      }
    }
    return current;
  }
  if (effect.type === "if-you-do") {
    current = stageAnsweredOutputBindingsForEffect(
      state,
      current,
      effect.effect,
      [...path, 0],
      choices,
      targets,
    );
    return stageAnsweredOutputBindingsForEffect(
      state,
      current,
      effect.then,
      [...path, 1],
      choices,
      targets,
    );
  }
  if (effect.type === "sequence") {
    return stageAnsweredOutputBindings(state, current, effect.steps, path, choices, targets);
  }
  if (effect.type === "conditional") {
    // Stage both branches' answered targets conservatively — only answered
    // paths have entries in `targets`.
    current = stageAnsweredOutputBindingsForEffect(
      state,
      current,
      effect.then,
      [...path, 0],
      choices,
      targets,
    );
    if (effect.else) {
      current = stageAnsweredOutputBindingsForEffect(
        state,
        current,
        effect.else,
        [...path, 1],
        choices,
        targets,
      );
    }
    return current;
  }
  if ("then" in effect && effect.then && typeof effect.then === "object") {
    current = stageAnsweredOutputBindingsForEffect(
      state,
      current,
      effect.then as FabEffect,
      [...path, 1],
      choices,
      targets,
    );
  }
  return current;
}

/**
 * Pre-compute deterministic output bindings from sequence prefix steps so
 * that later conditional effects (e.g. binding-matches "yellow") can evaluate
 * during the decision scan.
 */
export function stageDeterministicOutputBindings(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effects: readonly FabEffect[],
  basePath: readonly number[],
  choices: Readonly<Record<string, boolean>>,
  targets: FabTargetMap,
): FabRulesStackLayer {
  let current = layer;
  for (const [index, effect] of effects.entries()) {
    current = stageDeterministicOutputForEffect(
      state,
      current,
      effect,
      [...basePath, index],
      choices,
      targets,
    );
  }
  return current;
}

function stageDeterministicOutputForEffect(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effect: FabEffect,
  path: readonly number[],
  choices: Readonly<Record<string, boolean>>,
  targets: FabTargetMap,
): FabRulesStackLayer {
  if (effect.type === "optional") {
    const accepted = choices[path.join(".")];
    if (accepted === true) {
      const staged = stageDeterministicOutputForEffect(
        state,
        layer,
        effect.effect,
        [...path, 0],
        choices,
        targets,
      );
      if (effect.then) {
        return stageDeterministicOutputForEffect(
          state,
          staged,
          effect.then,
          [...path, 1],
          choices,
          targets,
        );
      }
      return staged;
    }
    return layer;
  }
  if (effect.type === "if-you-do") {
    const staged = stageDeterministicOutputForEffect(
      state,
      layer,
      effect.effect,
      [...path, 0],
      choices,
      targets,
    );
    return stageDeterministicOutputForEffect(
      state,
      staged,
      effect.then,
      [...path, 1],
      choices,
      targets,
    );
  }
  if (effect.type === "sequence") {
    return stageDeterministicOutputBindings(state, layer, effect.steps, path, choices, targets);
  }
  if (effect.type === "conditional") {
    const thenLayer = stageDeterministicOutputForEffect(
      state,
      layer,
      effect.then,
      [...path, 0],
      choices,
      targets,
    );
    if (effect.else) {
      return stageDeterministicOutputForEffect(
        state,
        thenLayer,
        effect.else,
        [...path, 1],
        choices,
        targets,
      );
    }
    return thenLayer;
  }
  const outputBinding =
    "outputBinding" in effect ? (effect as { outputBinding?: string }).outputBinding : undefined;
  if (!outputBinding) return layer;
  if (effect.type === "reveal") {
    return stageRevealBinding(state, layer, effect, path, outputBinding, targets);
  }
  return layer;
}

function stageRevealBinding(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effect: FabEffect & { outputBinding?: string; target: FabTarget },
  path: readonly number[],
  outputBinding: string,
  targets: FabTargetMap,
): FabRulesStackLayer {
  const objects = objectTargets(state, layer, effect.target, "reveal", targets, path);
  if (!objects || objects.length === 0) return layer;
  return {
    ...layer,
    bindings: {
      ...layer.bindings,
      [outputBinding]: objects.length === 1 ? objects[0]! : objects,
    } as typeof layer.bindings,
  };
}

function findLiveObjectSnapshot(
  state: Readonly<FabMatchState>,
  target: FabTargetRef,
): FabObjectSnapshot | null {
  if (target.kind !== "object") return null;
  const instanceId = target.ref.instanceId;
  if (state.objects[instanceId]?.incarnation !== target.ref.incarnation) return null;
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    for (const zone of Object.keys(state.containers.zonesByPlayerId[playerId]!) as FabZoneKind[]) {
      if (!state.containers.zonesByPlayerId[playerId]![zone].includes(instanceId)) continue;
      return snapshotObject(state, instanceId, playerId, zone);
    }
  }
  return null;
}

/**
 * When a sequence step is a deterministic look/reveal (positioned deck/hand pick
 * with outputBinding), stage the same binding the event proposal would emit so
 * later conditional/optional decision walks see the observed card.
 *
 * Also stage die rolls: the first roll from `state.rngState` matches the
 * roll-request reducer so die-result conditionals on later steps see the value
 * during the decision walk (proposal path stages via layerWithEventBindings).
 */
function stageBindingsFromDeterministicObservation(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  step: FabEffect,
  targetPath: string,
  effectPath: readonly number[],
  targets: FabTargetMap,
): FabRulesStackLayer {
  if (step.type === "sharpen") {
    const outputBinding =
      "outputBinding" in step && typeof step.outputBinding === "string" ? step.outputBinding : null;
    if (outputBinding) {
      const objects = objectTargets(state, layer, step.target, targetPath, targets, effectPath);
      if (objects && objects.length > 0) {
        return {
          ...layer,
          bindings: {
            ...layer.bindings,
            [outputBinding]: objects.length === 1 ? objects[0]! : objects,
          },
        };
      }
    }
  }
  if (step.type === "roll" && Number.isInteger(step.sides) && step.sides >= 2) {
    // Align with proposeRoll / roll-request after a reroll choice is accepted.
    let peekState = state.rngState;
    const authoredExtraDice = step.extraDice ?? 0;
    const extraDice =
      authoredExtraDice + staticRollPlusOneIgnoreLowestExtraDice(state, layer.controllerId);
    const discard = staticOptionalDestroyRerollCount(state, step.sides) * (extraDice + 1);
    for (let i = 0; i < discard; i += 1) {
      peekState = nextRandom(peekState).state;
    }
    const faces: number[] = [];
    for (let remaining = extraDice + 1; remaining > 0; remaining -= 1) {
      const peek = nextRandom(peekState);
      peekState = peek.state;
      faces.push(Math.floor(peek.value * step.sides) + 1);
    }
    const ignoreLowest = step.ignore === "lowest" || extraDice > authoredExtraDice;
    const result = ignoreLowest && faces.length > 1 ? Math.max(...faces) : faces[faces.length - 1]!;
    const bindingKey = step.outputBinding ?? "roll-result";
    return {
      ...layer,
      bindings: {
        ...layer.bindings,
        [bindingKey]: result,
        "roll-result": result,
        "die-result": result,
      },
    };
  }
  if (step.type === "deal-damage") {
    const resolved = damageTargets(state, layer, step.target, targetPath, targets, effectPath);
    const target = resolved?.length === 1 ? resolved[0] : null;
    if (!target) return layer;
    if (!("instanceId" in target)) {
      return {
        ...layer,
        bindings: { ...layer.bindings, "target-controller": target.playerId },
      };
    }
    const targetController = target.controllerId ?? target.ownerId;
    return {
      ...layer,
      bindings: {
        ...layer.bindings,
        "damage-target": target,
        ...(targetController ? { "target-controller": targetController } : {}),
      },
    };
  }
  if (step.type === "choose-card" && step.outputBinding) {
    const selected = targets[effectPath.join(".")];
    // An answered (including empty) choose-card is authoritative. Do not
    // fall through to the live zone pool — that re-bound a 1-card GY as
    // "them" after exact-2 failed.
    if (selected) {
      const fromSelection = selected.flatMap((entry) => {
        if (entry.kind !== "object") return [];
        const live = findLiveObjectSnapshot(state, entry);
        return live ? [live] : [];
      });
      return {
        ...layer,
        bindings: {
          ...layer.bindings,
          [step.outputBinding]:
            fromSelection.length === 0
              ? []
              : fromSelection.length === 1
                ? fromSelection[0]!
                : fromSelection,
        },
      };
    }
    const objects = objectTargets(state, layer, step.target, targetPath, targets, effectPath) ?? [];
    const count =
      "count" in step.target && typeof step.target.count === "number" ? step.target.count : 1;
    if (objects.length > count) return layer;
    return {
      ...layer,
      bindings: {
        ...layer.bindings,
        [step.outputBinding]:
          objects.length === 0 ? [] : objects.length === 1 ? objects[0]! : objects,
      },
    };
  }
  if (step.type !== "look" && step.type !== "reveal") return layer;
  const objects = objectTargets(state, layer, step.target, targetPath, targets, effectPath);
  if (!objects || objects.length === 0) return layer;
  const outputBinding = "outputBinding" in step ? step.outputBinding : undefined;
  return {
    ...layer,
    bindings: {
      ...layer.bindings,
      ...(outputBinding ? { [outputBinding]: objects.length === 1 ? objects[0]! : objects } : {}),
      // UPR168 look-then-banish reads this cohort via inObjectBinding before
      // the look event commits. Stamp even when the look has no outputBinding.
      "revealed-this-way": objects,
    },
  };
}

export function firstRequiredAtResolutionTarget(
  effect: FabEffect,
): FabAtResolutionObjectTarget | null {
  if (effect.type === "discard" && effect.random === true) return null;
  const direct = atResolutionDecisionTarget(effect);
  if (direct && !direct.upTo && !direct.random && !direct.position) return direct;
  switch (effect.type) {
    case "sequence":
      for (const step of effect.steps) {
        const found = firstRequiredAtResolutionTarget(step);
        if (found) return found;
      }
      return null;
    case "if-you-do":
      return (
        firstRequiredAtResolutionTarget(effect.effect) ??
        firstRequiredAtResolutionTarget(effect.then)
      );
    case "conditional":
      return (
        firstRequiredAtResolutionTarget(effect.then) ??
        (effect.else ? firstRequiredAtResolutionTarget(effect.else) : null)
      );
    case "optional":
      return (
        firstRequiredAtResolutionTarget(effect.effect) ??
        (effect.then ? firstRequiredAtResolutionTarget(effect.then) : null)
      );
    case "choice":
      // Do not treat a multi-arm choice as a single required target. One
      // unavailable arm (empty hand) must not suppress the other (deck top).
      return null;
    case "for-each":
      return firstRequiredAtResolutionTarget(effect.effect);
    case "repeat":
      return firstRequiredAtResolutionTarget(effect.effect);
    default:
      return null;
  }
}

function atResolutionDecisionTarget(effect: FabEffect): FabAtResolutionObjectTarget | null {
  let target: FabTarget | null = null;
  switch (effect.type) {
    case "add-counter":
    case "remove-counters":
    case "discard":
    case "banish":
    case "destroy":
    case "turn-face-down":
    case "turn-face-up":
    case "move-card":
    case "reveal":
    case "look":
    case "set-status":
    case "tap":
    case "untap":
    case "add-defending":
    case "equip":
    case "pitch-card":
    // CR 8.5.29 Charge (Helm of Halo's Grace): hand card charged to soul is
    // chosen at resolution when declared at-resolution.
    case "charge":
    // CR 8.5.58 Sharpen (e.g. Hala activated ability): target sword is chosen
    // at resolution when declared at-resolution.
    case "sharpen":
    case "awaken":
    // CR 8.5.34 Freeze / unfreeze: arsenal, ally, equipment chosen at resolution
    // (Glacial Horns: up to 1 arsenal + 1 Ally).
    case "freeze":
    case "unfreeze":
    // Silken Form / Dromai ash family: transform target permanent (Ash) chosen
    // at resolution after Instant/Action destroy costs resolve.
    case "transform":
    case "transform-into-resolving-card":
      target = effect.target;
      break;
    // Attack reactions / grants that choose an on-chain attack (Blade Flash,
    // etc.): open entity-target when the grant target is at-resolution.
    case "grant-property":
      target = effect.target ?? null;
      break;
    // CR 6.2.2a Stasis Cell parity: a rule-modification may anchor its
    // restriction on a CHOSEN subject ("target equipment") authored as an
    // at-resolution object target on `effect.subject` — select it at resolution
    // exactly like freeze/grant-property. (`effect.subject` may also be a bare
    // FabCardFilter for blanket restrictions, in which case there is no
    // per-object decision and we fall through with no target.)
    case "rule-modification":
      if (
        typeof effect.subject !== "object" ||
        effect.subject === null ||
        !("selector" in effect.subject)
      ) {
        return null;
      }
      target = effect.subject;
      break;
    case "prevention":
      // Steadfast: choose the source whose future damage the shielding
      // prevention can replace at resolution.
      target = effect.source ?? null;
      break;
    // Gold Baited Hook: a conditional theft target is chosen only when an
    // opposing Gold exists, so gain-control must support resolution-time
    // object selection just like other object-targeting effect leaves.
    // give/steal share the gain-control primitive (CR 8.5.53/8.5.54) and
    // retrieve (CR 8.5.51) likewise selects an object at resolution.
    case "gain-control":
    case "give":
    case "steal":
    case "retrieve":
      target = effect.target;
      break;
    case "modify-numeric":
      // Continuous numeric buffs with at-resolution object targets also choose
      // at resolution (not only permanent-duration leaves).
      target = effect.target ?? null;
      break;
    // Verdance / arcane pings: optional "deal 1 arcane to any opposing target"
    // chooses the hero/permanent at resolution after the optional is accepted.
    case "deal-damage":
      target = effect.target;
      break;
    // Meet Madness / pure choose-card bindings: "They choose a card in their
    // hand/arsenal" is at-resolution selection before a sequence banish step.
    case "choose-card":
      target = effect.target;
      break;
    // Vow of Vengeance: "Mark target Arakni" — hero-zone object chosen at
    // resolution (not only opponent-seat hero selectors).
    case "mark":
      target = effect.target;
      break;
    case "play-card":
      target = effect.source;
      break;
    // Shiyana / continuous copy: the copy *source* is chosen at resolution
    // ("becomes a copy of target hero"), not the subject being overwritten.
    case "copy":
      target = effect.source;
      break;
    case "create-token":
      if (!effect.copySource) return null;
      target = effect.copySource;
      break;
    // Prized Galea / Up the Ante: the wagering attack is a real declared
    // at-resolution target, not an implicit fallback to the ability source.
    case "wager":
      if (!effect.attacker) return null;
      target = effect.attacker;
      break;
    default:
      return null;
  }
  return target?.selector === "object" && target.declared === "at-resolution"
    ? { ...target, declared: "at-resolution" }
    : null;
}

/**
 * Resolve a printed chooser seat (optional effects, at-resolution targets).
 * Keeps ability controllerId fixed; only the answering player changes.
 */
function resolveChooserSeat(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  chooser: import("@tcg/flesh-and-blood-types").FabPlayer,
): string {
  if (chooser === "controller" || chooser === "self") return layer.controllerId;
  if (chooser === "iteration-subject") {
    const subject = layer.bindings["iteration-subject"];
    if (typeof subject === "string" && state.playerIds.some((playerId) => playerId === subject))
      return subject;
    return layer.controllerId;
  }
  if (chooser === "target-controller") {
    const targetController = layer.bindings["target-controller"];
    if (
      typeof targetController === "string" &&
      state.playerIds.some((playerId) => playerId === targetController)
    ) {
      return targetController;
    }
    return layer.controllerId;
  }
  if (chooser === "opponent" || chooser === "another-hero" || chooser === "each-other-hero") {
    return state.playerIds.find((id) => id !== layer.controllerId) ?? layer.controllerId;
  }
  if (chooser === "attacking-hero") {
    return state.combat?.activeLink?.attackingPlayerId ?? layer.controllerId;
  }
  if (chooser === "defending-hero" || chooser === "attack-target") {
    return state.combat?.activeLink?.defendingPlayerId ?? layer.controllerId;
  }
  if (chooser === "winner" || chooser === "loser") {
    const bound = layer.bindings[chooser];
    if (typeof bound === "string" && state.playerIds.some((playerId) => playerId === bound)) {
      return bound;
    }
  }
  return layer.controllerId;
}

/** Actor who answers an at-resolution object target (discard from opponent hand, etc.). */
function resolutionTargetActorId(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  effect: FabEffect,
  target: FabAtResolutionObjectTarget,
): string {
  // Who answers ≠ scan controller. Player-relative zones always scan from
  // layer.controllerId; only the chooser seat changes here.
  //
  // Explicit `target.chooser` wins (Theryon "they destroy a permanent they
  // control"). Otherwise:
  // - Private-zone picks from another seat (hand/deck/arsenal) are answered
  //   by that seat's owner ("discards a card", "puts a card on the bottom…").
  // - Public opposing targets (hero/permanent damage) stay with the effect
  //   controller ("deal 1 arcane to any opposing target").
  // - Combat seats and iteration-subject use their dedicated identities.
  if (effect.type === "choose-card" && effect.chooser) {
    return resolveChooserSeat(state, layer, effect.chooser);
  }
  if (target.selector === "object") {
    if (target.chooser) {
      return resolveChooserSeat(state, layer, target.chooser);
    }
    const privateOwnerZones = new Set(["hand", "deck", "arsenal"]);
    const boundSeat =
      typeof target.player === "object" && target.player !== null && "binding" in target.player
        ? layer.bindings[target.player.binding]
        : undefined;
    if (
      typeof boundSeat === "string" &&
      state.playerIds.some((playerId) => playerId === boundSeat) &&
      (target.zones ?? []).some((zone) => privateOwnerZones.has(zone))
    ) {
      return boundSeat;
    }
    if (target.player === "attack-target" || target.player === "defending-hero") {
      return state.combat?.activeLink?.defendingPlayerId ?? layer.controllerId;
    }
    if (target.player === "attacking-hero") {
      return state.combat?.activeLink?.attackingPlayerId ?? layer.controllerId;
    }
    if (target.player === "iteration-subject") {
      const subject = layer.bindings["iteration-subject"];
      if (typeof subject === "string" && state.playerIds.some((playerId) => playerId === subject))
        return subject;
      return layer.controllerId;
    }
    if (target.player === "target-controller") {
      return resolveChooserSeat(state, layer, "target-controller");
    }
    // CR 1.8.6: the player instructed by the effect determines the parameters.
    // These player strings NAME the instructed seat for its own zone ("each
    // hero banishes a card from their hand", "the winner discards a card",
    // "they may give you a token") — that seat answers, regardless of zone
    // visibility; only the candidate legality depends on the pool.
    if (
      target.player === "each-other-hero" ||
      target.player === "another-hero" ||
      target.player === "winner" ||
      target.player === "loser"
    ) {
      return resolveChooserSeat(state, layer, target.player);
    }
    // for-each "their graveyard" omits player; the bound seat answers.
    if (!target.player) {
      const subject = layer.bindings["iteration-subject"];
      if (typeof subject === "string" && state.playerIds.some((playerId) => playerId === subject))
        return subject;
    }
    if (target.player === "opponent") {
      const zones = target.zones ?? [];
      if (zones.some((zone) => privateOwnerZones.has(zone))) {
        const opponent = state.playerIds.find((id) => id !== layer.controllerId);
        return opponent ?? layer.controllerId;
      }
      return layer.controllerId;
    }
  }
  return layer.controllerId;
}

/**
 * Cheap zone simulation for decisionless prefix steps so later at-resolution
 * scans see post-prefix contents (return-then-discard, draw-then-look).
 */
export function applyDeterminedPrefixStepToClone(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  step: FabEffect,
): Readonly<FabMatchState> | null {
  if (step.type === "draw") return applyDrawToClone(state, layer, step);
  if (step.type === "add-counter") return applyAddCounterToClone(state, layer, step);
  if (step.type === "sharpen") return applySharpenToClone(state, layer, step);
  if (step.type !== "move-card" && step.type !== "discard") return null;
  const target = step.target;
  if (!target || typeof target !== "object" || !("selector" in target)) return null;
  if (target.selector !== "object" && target.selector !== "binding") return null;
  const objects = objectTargets(state, layer, target, "stage", {}, []);
  if (!objects || objects.length === 0) return null;
  const destCatalog =
    step.type === "discard"
      ? "graveyard"
      : "to" in step && step.to && typeof step.to === "object" && "zone" in step.to
        ? String(step.to.zone)
        : null;
  if (!destCatalog) return null;
  const destEngine = catalogZoneToEngine(destCatalog);
  if (!destEngine) return null;
  return prepareFabStateWithResult(currentFabState(state), (draft) => {
    for (const object of objects) {
      const ownerId = object.ownerId;
      const fromCatalog = eventZoneForSnapshot(object.zone);
      const fromEngine = fromCatalog ? catalogZoneToEngine(fromCatalog) : null;
      if (!fromEngine) continue;
      const fromList = draft.containers.zonesByPlayerId[ownerId]?.[fromEngine];
      const toList = draft.containers.zonesByPlayerId[ownerId]?.[destEngine];
      if (!fromList || !toList) continue;
      const index = fromList.indexOf(object.instanceId);
      if (index < 0) continue;
      fromList.splice(index, 1);
      if (step.type === "move-card" && step.to.position === "bottom") {
        toList.unshift(object.instanceId);
      } else if (
        step.type === "move-card" &&
        typeof step.to.position === "object" &&
        "index" in step.to.position
      ) {
        toList.splice(
          Math.max(0, Math.min(step.to.position.index, toList.length)),
          0,
          object.instanceId,
        );
      } else {
        toList.push(object.instanceId);
      }
    }
    return true;
  }).state;
}

export function applyDrawToClone(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  step: Extract<FabEffect, { type: "draw" }>,
): Readonly<FabMatchState> | null {
  if (typeof step.count !== "number" || step.count <= 0) return null;
  const count = step.count;
  const player = step.player;
  if (typeof player === "object") return null;
  let playerIds: readonly string[] | null = null;
  switch (player) {
    case "controller":
    case "self":
      playerIds = [layer.controllerId];
      break;
    case "opponent":
    case "another-hero":
    case "each-other-hero":
      playerIds = state.playerIds.filter((id) => id !== layer.controllerId);
      break;
    case "attacking-hero":
      playerIds = optionalPlayerId(
        state.combat?.activeLink?.attackingPlayerId ?? state.lastClosedCombat?.attackingPlayerId,
      );
      break;
    case "defending-hero":
    case "attack-target":
      playerIds = optionalPlayerId(
        state.combat?.activeLink?.defendingPlayerId ?? state.lastClosedCombat?.defendingPlayerId,
      );
      break;
    case "any":
    case "each":
      playerIds = state.playerIds;
      break;
    default:
      playerIds = null;
  }
  if (!playerIds || playerIds.length === 0) return null;
  // This is a decision-discovery rehearsal, not command state. Detach from an
  // active outer command draft before simulating earlier deterministic draws.
  return prepareFabStateWithResult(currentFabState(state), (draft) => {
    for (const playerId of playerIds) {
      const deck = draft.containers.zonesByPlayerId[playerId]?.deck;
      const hand = draft.containers.zonesByPlayerId[playerId]?.hand;
      if (!deck || !hand) continue;
      for (let i = 0; i < count; i += 1) {
        const top = deck.pop();
        if (!top) break;
        hand.push(top);
      }
    }
    return true;
  }).state;
}

function optionalPlayerId(id: string | undefined | null): readonly string[] | null {
  return id ? [id] : null;
}

/** Decision-discovery rehearsal: later sequence steps must see prefix counters. */
function applySharpenToClone(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  step: Extract<FabEffect, { type: "sharpen" }>,
): Readonly<FabMatchState> | null {
  const timesRaw = step.times ?? 1;
  const times = typeof timesRaw === "number" ? timesRaw : null;
  if (times === null || times <= 0) return null;
  const outputBinding =
    "outputBinding" in step && typeof step.outputBinding === "string" ? step.outputBinding : null;
  const target =
    outputBinding && layer.bindings[outputBinding]
      ? ({ selector: "binding", binding: outputBinding } as const)
      : step.target;
  return applyAddCounterToClone(state, layer, {
    type: "add-counter",
    counter: { kind: "numeric", value: 1, property: "power" },
    count: times,
    target,
  });
}

/** Decision-discovery rehearsal: later sequence steps must see prefix counters. */
function applyAddCounterToClone(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  step: Extract<FabEffect, { type: "add-counter" }>,
): Readonly<FabMatchState> | null {
  const count = typeof step.count === "number" ? step.count : null;
  if (count === null || count <= 0) return null;
  const objects = objectTargets(state, layer, step.target, "stage", {}, []);
  if (!objects || objects.length === 0) return null;
  if (step.counter.kind === "numeric" && typeof step.counter.value !== "number") return null;
  const counterToAdd = step.counter;
  return prepareFabStateWithResult(currentFabState(state), (draft) => {
    for (const object of objects) {
      const live = draft.objects[object.instanceId];
      if (!live) continue;
      const existing = live.counters.find((counter) =>
        counterToAdd.kind === "named"
          ? counter.kind === "named" && counter.name === counterToAdd.name
          : counter.kind === "numeric" &&
            counter.property === counterToAdd.property &&
            counter.value === counterToAdd.value,
      );
      if (existing) {
        if (existing.kind === "named") {
          live.counters = live.counters.map((counter) =>
            counter.kind === "named" && counter.name === existing.name
              ? { ...counter, count: counter.count + count }
              : counter,
          );
        } else if (existing.kind === "numeric") {
          live.counters = live.counters.map((counter) =>
            counter.kind === "numeric" &&
            counter.property === existing.property &&
            counter.value === existing.value
              ? { ...counter, count: counter.count + count }
              : counter,
          );
        }
      } else {
        live.counters = [...live.counters, { ...counterToAdd, count }];
      }
    }
    return true;
  }).state;
}
