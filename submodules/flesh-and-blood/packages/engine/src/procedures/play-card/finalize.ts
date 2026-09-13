import type { FabMatchState } from "../../state.ts";
import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import { executeFabEventJournalTransaction } from "../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { nextFabDestinationRef, snapshotObject } from "../../rules/snapshots.ts";
import { buildFabDesiredRulesView, buildFabRulesView } from "../../rules/state-rules-view.ts";
import { fabDeclaredPlayerBindings } from "../../rules/layers.ts";
import {
  continuousEffectInstanceIsActive,
  futureApplicabilityIncludesEvent,
} from "../../rules/continuous/runtime.ts";
import { appendScrapEventGroups } from "./scrap.ts";
import { appendBeatChestEventGroups } from "./beat-chest.ts";
import { appendCrankIntentGroup } from "./crank.ts";
import { appendFuseEventGroups } from "./fuse.ts";
import { appendBoostEventGroups } from "./boost.ts";
import { appendChargeEventGroups } from "./charge.ts";
import { appendBanishCostEventGroups } from "./banish-cost.ts";
import type { FabPlayProcedureResult } from "./types.ts";
import { advanced, failure, reversePlay } from "./types.ts";

import { attackTargetSnapshot } from "./helpers.ts";

function printedCardRole(
  types: readonly string[],
  subtypes: readonly string[],
): "action" | "instant" | "attack" | "attack-reaction" | "defense-reaction" | null {
  if (subtypes.includes("Attack")) return "attack";
  if (types.includes("Attack Reaction")) return "attack-reaction";
  if (types.includes("Defense Reaction")) return "defense-reaction";
  // A melded Action // Instant card has both type boxes on the stack and is
  // still an action card even when an external permission changes its timing.
  if (types.includes("Action")) return "action";
  if (types.includes("Instant")) return "instant";
  return null;
}

/**
 * Materialize play-scoped floating property grants for the committed play LKI.
 * Announcement reconciliation normally latches older applicators. Explicit
 * `events:["play"]` grants intentionally ignore activations/attacks/defends,
 * so finalize must evaluate their prospective application before publishing
 * the play event and its turn-history facts.
 */
function prospectivePlayView(state: FabMatchState, actorId: string, instanceId: string) {
  const baseView = buildFabRulesView(state);
  const record = state.objects[instanceId];
  if (!record) return baseView;
  const ref = { instanceId: record.instanceId, incarnation: record.incarnation };
  const object = baseView.object(ref);
  if (!object) return baseView;
  let changed = false;
  const continuousEffectInstances = state.continuousEffectInstances.map((instance) => {
    const future = instance.futureApplicability;
    const playScoped = futureApplicabilityIncludesEvent(future?.events ?? null, "play");
    const announcedSubject = future?.latchedSubjects.find(
      (subject) => subject.instanceId === ref.instanceId,
    );
    if (
      future &&
      playScoped &&
      announcedSubject &&
      announcedSubject.incarnation !== ref.incarnation
    ) {
      changed = true;
      return {
        ...instance,
        futureApplicability: {
          ...future,
          observedSubjects: future.observedSubjects.map((subject) =>
            subject.instanceId === ref.instanceId ? ref : subject,
          ),
          latchedSubjects: future.latchedSubjects.map((subject) =>
            subject.instanceId === ref.instanceId ? ref : subject,
          ),
        },
      };
    }
    if (
      !future ||
      future.remaining <= 0 ||
      !playScoped ||
      (instance.controllerId !== actorId && !future.observesOpponent) ||
      !continuousEffectInstanceIsActive(state, instance) ||
      future.latchedSubjects.some(
        (subject) =>
          subject.instanceId === ref.instanceId && subject.incarnation === ref.incarnation,
      ) ||
      future.observedSubjects.length + 1 < future.ordinal ||
      !baseView.matchesFilter(object, future.filter, {
        controllerId: instance.controllerId,
        source: instance.source.ref,
        bindings:
          instance.origin === "layer"
            ? instance.lockedBindings
            : { objects: {}, numbers: {}, strings: {} },
      })
    ) {
      return instance;
    }
    changed = true;
    return {
      ...instance,
      futureApplicability: {
        ...future,
        latchedSubjects: [...future.latchedSubjects, ref],
      },
    };
  });
  return changed ? buildFabDesiredRulesView({ ...state, continuousEffectInstances }) : baseView;
}

function pitchedTalentTokens(typeBox: {
  readonly supertypes: readonly string[];
  readonly types: readonly string[];
  readonly subtypes: readonly string[];
}): readonly string[] {
  return [...typeBox.supertypes, ...typeBox.types, ...typeBox.subtypes];
}

function applyPitchedTalentTokens(
  bindings: Record<string, string | number>,
  talents: readonly string[],
): void {
  if (talents.includes("Earth")) bindings["pitched-this-way-earth-card"] = 1;
  if (talents.includes("Ice")) bindings["pitched-this-way-ice-card"] = 1;
  if (talents.includes("Lightning")) bindings["pitched-this-way-lightning-card"] = 1;
  if (talents.includes("Chi")) bindings["pitched-this-way-chi-card"] = 1;
}

function pitchedTalentBindings(
  eventGroups: readonly import("../../rules/events.ts").FabProposedEventGroup[],
  actorId: string,
  preview?: FabMatchState,
  pitchedInstanceIds?: readonly string[],
): Record<string, string | number> {
  const bindings: Record<string, string | number> = {};
  let pitchedAttackAction = false;
  let pitchedNonAttackAction = false;
  const pitchedChiIds = new Set<string>();
  for (const eventGroup of eventGroups) {
    for (const event of eventGroup.events) {
      if (event.name !== "pitch" || event.data.playerId !== actorId) continue;
      const pitched = event.data.object;
      const talents = pitchedTalentTokens(pitched.current.typeBox);
      applyPitchedTalentTokens(bindings, talents);
      if (talents.includes("Chi")) pitchedChiIds.add(pitched.ref.instanceId);
      // DYN172 Annals of Sutcliffe: "an attack action card and a 'non-attack'
      // action card were pitched this way" — classify each pitched card by its
      // printed type box (attack actions carry the Attack subtype; mirrors the
      // attack-and-non-attack-banished-this-way discrimination).
      if (pitched.current.typeBox.subtypes.includes("Attack")) pitchedAttackAction = true;
      else if (pitched.current.typeBox.types.includes("Action")) pitchedNonAttackAction = true;
    }
  }
  if (preview && pitchedInstanceIds) {
    for (const instanceId of pitchedInstanceIds) {
      const record = preview.objects[instanceId];
      if (!record) continue;
      const zone = preview.containers.zonesByPlayerId[actorId]?.pitch.includes(instanceId)
        ? "pitch"
        : "hand";
      let pitched: ReturnType<typeof snapshotObject>;
      try {
        pitched = snapshotObject(preview, instanceId, actorId, zone);
      } catch {
        continue;
      }
      applyPitchedTalentTokens(bindings, pitchedTalentTokens(pitched.current.typeBox));
      if (pitchedTalentTokens(pitched.current.typeBox).includes("Chi")) {
        pitchedChiIds.add(pitched.ref.instanceId);
      }
      if (pitched.current.typeBox.subtypes.includes("Attack")) pitchedAttackAction = true;
      else if (pitched.current.typeBox.types.includes("Action")) pitchedNonAttackAction = true;
    }
  }
  if (pitchedAttackAction && pitchedNonAttackAction) {
    bindings["pitched-attack-and-non-attack-action-to-play-this"] = "true";
  }
  if (pitchedAttackAction) {
    bindings["pitched-attack-action-card-to-play-this"] = "true";
  }
  if (pitchedNonAttackAction) {
    bindings["pitched-non-attack-action-card-to-play-this"] = "true";
  }
  bindings["pitched-this-way-chi-count"] = pitchedChiIds.size;
  return bindings;
}

/**
 * Preserve the parameters/events of leading play abilities for their connected
 * following resolution abilities (CR 1.7.6). Additional-cost events publish
 * canonical bindings such as `discardedCard`; the card layer must retain those
 * snapshots after the play transaction commits.
 */
function connectedPlayBindings(
  eventGroups: readonly import("../../rules/events.ts").FabProposedEventGroup[],
): import("../../rules/events.ts").FabEventBindings {
  return eventGroups.reduce<import("../../rules/events.ts").FabEventBindings>(
    (bindings, group) =>
      group.events.reduce(
        (groupBindings, event) => ({ ...groupBindings, ...event.bindings }),
        bindings,
      ),
    {},
  );
}

export function finalizePlay(
  state: FabMatchState,
  preview: FabMatchState,
  options: FabEventTransactionOptions,
): FabPlayProcedureResult {
  const process = state.rulesProcess!;
  const procedure = process.procedure!;
  if (procedure.kind !== "play-card")
    return failure(state, "The play procedure changed kind.", "stale_play_process");
  const player = preview.players[procedure.actorId]!;
  // The tentative announcement/pitch journal has already been reconciled in
  // `preview`.  Use that view for optional costs so a one-shot continuous
  // grant to the announced card (for example "the next attack gets Boost")
  // is visible before we decide whether to append its additional-cost events.
  const rulesView = prospectivePlayView(preview, procedure.actorId, procedure.object.instanceId);
  const objectRecord = preview.objects[procedure.object.instanceId];
  const liveObject = objectRecord
    ? rulesView.object({
        instanceId: objectRecord.instanceId,
        incarnation: objectRecord.incarnation,
      })
    : null;
  // The object record now owns its active face state; the canonical rules
  // view is authoritative without a split-specific property override.
  const currentObject = liveObject;
  const playedObject = currentObject
    ? snapshotObject(preview, procedure.object.instanceId, procedure.actorId, "stack", rulesView)
    : procedure.object;
  const currentTypes = currentObject?.current.typeBox.types ?? [];
  const currentSubtypes = currentObject?.current.typeBox.subtypes ?? [];
  const role = printedCardRole(currentTypes, currentSubtypes);
  if (role === null) {
    return failure(
      state,
      "The played card has no supported printed role.",
      "unsupported_play_declaration",
    );
  }
  const payableCost = Math.max(0, procedure.resourceCost);
  const chi = Math.min(player.chiPoints, payableCost);
  const resources = payableCost - chi;
  appendFabEventGroup(process, [
    {
      name: "spend-assets",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [],
      bindings: {},
      data: {
        playerId: procedure.actorId,
        chi,
        resources,
        life: 0,
        actionPoints: procedure.actionPointCost,
      },
    },
  ]);
  let resetOffset = 0;
  if (procedure.attackTarget) {
    const target = attackTargetSnapshot(state, procedure.attackTarget);
    if (!target)
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "illegal_parameters",
        message: "The declared attack target is no longer present.",
      });
    const additionalTargets = (procedure.additionalAttackTargets ?? []).flatMap((extra) => {
      const snap = attackTargetSnapshot(state, extra);
      return snap ? [snap] : [];
    });
    if (additionalTargets.length !== (procedure.additionalAttackTargets?.length ?? 0)) {
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "illegal_parameters",
        message: "A declared additional attack target is no longer present.",
      });
    }
    appendFabEventGroup(process, [
      {
        name: "attack-target-declared",
        processId: process.processId,
        cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
        controllerId: procedure.actorId,
        source: procedure.object,
        affected: [procedure.object],
        bindings: {},
        data: {
          actorId: procedure.actorId,
          object: procedure.object,
          target,
          ...(additionalTargets.length > 0 ? { additionalTargets } : {}),
        },
      },
    ]);
    // Spectra destroys the targeted permanent on attack declaration.
    if (procedure.attackTarget.kind === "spectra" && "instanceId" in target) {
      appendFabEventGroup(process, [
        {
          name: "destroy",
          processId: process.processId,
          cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [target],
          bindings: {},
          data: {
            object: target,
            destinationRef: nextFabDestinationRef(preview, target, resetOffset),
            from: target.zone,
            to: "graveyard",
            reason: "destroy",
          },
        },
      ]);
      resetOffset += 1;
    }
  }
  // The play event is APPENDED after the optional additional-cost stages below
  // so its bindings merge their event bindings (connectedPlayBindings) — the
  // card layer's resolution-condition context is built from the play event's
  // bindings (reducePlayEquip), so ability-level conditions like DTD051's
  // "If a yellow card is charged this way" (has-status yellow-charged-this-way,
  // chargedCard fallback) must see the charge/boost/scrap/beat-chest/banish
  // bindings. It is then spliced back to the announce position to preserve the
  // committed journal order (announce precedes cost payment).
  const playAnnounceIndex = procedure.eventGroups.length;
  const pendingBoostGrant =
    currentObject !== null &&
    preview.continuousEffectInstances.some(
      (instance) =>
        instance.controllerId === procedure.actorId &&
        (instance.futureApplicability?.remaining ?? 0) > 0 &&
        futureApplicabilityIncludesEvent(instance.futureApplicability!.events, "play") &&
        instance.atoms.some(
          (atom) =>
            atom.kind === "ability" &&
            atom.property.kind === "keyword" &&
            atom.property.keyword.name === "boost",
        ) &&
        rulesView.matchesFilter(currentObject, instance.futureApplicability!.filter, {
          controllerId: instance.controllerId,
          source: instance.source.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        }),
    );
  appendBoostEventGroups(
    process,
    procedure,
    preview,
    pendingBoostGrant && currentObject
      ? {
          ...currentObject,
          current: {
            ...currentObject.current,
            keywords: [...currentObject.current.keywords, { name: "boost" }],
          },
        }
      : currentObject,
    currentSubtypes,
    resetOffset,
  );
  const scrapError = appendScrapEventGroups(process, procedure, preview, currentObject);
  if (scrapError) {
    return reversePlay(state, process.processId, procedure.actorId, {
      code: "required_cost_unpayable",
      message: scrapError.message,
    });
  }
  const beatChestError = appendBeatChestEventGroups(process, procedure, preview, currentObject);
  if (beatChestError) {
    return reversePlay(state, process.processId, procedure.actorId, {
      code: "required_cost_unpayable",
      message: beatChestError.message,
    });
  }
  appendFuseEventGroups(process, procedure, preview, currentObject);
  const chargeError = appendChargeEventGroups(
    process,
    procedure,
    preview,
    currentObject,
    resetOffset,
  );
  if (chargeError) {
    return reversePlay(state, process.processId, procedure.actorId, {
      code: "required_cost_unpayable",
      message: chargeError,
    });
  }
  const banishCostError = appendBanishCostEventGroups(
    process,
    procedure,
    preview,
    currentObject,
    resetOffset,
  );
  if (banishCostError) {
    return reversePlay(state, process.processId, procedure.actorId, {
      code: "required_cost_unpayable",
      message: banishCostError,
    });
  }
  const playGroup = appendFabEventGroup(process, [
    {
      name: "play",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: playedObject,
      affected: [playedObject],
      // CR 8.3.38a: surface meld declaration for layer keyword tagging.
      bindings: {
        ...procedure.costBindings,
        ...(procedure.declaredModes.length > 0 &&
        (() => {
          const modalAbility = (currentObject?.current.abilities ?? []).find(
            (ability): ability is import("@tcg/flesh-and-blood-types").FabModalAbility =>
              ability.kind === "modal",
          );
          return (
            modalAbility !== undefined &&
            new Set(procedure.declaredModes).size === modalAbility.modes.length &&
            modalAbility.modes.every((mode) => procedure.declaredModes.includes(mode.id)) &&
            modalAbility.modes.length >= 2
          );
        })()
          ? { "chose-both": "true" }
          : {}),
        ...fabDeclaredPlayerBindings(procedure.declaredTargets),
        ...connectedPlayBindings(procedure.eventGroups),
        ...pitchedTalentBindings(
          procedure.eventGroups,
          procedure.actorId,
          preview,
          procedure.pitchedInstanceIds,
        ),
        ...(procedure.fuseInstanceIds.length > 0 &&
        currentObject?.current.keywords.some((keyword) => keyword.name === "fusion")
          ? { fused: procedure.object }
          : {}),
      },
      data: {
        actorId: procedure.actorId,
        object: playedObject,
        destinationRef: null,
        from: procedure.from,
        role,
        playTiming: procedure.playTiming,
        modes: procedure.declaredModes,
        targets: procedure.declaredTargets,
        attackTarget: procedure.attackTarget,
        splitPlayMethod: procedure.splitPlayMethod,
        ...((procedure.additionalAttackTargets?.length ?? 0) > 0
          ? { additionalAttackTargets: procedure.additionalAttackTargets }
          : {}),
      },
    },
  ]);
  procedure.eventGroups.splice(procedure.eventGroups.length - 1, 1);
  procedure.eventGroups.splice(playAnnounceIndex, 0, playGroup);
  // Transcend is now a first-class FabEffect (CR 8.5.48) — no label-driven
  // play-procedure path needed. ENG/MST cards declare {type:"transcend"}.
  appendCrankIntentGroup(process, procedure, currentObject);
  const committed = executeFabEventJournalTransaction(state, procedure.eventGroups, options);
  if (
    !committed.committed &&
    ("suspendedForReplacementOrder" in committed || "suspendedForContinuousOrder" in committed)
  ) {
    return advanced(committed.state);
  }
  if (!committed.committed)
    return failure(
      state,
      `The play procedure failed atomically at ${committed.failedEventGroupId}.`,
      "play_journal_failed",
    );
  return advanced(committed.state);
}

/**
 * CR 8.3.32 Scrap: optional additional cost — banish ONE chosen item or
 * equipment from the player's graveyard.  The banish event carries the zone
 * movement and records the scrapped card via the `scrappedCard` binding.
 */

/**
 * CR 8.3.33 Beat Chest: optional additional cost — discard a card with 6 or
 * more power from hand.  The discard event carries the zone movement and the
 * `beat-chest` event records the player as having beaten chest this turn.
 */

/**
 * CR 8.3.29 Crank: record the play-time choice to crank the permanent. The
 * choice persists on the player (`pendingCrankInstanceIds`) and is consumed
 * when the permanent actually enters the arena, which can happen in a later
 * transaction than the play journal itself.
 */
