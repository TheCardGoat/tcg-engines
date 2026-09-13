import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { compileFabContinuousEffect } from "./continuous/compiler.ts";
import type { FabProcessId, ProposedEvent } from "./events.ts";
import { fabLayerKeywords, type FabActivatedLayer, type FabRulesStackLayer } from "./layers.ts";
import { nextFabDestinationRef, snapshotObject } from "./snapshots.ts";
import { buildFabRulesViewWithLki } from "./state-rules-view.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import { fabPrimaryDefenders } from "../game/combat.ts";

import {
  type FabEffectProposalResult,
  type ProposalContext,
  attackTargetController,
  baseEvent,
  conditionHolds,
  effectsForLayer,
  layerWithEventBindings,
  proposedObjectResetCount,
  withObjectIncarnationOffset,
} from "./proposals/shared.ts";
import { proposeEffect } from "./proposals/propose-effect.ts";
import type { FabTargetMap } from "./targets.ts";

export type { FabEffectProposalResult };
export { conditionHolds };
export { proposeEffect };

/**
 * CR 8.3.5a: go again granted to a non-attack layer restores the action point
 * after resolution. The printed keyword lives in `layer.keywords`, but a grant
 * (e.g. Eloquence "the card gets go again") lands as a continuous effect on
 * the layer source object. Evaluate the live object so granted go again is
 * honored exactly like the combat-step path (CR 8.3.5b) does for attacks.
 */
function layerSourceCurrentlyHasGoAgain(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
): boolean {
  const view = buildFabRulesViewWithLki(state, [layer.source]);
  const object = view.object(layer.source.ref);
  const currentHasGoAgain =
    object?.current.keywords.some((keyword) => keyword.name === "go-again") === true;
  if (layer.kind === "card") {
    // Printed go again follows the live object so "lose go again" (Spinal
    // Crush) can strip the refund. Ability-level layerKeywords (Bloodrush
    // 6+ payoff) are not printed on the card and still refund.
    if (currentHasGoAgain) return true;
    const printedGoAgain =
      object?.base.keywords.some((keyword) => keyword.name === "go-again") === true;
    return !printedGoAgain && fabLayerKeywords(layer).includes("go-again");
  }
  // An activated ability is a separate layer from its source card. A keyword
  // granted to that card (Astral Ambience) does not grant it to the ability.
  return fabLayerKeywords(layer).includes("go-again");
}

/** Same-resolution grant ("If you do, this gets go again") has not committed
 * yet when CR 8.3.5a is settled, so inspect the proposed events as well. */
function proposedEventsGrantGoAgainToLayerSource(
  events: readonly ProposedEvent[],
  layer: FabRulesStackLayer,
): boolean {
  return events.some((event) => {
    if (event.name !== "continuous-effect-generated") return false;
    const grantsGoAgain = event.data.atoms.some(
      (atom) =>
        atom.kind === "ability" &&
        atom.property.kind === "keyword" &&
        atom.property.keyword.name === "go-again",
    );
    if (!grantsGoAgain) return false;
    return event.data.initialSubjects.some(
      (subject) => subject.instanceId === layer.source.instanceId,
    );
  });
}

/** Translate supported resolution leaves into rules events without mutating state. */
export function proposeLayerResolutionEvents(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  processId: FabProcessId,
  effectChoices: Readonly<Record<string, boolean>> = {},
  effectPartitions: Readonly<Record<string, Readonly<Record<string, readonly string[]>>>> = {},
  effectOptions: Readonly<Record<string, string>> = {},
  effectTargets: FabTargetMap = {},
  effectPaymentPitches: Readonly<
    Record<string, readonly import("./continuous/ir.ts").FabObjectRef[]>
  > = {},
): FabEffectProposalResult {
  if (layer.kind === "activated" && layer.role === "attack") {
    if (!layer.attackTarget) {
      return { supported: false, reason: "attack ability layer has no declared target" };
    }
    const object = snapshotObject(
      state,
      layer.source.instanceId,
      layer.controllerId,
      layer.source.zoneRef.zone,
    );
    const attackEvent: ProposedEvent = {
      ...baseEvent(layer, processId),
      name: "attack",
      affected: [object],
      source: object,
      data: {
        actorId: layer.controllerId,
        object,
        target: layer.attackTarget,
        defendingPlayerId: attackTargetController(layer.attackTarget),
        ...((layer.additionalAttackTargets?.length ?? 0) > 0
          ? { additionalTargets: layer.additionalAttackTargets }
          : {}),
      },
    };
    const keywordEvents: ProposedEvent[] = [];
    for (const [index, keyword] of fabLayerKeywords(layer).entries()) {
      if (keyword !== "go-again") {
        return {
          supported: false,
          reason: `unsupported activated attack layer keyword ${keyword}`,
        };
      }
      const effect: FabEffect = {
        type: "grant-property",
        property: { kind: "keyword", keyword: { name: "go-again" } },
        target: { selector: "self" },
        duration: "this-combat-chain",
      };
      const effectId = `${processId}:${layer.layerId}:layer-keyword-${index}:continuous`;
      const compiled = compileFabContinuousEffect({ effectId, effect });
      if (!compiled.ok) return { supported: false, reason: compiled.error.mechanic };
      keywordEvents.push({
        ...baseEvent(layer, processId),
        name: "continuous-effect-generated",
        affected: [object],
        data: {
          effectId,
          controllerId: layer.controllerId,
          source: object,
          origin: { kind: "layer" },
          effectPath: ["layer-keyword", index],
          simultaneousGroupId: null,
          atoms: compiled.atoms,
          duration: "this-combat-chain",
          expiresAt: {
            kind: "combat-chain",
            combatNumber: (state.combat?.chainLinkNumber ?? 0) + 1,
          },
          initialSubjects: [object.ref],
          futureApplicability: null,
        },
      });
    }
    const events = [attackEvent, ...keywordEvents];
    // The layer's own `attack` event covers the `attack-with` step; any other
    // printed rider steps in the effect tree still need to resolve (e.g.
    // CIN002 kunai "destroy this when the combat chain closes" is a
    // delayed-trigger step after attack-with). Walk the tree with the same
    // paths findDecision uses so answered choices/targets stay consistent.
    const riders = proposeAttackLayerRiderEffects(
      state,
      layer,
      processId,
      effectChoices,
      effectPartitions,
      effectOptions,
      effectTargets,
      effectPaymentPitches,
    );
    if (!riders.supported) return riders;
    events.push(...riders.events);
    return {
      supported: true,
      events,
      eventGroups: [events],
    };
  }
  const effects = effectsForLayer(layer);
  const events: ProposedEvent[] = [];
  const eventGroups: (readonly ProposedEvent[])[] = [];
  let resolvingLayer: FabRulesStackLayer = layer;
  let resetOffset = 0;
  for (const [index, effect] of effects.entries()) {
    const ctx: ProposalContext = {
      state: withObjectIncarnationOffset(state, resetOffset),
      layer: resolvingLayer,
      processId,
      effectChoices,
      effectPartitions,
      effectOptions,
      effectTargets,
      effectPaymentPitches,
      effectPath: [index],
      targetPath: `effect-${index}`,
    };
    const result = proposeEffect(ctx, effect);
    if (!result.supported) return result;
    events.push(...result.events);
    resetOffset += proposedObjectResetCount(result.events);
    const effectGroups = result.eventGroups ?? (result.events.length > 0 ? [result.events] : []);
    eventGroups.push(...effectGroups);
    resolvingLayer = layerWithEventBindings(resolvingLayer, result.events);
  }
  const hasPendingCardResolutionStep =
    layer.kind === "card" && layer.resolutionPlan.cursor + 1 < layer.resolutionPlan.steps.length;
  if (
    !hasPendingCardResolutionStep &&
    (layerSourceCurrentlyHasGoAgain(state, layer) ||
      (layer.kind === "card" && proposedEventsGrantGoAgainToLayerSource(events, layer))) &&
    // CR 8.3.5a applies to every non-attack card or activated-ability layer,
    // including Instants. A triggered ability is not a playable layer that
    // spent an action point, so a keyword on its source cannot refund one.
    ((layer.kind === "activated" && layer.role === "ability") ||
      (layer.kind === "card" && layer.role !== "attack"))
  ) {
    const goAgain: ProposedEvent = {
      ...baseEvent(layer, processId),
      name: "go-again",
      affected: [layer.source],
      data: { object: layer.source, controllerId: layer.controllerId },
    };
    events.push(goAgain);
    eventGroups.push([goAgain]);
  }
  if (layer.kind === "card") {
    if (layer.role === "attack") {
      if (!layer.attackTarget) {
        return { supported: false, reason: "attack card layer has no declared target" };
      }
      // CR 5.3.4 then 5.3.6 / 7.2.2: every same-face resolution ability
      // generates its effects while the attack is still a layer, then the
      // card leaves the stack onto the combat chain. Emitting the
      // stack→combat-chain move on an earlier step makes the next ability's
      // required leave-stack journal fail (Tempest Palm Gustwave combo +
      // chain-link-3 go again).
      if (hasPendingCardResolutionStep) return { supported: true, events, eventGroups };
      const moveToChain: ProposedEvent = {
        ...baseEvent(layer, processId),
        name: "move-zone",
        affected: [layer.source],
        data: {
          object: layer.source,
          destinationRef: null,
          from: "stack",
          to: "combat-chain",
          reason: "resolve",
        },
      };
      const attack: ProposedEvent = {
        ...baseEvent(layer, processId),
        name: "attack",
        affected: [layer.source],
        data: {
          actorId: layer.controllerId,
          object: layer.source,
          target: layer.attackTarget,
          defendingPlayerId: attackTargetController(layer.attackTarget),
          ...((layer.additionalAttackTargets?.length ?? 0) > 0
            ? { additionalTargets: layer.additionalAttackTargets }
            : {}),
        },
      };
      events.push(moveToChain, attack);
      eventGroups.push([moveToChain], [attack]);
      return { supported: true, events, eventGroups };
    }
    if (layer.role === "defense-reaction") {
      const link = state.combat?.activeLink;
      if (
        !link ||
        state.combat?.step !== "reaction" ||
        link.defendingPlayerId !== layer.controllerId
      ) {
        return {
          supported: false,
          reason: "defense reaction no longer has a legal reaction-step attack",
        };
      }
      const attack = snapshotObject(
        state,
        link.activeAttack.sourceObjectId,
        link.attackingPlayerId,
        "combatChain",
      );
      const blockedByDominate =
        layer.playedFrom === "hand" &&
        attack.current.keywords.some((keyword) => keyword.name === "dominate") &&
        fabPrimaryDefenders(link).some(
          (instanceId) => link.defendingOrigins[instanceId]?.kind === "hand",
        );
      if (blockedByDominate) {
        const failToResolve: ProposedEvent = {
          ...baseEvent(layer, processId),
          name: "move-zone",
          affected: [layer.source],
          data: {
            object: layer.source,
            destinationRef: nextFabDestinationRef(state, layer.source),
            from: "stack",
            to: "graveyard",
            reason: "resolve",
          },
        };
        return { supported: true, events: [failToResolve], eventGroups: [[failToResolve]] };
      }
      const defend: ProposedEvent = {
        ...baseEvent(layer, processId),
        name: "defend",
        affected: [layer.source],
        bindings: { defendingCard: layer.source, attack },
        data: {
          actorId: layer.controllerId,
          object: layer.source,
          destinationRef: null,
          attack,
          from: "stack",
          origin: layer.playedFrom,
        },
      };
      // The card becomes defending as it resolves; its resolution instructions
      // then take effect. This ordering is observable for Flic Flak: its
      // "next card you defend with" clause must not see Flic Flak's own defend
      // event. It also ensures a defense reaction that fails to resolve never
      // generates its printed effects.
      return {
        supported: true,
        events: [defend, ...events],
        eventGroups: [[defend], ...eventGroups],
      };
    }
    // A multi-part card remains on the stack until its final instruction set resolves.
    if (hasPendingCardResolutionStep) return { supported: true, events, eventGroups };
    // Printed effects that already take the source off the stack (negate,
    // equip, transform-host leave, self-move) are the card's resolution
    // destination. A second stack→graveyard/arena cleanup would find a stale
    // from-zone and fail the journal (self-negate, Evo equip, Invocation).
    if (proposedEventsLeaveStack(events, layer.source.instanceId)) {
      return { supported: true, events, eventGroups };
    }
    // Permanents enter the arena on resolve (CR 8.2.4–8.2.9). Incarnate
    // (IAR) also causes a non-permanent action to enter the arena as a permanent.
    const becomesPermanent =
      layer.source.current.typeBox.subtypes.some((subtype) =>
        [
          "Aura",
          "Item",
          "Ally",
          "Landmark",
          "Affliction",
          "Ash",
          "Figment",
          "Invocation",
          "Construct",
        ].includes(subtype),
      ) ||
      // CR 8.1.11: a Demi-Hero is an arena-card. "Demi-Hero" is a type token,
      // so check typeBox.types (not subtypes).
      layer.source.current.typeBox.types.includes("Demi-Hero") ||
      layer.source.current.keywords.some((keyword) => keyword.name === "incarnate");
    // CR 8.2.11c: an Affliction enters the arena under an opponent's control.
    // 1v1 fast-path: the single other player.
    const isAffliction = layer.source.current.typeBox.subtypes.includes("Affliction");
    const afflictionDestinationPlayer =
      becomesPermanent && isAffliction
        ? (state.playerIds.find((id) => id !== layer.source.ownerId) ?? null)
        : null;
    const cleanup: ProposedEvent = {
      ...baseEvent(layer, processId),
      name: becomesPermanent ? "enter-arena" : "move-zone",
      affected: [layer.source],
      data: {
        object: layer.source,
        destinationRef: becomesPermanent
          ? null
          : nextFabDestinationRef(withObjectIncarnationOffset(state, resetOffset), layer.source),
        from: "stack",
        to: becomesPermanent ? "permanent" : "graveyard",
        reason: "resolve",
        destinationPlayerId: afflictionDestinationPlayer ?? undefined,
      },
    };
    events.push(cleanup);
    eventGroups.push([cleanup]);
  }
  return { supported: true, events, eventGroups };
}

/**
 * Activated attack layers resolve their primary `attack` event directly (the
 * layer carries the declared target), so the `attack-with` step in the effect
 * tree is already satisfied. Any OTHER printed rider steps in the tree still
 * need to resolve — e.g. CIN002 kunai "Once per Turn Action - {r}, destroy
 * this when the combat chain closes: Attack. Go again" models the destroy as
 * a `delayed-trigger` step after `attack-with`. Walk the tree with the same
 * child paths `findDecision` uses (sequence step index appended) so answered
 * choices/targets recorded under those paths are honoured, and propose each
 * non-`attack-with` leaf through the standard dispatch.
 */
function proposeAttackLayerRiderEffects(
  state: FabRulesSnapshot,
  layer: FabActivatedLayer,
  processId: FabProcessId,
  effectChoices: Readonly<Record<string, boolean>>,
  effectPartitions: Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>,
  effectOptions: Readonly<Record<string, string>>,
  effectTargets: FabTargetMap,
  effectPaymentPitches: Readonly<
    Record<string, readonly import("./continuous/ir.ts").FabObjectRef[]>
  >,
): FabEffectProposalResult {
  const root = layer.effect;
  if (!root) return { supported: true, events: [] };
  const events: ProposedEvent[] = [];
  const eventGroups: (readonly ProposedEvent[])[] = [];
  let resetOffset = 0;
  const walk = (
    effect: FabEffect,
    path: readonly number[],
    resolvingLayer: FabRulesStackLayer,
  ): boolean => {
    if (effect.type === "attack-with") return true; // covered by the layer's attack event
    if (effect.type === "sequence") {
      for (const [index, step] of effect.steps.entries()) {
        if (!walk(step, [...path, index], resolvingLayer)) return false;
      }
      return true;
    }
    const ctx: ProposalContext = {
      state: withObjectIncarnationOffset(state, resetOffset),
      layer: resolvingLayer,
      processId,
      effectChoices,
      effectPartitions,
      effectOptions,
      effectTargets,
      effectPaymentPitches,
      effectPath: path,
      targetPath: `effect-${path.join(".")}`,
    };
    const result = proposeEffect(ctx, effect);
    if (!result.supported) return false;
    events.push(...result.events);
    resetOffset += proposedObjectResetCount(result.events);
    eventGroups.push(...(result.eventGroups ?? (result.events.length > 0 ? [result.events] : [])));
    return true;
  };
  if (!walk(root, [0], layer)) {
    return { supported: false, reason: "unsupported activated-attack rider effect" };
  }
  return { supported: true, events, eventGroups };
}

/** A printed effect already took this source off the stack. */
function proposedEventsLeaveStack(
  events: readonly ProposedEvent[],
  sourceInstanceId: string,
): boolean {
  return events.some((event) => {
    if (event.name === "move-zone") {
      return event.data.object.instanceId === sourceInstanceId && event.data.from === "stack";
    }
    if (event.name === "banish" || event.name === "destroy") {
      return (
        event.data.object.instanceId === sourceInstanceId &&
        (event.data.from === "stack" || event.data.from === undefined)
      );
    }
    if (event.name === "enter-arena") {
      return event.data.object.instanceId === sourceInstanceId;
    }
    return false;
  });
}
