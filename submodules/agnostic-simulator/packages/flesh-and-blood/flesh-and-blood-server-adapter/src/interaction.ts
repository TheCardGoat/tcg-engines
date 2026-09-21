import { fabControlActionId } from "./interaction-controls.ts";
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type EntityRef,
  type InteractionAction,
  type InteractionIntent,
  type InteractionSubmission,
} from "@tcg/protocol";
import {
  FabMatchRuntime,
  type FabDecision,
  type FabDecisionAnswer,
} from "@tcg/flesh-and-blood-engine/runtime";
import {
  listLegalCommands,
  listDefenderCandidates,
  type FabLegalCommand,
} from "@tcg/flesh-and-blood-engine/legal-commands";

export interface FabInteractionProjection {
  readonly view: EngineInteractionView;
  readonly commandByActionId: ReadonlyMap<string, FabLegalCommand>;
  readonly attackTargetCommandsByActionId: ReadonlyMap<
    string,
    ReadonlyMap<string, FabLegalCommand>
  >;
}

function stableCommandValueKey(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableCommandValueKey).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableCommandValueKey(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? String(value);
}

function attackTargetGroupKey(command: FabLegalCommand): string | null {
  if (
    (command.move !== "begin-play" && command.move !== "activate") ||
    typeof command.payload.target !== "string"
  ) {
    return null;
  }
  const { target: _target, ...declaration } = command.payload;
  return `${command.move}:${command.sourceInstanceId ?? ""}:${stableCommandValueKey(declaration)}`;
}

function attackTargetEntity(runtime: FabMatchRuntime, targetId: string): EntityRef {
  const state = runtime.getState();
  return state.playerIds.some((playerId) => playerId === targetId)
    ? { kind: "player", instanceId: targetId }
    : decisionCandidateEntity(runtime, targetId);
}

export type FabOptionalTriggerAutomationTargetMode = "ask" | "auto-accept" | "auto-decline";

function optionalTriggerAutomationActionId(command: FabLegalCommand): string | null {
  if (command.move !== "set-optional-trigger-automation" || !command.sourceInstanceId) return null;
  const mode = command.payload.mode;
  if (mode !== "ask" && mode !== "auto-accept" && mode !== "auto-decline") return null;
  return `fab:optional-trigger:${encodeURIComponent(command.sourceInstanceId)}:${mode}`;
}

function opponentTriggerYieldActionId(command: FabLegalCommand): string | null {
  if (command.move !== "set-automation-preferences") return null;
  const add = command.payload.addOpponentTriggerYieldCardId;
  const remove = command.payload.removeOpponentTriggerYieldCardId;
  if (typeof add === "string") return `fab:opponent-trigger-yield:${encodeURIComponent(add)}:add`;
  if (typeof remove === "string")
    return `fab:opponent-trigger-yield:${encodeURIComponent(remove)}:remove`;
  return null;
}

/**
 * Stable ids for the one-shot scoped auto-pass arm/disarm controls. Disarm is
 * scope-agnostic because a seat holds at most one scope at a time.
 */
function scopedAutoPassActionId(command: FabLegalCommand): string | null {
  if (command.move !== "set-automation-preferences") return null;
  const arm = command.payload.armScopedAutoPass;
  if (arm === "combat" || arm === "opponent-turn") return `fab:scoped-auto-pass:${arm}:arm`;
  if (command.payload.disarmScopedAutoPass === true) return "fab:scoped-auto-pass:disarm";
  return null;
}

/** Decode the adapter-owned scoped auto-pass action id; labels stay presentation text. */
export function fabScopedAutoPassActionIdentity(action: InteractionAction):
  | { readonly scope: "combat" | "opponent-turn"; readonly operation: "arm" }
  | {
      readonly operation: "disarm";
    }
  | null {
  if (action.id === "fab:scoped-auto-pass:disarm") return { operation: "disarm" };
  const match = /^fab:scoped-auto-pass:(combat|opponent-turn):arm$/.exec(action.id);
  if (!match) return null;
  return { scope: match[1] as "combat" | "opponent-turn", operation: "arm" };
}

export function fabOpponentTriggerYieldActionIdentity(
  action: InteractionAction,
): { readonly canonicalId: string; readonly operation: "add" | "remove" } | null {
  const match = /^fab:opponent-trigger-yield:([^:]+):(add|remove)$/.exec(action.id);
  if (!match) return null;
  try {
    return {
      canonicalId: decodeURIComponent(match[1]!),
      operation: match[2] as "add" | "remove",
    };
  } catch {
    return null;
  }
}

/** Decode only the adapter-owned stable action id; labels remain presentation text. */
export function fabOptionalTriggerAutomationTargetMode(
  action: InteractionAction,
): FabOptionalTriggerAutomationTargetMode | null {
  const suffix = action.id.split(":").at(-1);
  return suffix === "ask" || suffix === "auto-accept" || suffix === "auto-decline" ? suffix : null;
}

/**
 * Diagnostics for tests and benchmarks: how many full projections and
 * optional-follow-up previews (each a structuredClone + applyCommand on the
 * clone) have been computed process-wide.
 */
export const projectionComputeCounts = { project: 0, preview: 0 };

/**
 * Per-state projection memo.
 *
 * One interaction submit asks for the same (state, actor) projection several
 * times — validate, command resolution, and the per-actor interaction views —
 * and each projection re-runs `listLegalCommands` (and, on decision prompts,
 * the optional-follow-up preview: a structuredClone of the whole state plus an
 * applyCommand on the clone). Those enumerations dominate submit CPU.
 *
 * Commands are the only runtime mutator and finalize a monotonic
 * `stateID = beforeStateID + 1`, so an exact-stateID hit is always for the
 * identical state. The memo holds at most one entry per actor per state and
 * dies with its runtime instance.
 */
interface FabProjectionMemo {
  readonly stateID: number;
  readonly byActor: Map<string, FabInteractionProjection>;
  readonly optionalFollowUpPreviews: Map<string, FabDecision | null>;
}

const projectionMemos = new WeakMap<FabMatchRuntime, FabProjectionMemo>();

function projectionMemo(runtime: FabMatchRuntime): FabProjectionMemo {
  const stateID = runtime.getStateID();
  const cached = projectionMemos.get(runtime);
  if (cached && cached.stateID === stateID) return cached;
  const fresh: FabProjectionMemo = {
    stateID,
    byActor: new Map(),
    optionalFollowUpPreviews: new Map(),
  };
  projectionMemos.set(runtime, fresh);
  return fresh;
}

/**
 * Memoized {@link projectFabInteraction}. Use this on hot paths (submission
 * validation, command resolution, per-actor interaction views); the uncached
 * export stays for tests that want to observe a fresh computation.
 */
export function projectFabInteractionCached(
  runtime: FabMatchRuntime,
  actorId: string,
): FabInteractionProjection {
  const memo = projectionMemo(runtime);
  let projection = memo.byActor.get(actorId);
  if (!projection) {
    projection = projectFabInteraction(runtime, actorId);
    memo.byActor.set(actorId, projection);
  }
  return projection;
}

/**
 * Memoized {@link previewOptionalFollowUp}. The preview is deterministic for
 * a given decision and only cheap to recompute by cloning the entire state,
 * so both the projection and command-resolution paths share one computation.
 */
function previewOptionalFollowUpCached(
  runtime: FabMatchRuntime,
  decision: FabDecision,
): FabDecision | null {
  const memo = projectionMemo(runtime);
  let preview = memo.optionalFollowUpPreviews.get(decision.decisionId);
  if (preview === undefined) {
    preview = previewOptionalFollowUp(runtime, decision);
    memo.optionalFollowUpPreviews.set(decision.decisionId, preview);
  }
  return preview;
}

/** Viewer-scoped projection; legality is probed by the authoritative runtime. */
export function projectFabInteraction(
  runtime: FabMatchRuntime,
  actorId: string,
): FabInteractionProjection {
  projectionComputeCounts.project += 1;
  const wait = runtime.waitState();
  if (wait.kind === "decision") {
    return projectDecision(runtime, actorId, wait.decision);
  }
  const stateVersion = runtime.getStateID();
  const commands = runtime.hasGameEnded()
    ? []
    : listLegalCommands(runtime, actorId, { includeConcede: true, maxDefendSetSize: 1 });
  const actions: InteractionAction[] = [];
  const commandByActionId = new Map<string, FabLegalCommand>();
  const attackTargetCommandsByActionId = new Map<string, ReadonlyMap<string, FabLegalCommand>>();
  const attackTargetGroups = new Map<string, FabLegalCommand[]>();

  for (const command of commands) {
    const key = attackTargetGroupKey(command);
    if (!key) continue;
    const group = attackTargetGroups.get(key) ?? [];
    group.push(command);
    attackTargetGroups.set(key, group);
  }

  commands.forEach((command, commandIndex) => {
    if (command.move === "defend") return;
    const controlId = fabControlActionId(command);
    const sources = controlId ? [] : sourceCardIds(command);
    const actionSources = sources.length > 0 ? sources : [null];
    actionSources.forEach((sourceId, sourceIndex) => {
      const attackTargetKey = attackTargetGroupKey(command);
      const attackTargetGroup = attackTargetKey
        ? attackTargetGroups.get(attackTargetKey)
        : undefined;
      if (attackTargetGroup && attackTargetGroup.length > 1) {
        if (command !== attackTargetGroup[0] || !sourceId) return;
        const id = `fab:attack-target:${commandIndex}:${sourceIndex}`;
        const commandsByTarget = new Map(
          attackTargetGroup.flatMap((candidate) =>
            typeof candidate.payload.target === "string"
              ? [[candidate.payload.target, candidate] as const]
              : [],
          ),
        );
        const sourceObject = runtime.getState().objects[sourceId];
        const sourceName = sourceObject
          ? runtime.getState().cardDefinitions[sourceObject.canonicalId]?.base.names[0]
          : undefined;
        actions.push({
          id,
          requestId: `fab:${stateVersion}`,
          intent: command.move === "begin-play" ? "play-card" : "activate",
          text: { key: `Choose an attack target for: ${sourceName ?? "this attack"}` },
          enabled: true,
          source: { kind: "card", instanceId: sourceId },
          inputs: [
            {
              id: "attackTarget",
              kind: "entity-selection",
              role: "target",
              text: { key: "Select a highlighted attack target on the board." },
              entityKinds: ["card", "player"],
              min: 1,
              max: 1,
              ordered: false,
              candidates: [...commandsByTarget.keys()].map((targetId) => ({
                entity: attackTargetEntity(runtime, targetId),
                enabled: true,
              })),
            },
          ],
        });
        attackTargetCommandsByActionId.set(id, commandsByTarget);
        return;
      }
      const id =
        controlId ??
        optionalTriggerAutomationActionId(command) ??
        opponentTriggerYieldActionId(command) ??
        scopedAutoPassActionId(command) ??
        `fab:${commandIndex}:${sourceIndex}`;
      actions.push({
        id,
        requestId: `fab:${stateVersion}`,
        intent: intentForMove(command.move),
        text: { key: command.label },
        enabled: true,
        ...(sourceId ? { source: { kind: "card" as const, instanceId: sourceId } } : {}),
        inputs: [],
      });
      commandByActionId.set(id, command);
    });
  });

  if (runtime.enumerateMoves(actorId).includes("defend")) {
    const candidateIds = listDefenderCandidates(runtime, actorId);
    actions.push({
      id: "fab:control:defend",
      requestId: `fab:${stateVersion}`,
      intent: "choose-targets",
      text: { key: "Declare defense" },
      enabled: true,
      inputs: [
        {
          id: "defenders",
          kind: "entity-selection",
          role: "defender",
          text: { key: "Choose defending cards" },
          entityKinds: ["card"],
          min: 0,
          max: candidateIds.length,
          ordered: false,
          candidates: candidateIds.map((instanceId) => ({
            entity: { kind: "card", instanceId },
            enabled: true,
          })),
        },
      ],
    });
  }

  return {
    view: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId,
      stateVersion,
      status: runtime.hasGameEnded() ? "game-over" : actions.length > 0 ? "ready" : "waiting",
      actions,
    },
    commandByActionId,
    attackTargetCommandsByActionId,
  };
}

function projectDecision(
  runtime: FabMatchRuntime,
  viewerId: string,
  decision: FabDecision,
): FabInteractionProjection {
  const isActor = viewerId === decision.actorId;
  const actionId = `fab:decision:${decision.decisionId}`;
  const requestId = `${actionId}:${decision.stateVersion}`;
  const optionalFollowUp = isActor ? previewOptionalFollowUpCached(runtime, decision) : null;
  const presentedDecision = optionalFollowUp ?? decision;
  const presentedStepText =
    presentedDecision.kind === "effect-resolution" &&
    presentedDecision.presentation?.kind === "card-name"
      ? presentedDecision.presentation.description
      : presentedDecision.kind === "option" && presentedDecision.presentation?.kind === "direct"
        ? presentedDecision.presentation.description
        : presentedDecision.label;
  const presentedStepInteractionText =
    presentedDecision.kind === "option" && presentedDecision.presentation?.kind === "direct"
      ? { key: "fab.prompt.directOption", params: { label: presentedStepText } }
      : { key: presentedStepText };
  const input = decisionInput(runtime, decision, optionalFollowUp ? "optional" : "answer");
  const followUpInput = optionalFollowUp
    ? decisionInput(runtime, optionalFollowUp, "answer", "optional")
    : null;
  const action: InteractionAction = {
    id: actionId,
    requestId,
    intent: decisionIntent(presentedDecision),
    text: { key: presentedDecision.label },
    enabled: true,
    inputs: [input, ...(followUpInput ? [followUpInput] : [])],
  };
  const cancelAction: InteractionAction | null =
    decision.kind === "payment" && decision.cancellable
      ? {
          id: `fab:decision-cancel:${decision.decisionId}`,
          requestId,
          intent: "undo",
          text: { key: "Cancel play" },
          enabled: true,
          inputs: [],
        }
      : null;
  // One enumeration serves both the concede lookup and the automation
  // controls: `includeConcede` only appends the concede command, everything
  // else is option-independent.
  const decisionCommands = listLegalCommands(runtime, viewerId, { includeConcede: true });
  const concedeCommand = decisionCommands.find((command) => command.move === "concede");
  const concedeAction: InteractionAction | null = concedeCommand
    ? {
        id: "fab:concede",
        requestId: `fab:${runtime.getStateID()}`,
        intent: "concede",
        text: { key: concedeCommand.label },
        enabled: true,
        inputs: [],
      }
    : null;
  const automationCommands = isActor
    ? decisionCommands.filter(
        (command) =>
          command.move === "set-optional-trigger-automation" ||
          command.move === "set-automation-preferences",
      )
    : [];
  const automationEntries = automationCommands.map((command, index) => {
    const id =
      optionalTriggerAutomationActionId(command) ??
      opponentTriggerYieldActionId(command) ??
      `fab:decision-preference:${index}`;
    return {
      command,
      action: {
        id,
        requestId: `fab:${runtime.getStateID()}`,
        intent: "custom",
        text: { key: command.label },
        enabled: true,
        ...(command.sourceInstanceId
          ? { source: { kind: "card", instanceId: command.sourceInstanceId } }
          : {}),
        inputs: [],
      } satisfies InteractionAction,
    };
  });
  const actions = [
    ...(isActor
      ? [
          action,
          ...automationEntries.map((entry) => entry.action),
          ...(cancelAction ? [cancelAction] : []),
        ]
      : []),
    ...(concedeAction ? [concedeAction] : []),
  ];
  const commandByActionId = new Map<string, FabLegalCommand>();
  if (concedeAction && concedeCommand) commandByActionId.set(concedeAction.id, concedeCommand);
  for (const entry of automationEntries) commandByActionId.set(entry.action.id, entry.command);

  return {
    view: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: viewerId,
      stateVersion: runtime.getStateID(),
      status: isActor ? "choosing" : "waiting",
      ...(isActor
        ? {
            resolution: {
              actingPlayerId: decision.actorId,
              pendingCount: 1,
              currentEffect: {
                id: decision.decisionId,
                text: { key: presentedDecision.label },
                ...(decision.source
                  ? {
                      source: {
                        kind: "card" as const,
                        instanceId: decision.source.instanceId,
                        ...(decision.source.canonicalId
                          ? { definitionId: decision.source.canonicalId }
                          : {}),
                        ownerId: decision.source.ownerId,
                      },
                    }
                  : {}),
              },
              currentStep: {
                index: 1,
                count: 1,
                text: presentedStepInteractionText,
                requirement: {
                  kind: requirementKind(presentedDecision),
                  text: presentedStepInteractionText,
                  required: decisionIsRequired(presentedDecision),
                  ...decisionBounds(presentedDecision),
                },
              },
            },
          }
        : {}),
      actions,
    },
    commandByActionId,
    attackTargetCommandsByActionId: new Map(),
  };
}

function decisionInput(
  runtime: FabMatchRuntime,
  decision: FabDecision,
  inputId = "answer",
  requiredWhenInputId?: string,
): InteractionAction["inputs"][number] {
  const common = {
    id: inputId,
    text:
      decision.kind === "option" && decision.presentation?.kind === "direct"
        ? { key: "fab.prompt.directOption", params: { label: decision.presentation.description } }
        : { key: decision.label },
    required: requiredWhenInputId ? false : decisionIsRequired(decision),
    ...(requiredWhenInputId
      ? {
          requiredWhen: [{ all: [{ inputId: requiredWhenInputId, value: true as const }] }],
        }
      : {}),
  } as const;
  switch (decision.kind) {
    case "boolean":
      return {
        ...common,
        kind: "boolean",
        trueText: { key: decision.acceptLabel },
        falseText: { key: decision.declineLabel },
      };
    case "option":
      return {
        ...common,
        kind: "option-selection",
        min: decision.min,
        max: decision.max,
        options: decision.options.map((option) => ({
          id: option.id,
          text: { key: option.label },
          enabled: true,
        })),
        ...(decision.presentation?.kind === "direct"
          ? {
              presentation: {
                kind: "direct" as const,
                emptyText: { key: decision.presentation.emptyLabel },
              },
            }
          : {}),
      };
    case "entity-target":
      return {
        ...common,
        kind: "entity-selection",
        role: "target",
        entityKinds: ["card"],
        min: decision.min,
        max: decision.max,
        ordered: false,
        candidates: decision.candidates.map((candidate) => ({
          entity: decisionCandidateEntity(runtime, candidate.instanceId),
          text: { key: candidate.label },
          enabled: true,
        })),
      };
    case "ordering": {
      const entityKind =
        decision.continuation.kind === "turn-pitch-order" ? ("card" as const) : ("effect" as const);
      return {
        ...common,
        kind: "ordering",
        entityKind,
        min: decision.entries.length,
        max: decision.entries.length,
        candidates: decision.entries.map((entry) => ({
          entity: {
            kind: entityKind,
            instanceId: entry.id,
            ...(entry.source
              ? {
                  ownerId: entry.source.ownerId,
                  ...(entry.source.canonicalId ? { definitionId: entry.source.canonicalId } : {}),
                }
              : {}),
          },
          text: { key: entry.label },
          enabled: true,
        })),
      };
    }
    case "numeric":
      return { ...common, kind: "number", min: decision.min, max: decision.max, step: 1 };
    case "partition":
      return {
        ...common,
        kind: "entity-partition",
        entityKind: "card",
        candidates: decision.entries.map((entry) => ({
          entity: {
            kind: "card",
            instanceId: entry.id,
            ...(entry.source
              ? {
                  ownerId: entry.source.ownerId,
                  ...(entry.source.canonicalId ? { definitionId: entry.source.canonicalId } : {}),
                }
              : {}),
          },
          text: { key: entry.label },
          enabled: true,
        })),
        routes: decision.groups.map((group) => ({
          id: group.id,
          text: { key: group.label },
          kind: "destination",
          ordered: group.ordered ?? false,
          ...(group.ordered ? { orderDirection: group.orderDirection } : {}),
          min: 0,
          max: decision.entries.length,
        })),
        assignment: "exhaustive",
      };
    case "group-choice":
      return {
        ...common,
        kind: "option-selection",
        min: decision.entries.length,
        max: decision.entries.length,
        options: decision.entries.map((entry) => ({
          id: entry.id,
          text: { key: entry.label },
          enabled: true,
        })),
      };
    case "payment":
      return {
        ...common,
        kind: "entity-selection",
        role: "cost",
        entityKinds: ["card"],
        min: 1,
        max: decision.oneAtATime ? 1 : decision.candidates.length,
        ordered: false,
        candidates: decision.candidates.map((candidate) => ({
          entity: { kind: "card", instanceId: candidate.instanceId },
          text: { key: `${candidate.value}` },
          enabled: true,
        })),
      };
    case "effect-resolution":
      return {
        ...common,
        ...(decision.presentation?.kind === "card-name"
          ? { text: { key: decision.presentation.description } }
          : {}),
        kind: "option-selection",
        min: 1,
        max: 1,
        options: decision.options.map((option) => ({
          id: option.id,
          text: { key: option.label },
          enabled: true,
        })),
        ...(decision.presentation?.kind === "card-name"
          ? {
              presentation: {
                kind: "search" as const,
                label: { key: decision.presentation.label },
                placeholder: { key: decision.presentation.placeholder },
                confirmLabel: { key: decision.presentation.confirmLabel },
                description: { key: decision.presentation.description },
                resultLimit: decision.presentation.resultLimit,
                suggestionGroups: decision.presentation.suggestionGroups.map((group) => ({
                  id: group.id,
                  text: { key: group.label },
                  optionIds: [...group.optionIds],
                })),
              },
            }
          : {}),
      };
  }
}

/**
 * Preview the first decision produced by accepting an optional effect. The
 * clone preserves the authoritative engine as the source of candidates and
 * bounds while keeping projection read-only.
 */
function previewOptionalFollowUp(
  runtime: FabMatchRuntime,
  decision: FabDecision,
): FabDecision | null {
  projectionComputeCounts.preview += 1;
  if (decision.kind !== "boolean" || decision.continuation.kind !== "optional-effect") return null;
  const preview = new FabMatchRuntime(structuredClone(runtime.getState()));
  const result = preview.applyCommand(
    decision.actorId,
    {
      move: "answer-decision",
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "boolean", value: true },
    },
    { commandId: `preview:${decision.decisionId}`, timestamp: 0 },
  );
  if (!result.success) return null;
  const wait = preview.waitState();
  // Resolving an optional can finish its layer and immediately expose another
  // trigger. Only combine choices belonging to the same resolution process;
  // otherwise the next trigger's text and answer replace this effect's prompt.
  return wait.kind === "decision" &&
    wait.decision.actorId === decision.actorId &&
    wait.decision.continuation.processId === decision.continuation.processId
    ? wait.decision
    : null;
}

function decisionCandidateEntity(runtime: FabMatchRuntime, instanceId: string): EntityRef {
  const state = runtime.getState();
  const object = state.objects[instanceId];
  if (!object) return { kind: "card" as const, instanceId };
  const ownerZones = state.containers.zonesByPlayerId[object.ownerId];
  const zone = ownerZones
    ? Object.entries(ownerZones).find(([, ids]) => ids.includes(instanceId))?.[0]
    : undefined;
  return {
    kind: "card" as const,
    instanceId,
    definitionId: object.canonicalId,
    ownerId: object.ownerId,
    ...(zone ? { zoneId: `${object.ownerId}:${zone}` } : {}),
  };
}

function decisionIsRequired(decision: FabDecision): boolean {
  switch (decision.kind) {
    case "option":
    case "entity-target":
      return decision.min > 0;
    case "numeric":
      return decision.requiresExplicitAnswer === true || decision.min > 0;
    // FAB boolean decisions are created through createFabOptionalDecision:
    // the player must answer the prompt, but either branch represents whether
    // to use an optional effect or cost. Project that rules meaning instead of
    // describing the response control itself as mandatory.
    case "boolean":
      return false;
    case "ordering":
    case "partition":
    case "group-choice":
    case "payment":
    case "effect-resolution":
      return true;
  }
}

function decisionIntent(decision: FabDecision): InteractionIntent {
  switch (decision.kind) {
    case "boolean":
    case "option":
    case "numeric":
    case "effect-resolution":
      return "choose-option";
    case "entity-target":
      return "choose-targets";
    case "ordering":
      return "order-cards";
    case "partition":
      return "move-card";
    case "payment":
      return "resource-card";
    case "group-choice":
      return "choose-option";
  }
}

function requirementKind(
  decision: FabDecision,
): NonNullable<EngineInteractionView["resolution"]>["currentStep"]["requirement"] extends infer R
  ? R extends { kind: infer K }
    ? K
    : never
  : never {
  switch (decision.kind) {
    case "boolean":
      return "boolean";
    case "option":
    case "effect-resolution":
      return "option-selection";
    case "entity-target":
    case "payment":
      return "entity-selection";
    case "ordering":
      return "ordering";
    case "numeric":
      return "number";
    case "partition":
      return "entity-partition";
    case "group-choice":
      return "option-selection";
  }
}

function decisionBounds(decision: FabDecision): { min?: number; max?: number } {
  switch (decision.kind) {
    case "option":
    case "entity-target":
      return { min: decision.min, max: decision.max };
    case "ordering":
      return { min: decision.entries.length, max: decision.entries.length };
    case "numeric":
      return { min: decision.min, max: decision.max };
    case "payment":
      return { min: 1, max: decision.oneAtATime ? 1 : decision.candidates.length };
    case "boolean":
    case "partition":
    case "effect-resolution":
    case "group-choice":
      return {};
  }
}

export function commandForFabSubmission(
  runtime: FabMatchRuntime,
  actorId: string,
  submission: InteractionSubmission,
): FabLegalCommand | null {
  if (
    submission.actionId === "fab:control:defend" &&
    runtime.enumerateMoves(actorId).includes("defend")
  ) {
    const instanceIds = stringList(submission.values.defenders);
    return instanceIds
      ? { move: "defend", payload: { instanceIds }, label: "Declare defense" }
      : null;
  }
  const projected = projectFabInteractionCached(runtime, actorId);
  const attackTargetCommands = projected.attackTargetCommandsByActionId.get(submission.actionId);
  if (attackTargetCommands) {
    const targetIds = stringList(submission.values.attackTarget);
    return targetIds?.length === 1 ? (attackTargetCommands.get(targetIds[0]!) ?? null) : null;
  }
  const wait = runtime.waitState();
  const decision = wait.kind === "decision" ? wait.decision : undefined;
  if (
    decision?.kind === "payment" &&
    decision.cancellable &&
    decision.actorId === actorId &&
    submission.actionId === `fab:decision-cancel:${decision.decisionId}`
  ) {
    return {
      move: "answer-decision",
      payload: {
        decisionId: decision.decisionId,
        stateVersion: submission.stateVersion,
        answer: { kind: "cancel" },
      },
      label: "Cancel play",
    };
  }
  if (
    decision &&
    decision.actorId === actorId &&
    submission.actionId === `fab:decision:${decision.decisionId}`
  ) {
    const optionalFollowUp = previewOptionalFollowUpCached(runtime, decision);
    const optionalValue = submission.values.optional;
    if (optionalFollowUp && decision.kind === "boolean" && typeof optionalValue === "boolean") {
      const followUpAnswer = optionalValue
        ? decisionAnswer(optionalFollowUp, submission.values.answer)
        : null;
      if (optionalValue && !followUpAnswer) return null;
      return {
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: submission.stateVersion,
          answer: { kind: "boolean", value: optionalValue },
          ...(followUpAnswer ? { followUpAnswers: [followUpAnswer] } : {}),
        },
        label: optionalValue ? optionalFollowUp.label : decision.declineLabel,
      };
    }
    const answer = decisionAnswer(decision, submission.values.answer);
    return answer
      ? {
          move: "answer-decision",
          payload: {
            decisionId: decision.decisionId,
            stateVersion: submission.stateVersion,
            answer,
          },
          label: decision.label,
        }
      : null;
  }
  return projected.commandByActionId.get(submission.actionId) ?? null;
}

function decisionAnswer(decision: FabDecision, value: unknown): FabDecisionAnswer | null {
  switch (decision.kind) {
    case "boolean":
      return typeof value === "boolean" ? { kind: "boolean", value } : null;
    case "option": {
      const optionIds = stringList(value);
      return optionIds ? { kind: "option", optionIds } : null;
    }
    case "entity-target": {
      const instanceIds = stringList(value);
      return instanceIds ? { kind: "entity-target", instanceIds } : null;
    }
    case "ordering": {
      const orderedIds = stringList(value);
      return orderedIds ? { kind: "ordering", orderedIds } : null;
    }
    case "numeric":
      return typeof value === "number" && Number.isFinite(value)
        ? { kind: "numeric", value }
        : null;
    case "partition":
      return isStringListRecord(value) ? { kind: "partition", groups: value } : null;
    case "payment": {
      const instanceIds = stringList(value);
      return instanceIds ? { kind: "payment", instanceIds } : null;
    }
    case "effect-resolution": {
      const optionIds = stringList(value);
      return optionIds?.length === 1
        ? { kind: "effect-resolution", optionId: optionIds[0]! }
        : null;
    }
    case "group-choice": {
      const optionIds = stringList(value);
      return optionIds
        ? { kind: "group-choice", selectedIds: optionIds, orderedRemainderIds: [] }
        : null;
    }
  }
}

function stringList(value: unknown): readonly string[] | null {
  if (typeof value === "string") return [value];
  return Array.isArray(value) && value.every((entry): entry is string => typeof entry === "string")
    ? value
    : null;
}

function isStringListRecord(value: unknown): value is Readonly<Record<string, readonly string[]>> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(
      (entries) => Array.isArray(entries) && entries.every((entry) => typeof entry === "string"),
    )
  );
}

function sourceCardIds(command: FabLegalCommand): readonly string[] {
  const ids = new Set<string>();
  if (command.sourceInstanceId) ids.add(command.sourceInstanceId);
  if (typeof command.payload.instanceId === "string") ids.add(command.payload.instanceId);
  if (Array.isArray(command.payload.instanceIds)) {
    for (const id of command.payload.instanceIds) if (typeof id === "string") ids.add(id);
  }
  return [...ids];
}

function intentForMove(move: FabLegalCommand["move"]): InteractionIntent {
  switch (move) {
    case "set-optional-trigger-automation":
    case "set-automation-preferences":
    case "arm-priority-hold":
      return "custom";
    case "begin-play":
      return "play-card";
    case "answer-decision":
      return "choose-option";
    case "activate":
      return "activate";
    case "defend":
      return "choose-targets";
    case "pass":
    case "end-turn":
      return "pass";
    case "concede":
      return "concede";
  }
}
