import type { FabKernelEventSink } from "./transaction-kernel.ts";
import {
  createFabLoopGuard,
  type FabCost,
  type FabSelectionCount,
  type FabEffect,
  type FabTarget,
} from "@tcg/flesh-and-blood-types";
import { declaredObjectTargetBounds } from "./declared-target-bounds.ts";
import type { FabMatchState } from "../state.ts";
import type { FabPendingTrigger } from "../rules/process.ts";
import type { CommittedEvent, FabProcessId, ProposedEvent } from "../rules/events.ts";
import { commitFabKernelBatch } from "./commit.ts";
import { nextFabDestinationRef } from "../rules/snapshots.ts";
import {
  createFabEntityTargetDecision,
  createFabOptionDecision,
  createFabOptionalDecision,
  createFabOrderingDecision,
} from "./decision-builders.ts";
import { publishFabDecision } from "./decision-state.ts";
import {
  isSameDeclaredTarget,
  sharedConditionalBranchTarget,
  type FabDeclaredTarget,
} from "../rules/conditional-targets.ts";
import type { FabTargetMap, FabTargetRef } from "../rules/targets.ts";
import type { FabPlayerLogFact } from "../player-log.ts";
import { fabDeclaredPlayerBindings } from "../rules/layers.ts";
import { distinctPrintedNameCount, targetRequiresDifferentNames } from "./different-names.ts";
import { transitionFabRulesProcessStage } from "./process-state.ts";

export type { FabDeclaredTarget } from "../rules/conditional-targets.ts";

export interface FabTargetCandidate {
  /** Card identity explicitly authorized for this decision's actor (for example search). */
  readonly source?: {
    readonly instanceId: string;
    readonly canonicalId?: string;
    readonly ownerId: string;
  };
  readonly instanceId: string;
  readonly label: string;
  /** Persisted exact target identity represented by the UI id. */
  readonly target: FabTargetRef;
  /** Compact printed-name key (`snatch`) for `differentNames` set checks. */
  readonly printedName?: string;
}

export interface FabDeclarationContext {
  readonly controllerId: string;
  readonly source: FabPendingTrigger["source"];
  readonly abilityId: string;
  /**
   * Optional layer/event bindings for filter evaluation (e.g. chosen X for
   * arcane-damage-effect-equal-to-x on Blaze Firemind).
   */
  readonly bindings?: import("../rules/events.ts").FabEventBindings;
  /** Persisted declaration answers owned by the resolving stack layer. */
  readonly declaredTargets?: FabTargetMap;
}

/** Resolves a variable selection count ("up to N", quantifiers) for one pending declaration. */
export interface FabAmountPort {
  readonly evaluateAmount: (
    state: Readonly<FabMatchState>,
    amount: FabSelectionCount,
    pending: FabDeclarationContext,
  ) => number | null;
}

/** Deterministic random selection, journaled as an event before use. */
export interface FabRandomPort {
  readonly randomIndex: (state: FabMatchState, maxExclusive: number) => number;
}

/** Legal entity candidates for one declaration target. */
export interface FabTargetingPort {
  readonly legalTargets: (
    state: Readonly<FabMatchState>,
    pending: FabDeclarationContext,
    target: FabDeclaredTarget,
  ) => readonly FabTargetCandidate[];
}

/** The declaration machinery's full port set — one named seam per capability. */
export interface FabTriggerDeclarationOptions
  extends FabKernelEventSink, FabAmountPort, FabRandomPort, FabTargetingPort {}

/** Advances pending trigger declarations until a decision or priority boundary. */
export function advanceTriggerDeclarations(
  state: FabMatchState,
  options: FabTriggerDeclarationOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (!process || process.stage !== "layer-declaration" || state.decision) return state;

  const declarationGuard = createFabLoopGuard({ label: "trigger-declaration: advance" });
  while (process.pendingTriggers.length > 0 && !state.decision) {
    declarationGuard.tick();
    const groupId = process.pendingTriggers[0]!.simultaneousGroupId;
    const group = process.pendingTriggers.filter(
      (pending) => pending.simultaneousGroupId === groupId,
    );
    const controllers = [...new Set(group.map((pending) => pending.controllerId))];
    if (controllers.length > 1 && process.triggerPlayerOrder.length === 0) {
      publishFabDecision(
        state,
        createFabOptionDecision(state, {
          actorId: state.activePlayerId,
          label: "Choose the first player to add simultaneous triggers.",
          min: 1,
          max: 1,
          options: controllers.map((controllerId) => ({ id: controllerId, label: controllerId })),
          continuation: { kind: "trigger-first-player", processId: process.processId },
        }),
      );
      transitionFabRulesProcessStage(process, "simultaneous-player-selection");
      break;
    }
    if (controllers.length === 1 && process.triggerPlayerOrder.length === 0) {
      process.triggerPlayerOrder = controllers;
    }
    const controllerAwaitingOrder = process.triggerPlayerOrder.find(
      (controllerId) =>
        controllers.includes(controllerId) &&
        !process.orderedTriggerControllers.includes(controllerId),
    );
    if (controllerAwaitingOrder) {
      const controlled = group.filter(
        (pending) => pending.controllerId === controllerAwaitingOrder,
      );
      if (controlled.length > 1) {
        publishFabDecision(
          state,
          createFabOrderingDecision(state, {
            actorId: controllerAwaitingOrder,
            label: "Order your simultaneous triggered abilities.",
            entries: controlled.map((pending) => ({
              id: pending.pendingTriggerId,
              label: `${pending.source.current.names.join(" // ") || pending.source.instanceId}: ${pending.abilityId}`,
              source: {
                instanceId: pending.source.instanceId,
                ...(pending.source.canonicalId ? { canonicalId: pending.source.canonicalId } : {}),
                ownerId: pending.source.ownerId,
              },
            })),
            continuation: {
              kind: "trigger-order",
              processId: process.processId,
              controllerId: controllerAwaitingOrder,
            },
          }),
        );
        transitionFabRulesProcessStage(process, "trigger-ordering");
        break;
      }
      if (controlled[0]) process.orderedTriggerIds.push(controlled[0].pendingTriggerId);
      process.orderedTriggerControllers.push(controllerAwaitingOrder);
      continue;
    }

    const pending = nextPendingTrigger(group, process.orderedTriggerIds);
    if (!pending) {
      process.triggerPlayerOrder = [];
      process.orderedTriggerControllers = [];
      process.orderedTriggerIds = [];
      continue;
    }
    if (pending.resolution.kind === "modal" && !pending.modesDeclared) {
      const modal = pending.resolution.ability;
      const rawChoose = modal.modal.choose;
      const chooseIsAll =
        typeof rawChoose === "object" && rawChoose !== null && rawChoose.type === "all";
      const chooseIsAnyNumber =
        typeof rawChoose === "object" && rawChoose !== null && rawChoose.type === "any-number";
      if (chooseIsAll) {
        replacePendingTrigger(process.pendingTriggers, pending.pendingTriggerId, {
          ...pending,
          declaredModes: modal.modes.map((mode) => mode.id),
          modesDeclared: true,
        });
        continue;
      }
      const choose = chooseIsAnyNumber
        ? modal.modes.length
        : options.evaluateAmount(state, rawChoose, pending);
      if (choose === null) {
        throw new Error(`Unsupported FAB modal choose amount for ${pending.abilityId}.`);
      }
      if (choose === 0) {
        replacePendingTrigger(process.pendingTriggers, pending.pendingTriggerId, {
          ...pending,
          declaredModes: [],
          modesDeclared: true,
        });
        continue;
      }
      if (modal.modal.random) {
        const available = [...modal.modes];
        const selected: string[] = [];
        const modalSelectionGuard = createFabLoopGuard({
          label: "trigger-declaration: random modal selection",
        });
        while (selected.length < choose && available.length > 0) {
          modalSelectionGuard.tick();
          const index = options.randomIndex(state, available.length);
          const [mode] = available.splice(index, 1);
          if (mode) selected.push(mode.id);
          if (modal.modal.allowRepeat && mode) available.push(mode);
        }
        replacePendingTrigger(process.pendingTriggers, pending.pendingTriggerId, {
          ...pending,
          declaredModes: selected,
          modesDeclared: true,
        });
        continue;
      }
      publishFabDecision(
        state,
        createFabOptionDecision(state, {
          actorId: pending.controllerId,
          label: `Choose mode${choose === 1 ? "" : "s"} for ${pending.source.current.names.join(" // ") || pending.abilityId}.`,
          min: chooseIsAnyNumber ? 0 : choose,
          max: choose,
          options: modal.modes.map((mode) => ({ id: mode.id, label: mode.text })),
          continuation: {
            kind: "layer-mode",
            processId: process.processId,
            pendingTriggerId: pending.pendingTriggerId,
          },
        }),
      );
      break;
    }

    const targetRequirement = targetRequirements(pending).find(
      (requirement) => !(requirement.key in pending.declaredTargets),
    );
    if (targetRequirement) {
      const { key, target } = targetRequirement;
      const candidates = options.legalTargets(state, pending, target);
      const bounds =
        target.selector === "any-hero"
          ? { count: 1, min: 1 }
          : declaredObjectTargetBounds(
              target,
              (amount) => options.evaluateAmount(state, amount, pending),
              targetRequirement.optionalEffectPath !== undefined,
              candidates.length,
            );
      if (bounds === null) {
        throw new Error(`Unsupported FAB target count for ${pending.abilityId} (${key}).`);
      }
      const minimum = bounds.min;
      const maximum = bounds.count;
      const namesUnsatisfiable =
        targetRequiresDifferentNames(target) && distinctPrintedNameCount(candidates) < minimum;
      if (minimum > 0 && (candidates.length < minimum || namesUnsatisfiable)) {
        process.pendingTriggers = process.pendingTriggers.filter(
          (candidate) => candidate.pendingTriggerId !== pending.pendingTriggerId,
        );
        continue;
      }
      // Sole remaining legal set is forced (same as play-time unique targets).
      if (minimum > 0 && candidates.length === minimum) {
        replacePendingTrigger(process.pendingTriggers, pending.pendingTriggerId, {
          ...pending,
          declaredTargets: {
            ...pending.declaredTargets,
            [key]: candidates.map((candidate) => candidate.target),
          },
        });
        continue;
      }
      publishFabDecision(
        state,
        createFabEntityTargetDecision(state, {
          actorId: pending.controllerId,
          label: `Choose targets for ${pending.source.current.names.join(" // ") || pending.abilityId}.`,
          requestedCount: maximum,
          upTo: minimum === 0,
          candidates,
          continuation: {
            kind: "layer-target",
            processId: process.processId,
            pendingTriggerId: pending.pendingTriggerId,
            targetKey: key,
          },
          differentNames: targetRequiresDifferentNames(target),
        }),
      );
      break;
    }

    const additionalCost = pendingTriggerAdditionalCost(pending);
    if (additionalCost && pending.additionalCostResolved !== true) {
      if (additionalCost.optional === true) {
        publishFabDecision(
          state,
          createFabOptionalDecision(state, {
            actorId: pending.controllerId,
            label: `Pay the additional cost for ${pending.source.current.names.join(" // ") || pending.abilityId}?`,
            acceptLabel: "Pay",
            declineLabel: "Decline",
            continuation: {
              kind: "trigger-additional-cost",
              processId: process.processId,
              pendingTriggerId: pending.pendingTriggerId,
            },
          }),
        );
        break;
      }
      if (!isSelfBanishTriggeredCost(additionalCost)) {
        process.pendingTriggers = process.pendingTriggers.filter(
          (candidate) => candidate.pendingTriggerId !== pending.pendingTriggerId,
        );
        continue;
      }
      replacePendingTrigger(process.pendingTriggers, pending.pendingTriggerId, {
        ...pending,
        additionalCostResolved: true,
      });
      continue;
    }

    const layer = {
      kind: "triggered",
      layerId: `layer-${state.counters.layer + 1}`,
      controllerId: pending.controllerId,
      source: pending.source,
      keywords: pending.layerKeywords,
      modes: pending.declaredModes,
      targets: pending.declaredTargets,
      abilityId: pending.abilityId,
      trigger: pending.trigger,
      abilityCondition: pending.abilityCondition,
      triggeringEvent: pending.triggeringEvent,
      bindings: {
        ...pending.bindings,
        ...fabDeclaredPlayerBindings(pending.declaredTargets),
      },
      resolution: pending.resolution,
      ...(pending.optionalTriggerAutomation
        ? { optionalTriggerAutomation: pending.optionalTriggerAutomation }
        : {}),
    } as const;
    const declared = commitFabKernelBatch(
      state,
      [
        {
          name: "declare-triggered-layer",
          processId: process.processId,
          cause: {
            kind: "effect",
            abilityId: pending.abilityId,
            source: pending.source,
            controllerId: pending.controllerId,
          },
          controllerId: pending.controllerId,
          source: pending.source,
          affected: [pending.source],
          bindings: {
            ...pending.bindings,
            ...fabDeclaredPlayerBindings(pending.declaredTargets),
          },
          data: { layer },
        },
      ],
      {
        onCommittedEvents: options.onCommittedEvents,
        onPlayerLogFacts: options.onPlayerLogFacts,
        onCommittedReceipt: options.onCommittedReceipt,
      },
    );
    if (!declared.batch)
      throw new Error(`FAB triggered layer ${layer.layerId} could not be declared.`);
    const preservedProcess = process;
    Object.assign(state, declared.state);
    state.rulesProcess = preservedProcess;
    preservedProcess.pendingTriggers = preservedProcess.pendingTriggers.filter(
      (candidate) => candidate.pendingTriggerId !== pending.pendingTriggerId,
    );
    const additionalCostEvents =
      additionalCost && pending.additionalCostResolved === true
        ? triggeredAdditionalCostEvents(state, pending, additionalCost, process.processId)
        : [];
    if (additionalCostEvents.length > 0) {
      const paid = commitFabKernelBatch(state, additionalCostEvents, {
        onCommittedEvents: options.onCommittedEvents,
        onPlayerLogFacts: options.onPlayerLogFacts,
        onCommittedReceipt: options.onCommittedReceipt,
      });
      if (paid.batch) {
        Object.assign(state, paid.state);
        state.rulesProcess = preservedProcess;
      }
    }
    if (
      !preservedProcess.pendingTriggers.some(
        (candidate) => candidate.simultaneousGroupId === groupId,
      )
    ) {
      preservedProcess.triggerPlayerOrder = [];
      preservedProcess.orderedTriggerControllers = [];
      preservedProcess.orderedTriggerIds = [];
    }
  }

  const finalProcess = state.rulesProcess;
  if (finalProcess?.pendingTriggers.length === 0 && !state.decision) {
    transitionFabRulesProcessStage(finalProcess, "state-trigger-scan");
  }
  return state;
}

function nextPendingTrigger(
  pending: readonly FabPendingTrigger[],
  orderedIds: readonly string[],
): FabPendingTrigger | undefined {
  if (orderedIds.length === 0) return pending[0];
  const id = orderedIds.find((orderedId) =>
    pending.some((candidate) => candidate.pendingTriggerId === orderedId),
  );
  return id ? pending.find((candidate) => candidate.pendingTriggerId === id) : pending[0];
}

function targetRequirements(pending: FabPendingTrigger): readonly FabDeclaredTargetRequirement[] {
  const resolution = pending.resolution;
  const effects =
    resolution.kind === "effect"
      ? [resolution.effect]
      : [
          ...(resolution.ability.effect ? [resolution.ability.effect] : []),
          ...pending.declaredModes.flatMap((modeId) => {
            const mode = resolution.ability.modes.find((candidate) => candidate.id === modeId);
            return mode ? [mode.effect] : [];
          }),
        ];
  return effects.flatMap((effect, index) => collectDeclaredTargets(effect, `effect-${index}`));
}

export function collectDeclaredTargets(
  effect: FabEffect,
  path: string,
  skipDirectTarget?: FabDeclaredTarget,
  optionalEffectPath?: string,
): readonly FabDeclaredTargetRequirement[] {
  const targets: FabDeclaredTargetRequirement[] = [];
  if (
    "target" in effect &&
    isDeclaredTarget(effect.target) &&
    !isSameDeclaredTarget(effect.target, skipDirectTarget)
  ) {
    targets.push({ key: `${path}:target`, target: effect.target, optionalEffectPath });
  }
  if (effect.type === "transform-into-resolving-card" && effect.additionalTargets) {
    effect.additionalTargets.forEach((target, index) => {
      if (isDeclaredTarget(target)) {
        targets.push({
          key: `${path}:additional-target-${index}`,
          target,
          optionalEffectPath,
        });
      }
    });
  }
  const directTarget = "target" in effect ? effect.target : undefined;
  if (
    typeof directTarget === "object" &&
    directTarget !== null &&
    "selector" in directTarget &&
    directTarget.selector === "object" &&
    directTarget.playerTarget &&
    isDeclaredTarget(directTarget.playerTarget)
  ) {
    targets.push({
      key: `${path}:player${directTarget.playerTargetBinding ? `@${directTarget.playerTargetBinding}` : ""}`,
      target: directTarget.playerTarget,
      optionalEffectPath,
    });
  }
  if (effect.type === "conditional") {
    const sharedTarget = sharedConditionalBranchTarget(effect);
    if (sharedTarget) {
      targets.push(
        ...collectDeclaredTargets(effect.then, `${path}:then`, undefined, optionalEffectPath),
      );
      if (effect.else)
        targets.push(
          ...collectDeclaredTargets(effect.else, `${path}:else`, sharedTarget, optionalEffectPath),
        );
      return targets;
    }
  }
  // Yoji-style prevention: "another target hero" is declared on the prevention's
  // `shielded` field (on-stack object), not `target`.
  if (effect.type === "prevention" && effect.shielded && isDeclaredTarget(effect.shielded)) {
    targets.push({ key: `${path}:target`, target: effect.shielded, optionalEffectPath });
  }
  if (effect.type === "prevention" && effect.source && isDeclaredTarget(effect.source)) {
    targets.push({ key: `${path}:source`, target: effect.source, optionalEffectPath });
  }
  if (effect.type === "play-card" && isDeclaredTarget(effect.source)) {
    targets.push({ key: `${path}:target`, target: effect.source, optionalEffectPath });
  }
  // Danger Digits / Throw Dagger / Flick Knives: "target dagger … deals 1
  // damage" declares the damage *source* on-stack, not the damage target
  // (defending-hero / attack-target is automatic).
  if (effect.type === "deal-damage" && effect.source && isDeclaredTarget(effect.source)) {
    targets.push({ key: `${path}:source`, target: effect.source, optionalEffectPath });
  }
  // Stasis Cell (CR 6.2.2a): a rule-modification restricts a CHOSEN subject
  // ("target equipment") declared on `effect.subject` as an on-stack object
  // target — not `effect.target` (the string attack-target enum). Collect it
  // under the standard target key so the on-stack declaration is elicited and
  // later resolved by objectTargets when the continuous rule latches its
  // subject. A bare FabCardFilter subject (blanket restriction) is not a
  // declared target and is skipped here.
  if (
    effect.type === "rule-modification" &&
    typeof effect.subject === "object" &&
    effect.subject !== null &&
    isDeclaredTarget(effect.subject) &&
    !isSameDeclaredTarget(effect.subject, skipDirectTarget)
  ) {
    targets.push({ key: `${path}:target`, target: effect.subject, optionalEffectPath });
  }
  // CR 1.8.5 / 6.6.6a: an on-stack target in an "If you do" continuation is
  // still a parameter of the triggered layer being generated. The optional
  // cost is chosen later at resolution, but its mandatory continuation target
  // must already be declared (Suraya).
  if ("then" in effect && effect.then) {
    targets.push(
      ...collectDeclaredTargets(effect.then, `${path}:then`, undefined, optionalEffectPath),
    );
  }
  if ("else" in effect && effect.else) {
    targets.push(
      ...collectDeclaredTargets(effect.else, `${path}:else`, undefined, optionalEffectPath),
    );
  }
  // CR 1.8.5 / 1.8.5e: optional targeted effects declare zero-or-targets at
  // the same time as every other target parameter. Selecting zero is the
  // optional choice; there is no later boolean-then-target sequence.
  if (effect.type === "optional") {
    targets.push(...collectDeclaredTargets(effect.effect, `${path}:effect`, undefined, path));
  } else if ("effect" in effect) {
    // A delayed trigger's body belongs to the future triggered layer, not the
    // layer that registers it. Trigger matching will collect that body when
    // the delayed trigger itself is put on the stack.
    targets.push(
      ...collectDeclaredTargets(effect.effect, `${path}:effect`, undefined, optionalEffectPath),
    );
  }
  if ("steps" in effect) {
    effect.steps.forEach((step, index) =>
      targets.push(
        ...collectDeclaredTargets(step, `${path}:step-${index}`, undefined, optionalEffectPath),
      ),
    );
  }
  if (effect.type === "choice") {
    effect.options.forEach((option, index) =>
      targets.push(
        ...collectDeclaredTargets(option, `${path}:option-${index}`, undefined, optionalEffectPath),
      ),
    );
  }
  return targets;
}

/** Automatic exact targets that must exist when an activated layer is quoted.
 * They require no player decision, but fail closed when their live game object
 * is absent (for example, `this-attack` outside an open chain link). */
export function collectAutomaticTargets(effect: FabEffect): readonly FabTarget[] {
  const targets: FabTarget[] = [];
  if (effect.type === "choose-card" && effect.target.selector === "this-attack") {
    targets.push(effect.target);
  }
  if ("then" in effect && effect.then) targets.push(...collectAutomaticTargets(effect.then));
  if ("else" in effect && effect.else) targets.push(...collectAutomaticTargets(effect.else));
  if ("effect" in effect) {
    targets.push(...collectAutomaticTargets(effect.effect));
  }
  if ("steps" in effect) {
    for (const step of effect.steps) targets.push(...collectAutomaticTargets(step));
  }
  if (effect.type === "choice") {
    for (const option of effect.options) targets.push(...collectAutomaticTargets(option));
  }
  return targets;
}

export interface FabDeclaredTargetRequirement {
  readonly key: string;
  readonly target: FabDeclaredTarget;
  /** Effect-tree path of the optional whose target declaration is its may-choice. */
  readonly optionalEffectPath?: string;
}

function isDeclaredTarget(value: unknown): value is FabDeclaredTarget {
  return (
    typeof value === "object" &&
    value !== null &&
    "selector" in value &&
    (value.selector === "any-hero" ||
      (value.selector === "object" && "declared" in value && value.declared === "on-stack"))
  );
}

function replacePendingTrigger(
  pendingTriggers: FabPendingTrigger[],
  pendingTriggerId: string,
  replacement: FabPendingTrigger,
): void {
  const index = pendingTriggers.findIndex(
    (pending) => pending.pendingTriggerId === pendingTriggerId,
  );
  if (index !== -1) pendingTriggers[index] = replacement;
}

function pendingTriggerAdditionalCost(pending: FabPendingTrigger): FabCost | undefined {
  const ability = pending.source.current.abilities.find(
    (candidate) => candidate.id === pending.abilityId,
  );
  if (!ability || ability.kind !== "static" || ability.staticKind !== "triggered") {
    return undefined;
  }
  return ability.additionalCost;
}

function isSelfBanishTriggeredCost(cost: FabCost): boolean {
  if (cost.class !== "effect") return false;
  if (cost.type === "banish-self") return true;
  return cost.type === "banish" && cost.from === "graveyard" && cost.count === 1;
}

function triggeredAdditionalCostEvents(
  state: FabMatchState,
  pending: FabPendingTrigger,
  cost: FabCost,
  processId: FabProcessId,
): ProposedEvent[] {
  if (!isSelfBanishTriggeredCost(cost)) return [];
  if (pending.source.zoneRef.zone !== "graveyard") return [];
  return [
    {
      name: "banish",
      processId,
      cause: {
        kind: "effect",
        abilityId: pending.abilityId,
        source: pending.source,
        controllerId: pending.controllerId,
      },
      controllerId: pending.controllerId,
      source: pending.source,
      affected: [pending.source],
      bindings: {},
      data: {
        object: pending.source,
        destinationRef: nextFabDestinationRef(state, pending.source),
        from: "graveyard",
        to: "banished",
        reason: "banish",
      },
    },
  ];
}

export type { FabKernelEventSink } from "./transaction-kernel.ts";
