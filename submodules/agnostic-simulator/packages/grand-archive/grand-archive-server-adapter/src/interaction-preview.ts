import {
  grandArchivePaymentInputs,
  readGrandArchivePaymentDraft,
} from "./ability-payment-preview.ts";
import {
  INTERACTION_PROTOCOL_VERSION,
  InteractionPreviewRequest,
  type EntityCandidate,
  type EngineInteractionView,
  type InteractionAction,
  type InteractionInput,
  type InteractionPreviewResult,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import {
  previewGrandArchiveTriggerAnnouncement,
  listGrandArchiveAbilityActivationOrigins,
  previewGrandArchiveAbilityActivation,
  type GrandArchiveCommand,
  type GrandArchiveAbilityActivationPreview,
  projectGrandArchiveViewerState,
  type GrandArchiveMatchRuntime,
  type GrandArchiveTriggerAnnouncement,
  type GrandArchiveTriggerAnnouncementPreview,
} from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId, grandArchiveTargetId } from "@tcg/grand-archive-engine/runtime";

type AbilityCommand = Extract<GrandArchiveCommand, { move: "activate-ability" }>;
type ReadyPreview = Extract<
  GrandArchiveTriggerAnnouncementPreview | GrandArchiveAbilityActivationPreview,
  { status: "ready" }
>;

export function grandArchiveAbilityActionId(command: AbilityCommand): string {
  return `grand-archive:ability:${JSON.stringify([command.sourceId ?? null, command.masteryName ?? null, command.abilityId])}`;
}
export interface GrandArchiveInteractionPreview {
  readonly result: InteractionPreviewResult;
  readonly command?: ReadyPreview["command"];
}

export const GRAND_ARCHIVE_PREVIEW_REQUEST_PREFIX = "grand-archive:preview:";

/** No draft is retained: every request and final submission is recomputed against current state. */
export function previewGrandArchiveInteraction(
  runtime: GrandArchiveMatchRuntime,
  actorId: string,
  request: InteractionPreviewRequest,
): GrandArchiveInteractionPreview {
  const stateVersion = runtime.state.stateVersion;
  const unavailable = (message: string): GrandArchiveInteractionPreview => ({
    result: { status: "unavailable", stateVersion, message },
  });
  const parsed = InteractionPreviewRequest.safeParse(request);
  if (!parsed.success) return unavailable("Invalid interaction preview request.");
  if (request.stateVersion !== stateVersion)
    return unavailable("The match changed; refresh the declaration.");
  const decision = runtime.state.decision;
  const origin = request.actionId.startsWith("grand-archive:ability:")
    ? listGrandArchiveAbilityActivationOrigins(
        runtime.program,
        runtime.state,
        grandArchivePlayerId(actorId),
      ).find((entry) => grandArchiveAbilityActionId(entry.command) === request.actionId)
    : undefined;
  if (
    !origin &&
    (decision?.kind !== "announce-triggered-ability" ||
      decision.playerId !== actorId ||
      request.actionId !== `grand-archive:decision:${decision.id}`)
  ) {
    return unavailable("This player has no matching trigger announcement.");
  }

  const variables: Partial<Record<"X" | "Y" | "Z", number>> = {};
  const targets: Record<string, ReturnType<typeof grandArchiveTargetId>[]> = {};
  let modeIds: string[] | undefined;
  for (const [id, value] of Object.entries(request.values)) {
    if (id === "modes") {
      if (!Array.isArray(value)) return unavailable("Modes must be a list of identifiers.");
      modeIds = value;
    } else if (id.startsWith("variable:")) {
      const symbol = id.slice("variable:".length);
      if ((symbol !== "X" && symbol !== "Y" && symbol !== "Z") || typeof value !== "number")
        return unavailable("Invalid chosen variable.");
      variables[symbol] = value;
    } else if (id.startsWith("target:")) {
      if (!Array.isArray(value) || value.some((id) => !id.trim()))
        return unavailable("Targets must be a list of identifiers.");
      targets[id.slice("target:".length)] = value.map(grandArchiveTargetId);
    } else if (!(origin && id.startsWith("payment:")))
      return unavailable("Unknown declaration input.");
  }
  const draft: GrandArchiveTriggerAnnouncement = {
    variables,
    targets,
    ...(modeIds ? { modeIds } : {}),
  };
  let preview: GrandArchiveTriggerAnnouncementPreview | GrandArchiveAbilityActivationPreview;
  try {
    if (origin) {
      preview = previewGrandArchiveAbilityActivation(runtime.program, runtime.state, {
        playerId: grandArchivePlayerId(actorId),
        expectedStateVersion: stateVersion,
        command: { ...origin.command, ...draft, ...readGrandArchivePaymentDraft(request.values) },
      });
    } else {
      if (decision?.kind !== "announce-triggered-ability")
        return unavailable("No matching trigger announcement.");
      preview = previewGrandArchiveTriggerAnnouncement(runtime.program, runtime.state, {
        playerId: grandArchivePlayerId(actorId),
        decisionId: decision.id,
        expectedStateVersion: stateVersion,
        draft,
      });
    }
  } catch (error) {
    if (error instanceof Error && error.constructor === Error) return unavailable(error.message);
    throw error;
  }
  if (preview.status === "unavailable") return unavailable(preview.message);

  // Never enrich native candidate identities from full match objects. The viewer projection
  // owns identity/face authorization, including private zones and face-down objects.
  const viewer = projectGrandArchiveViewerState(
    runtime.program,
    runtime.state,
    grandArchivePlayerId(actorId),
  );
  const candidates = new Map<string, EntityCandidate>();
  for (const player of viewer.players) {
    candidates.set(player.id, {
      entity: { kind: "player", instanceId: player.id, ownerId: player.id },
      text: { key: player.name },
      enabled: true,
    });
    for (const zone of Object.values(player.zones)) {
      for (const object of zone.visibility === "visible" ? zone.objects : zone.revealedObjects) {
        candidates.set(object.id, {
          entity: {
            kind: "card",
            instanceId: object.id,
            definitionId: object.activeDefinitionId ?? object.definitionId,
            ownerId: object.ownerId,
            zoneId: object.zone,
          },
          text: { key: object.name },
          enabled: true,
        });
      }
    }
  }
  for (const item of viewer.stack) {
    candidates.set(item.id, {
      entity: { kind: "effect", instanceId: item.id },
      text: { key: item.presentation?.name ?? "Stack item" },
      enabled: true,
    });
  }

  const inputs: InteractionInput[] = [];
  const values: Record<string, InteractionSubmissionValue> = {};
  let message = "message" in preview ? preview.message : undefined;
  for (const step of preview.steps) {
    if (step.error) message = step.error;
    if (step.value !== undefined)
      values[step.id] = typeof step.value === "number" ? step.value : [...step.value];
    if (step.kind === "number") {
      inputs.push({
        id: step.id,
        kind: "number",
        text: { key: `Choose ${step.symbol}.` },
        required: true,
        min: step.minimum,
        ...(step.maximum !== undefined ? { max: step.maximum } : {}),
        step: 1,
      });
    } else if (step.kind === "modes") {
      if (step.allowRepeated)
        return unavailable("Repeated mode declarations need a repeated-choice form.");
      if (!step.options.length)
        return unavailable("This mode declaration has no selectable options.");
      const maximum = Math.min(step.maximum ?? step.options.length, step.options.length);
      if (step.minimum > maximum)
        return unavailable("This mode declaration has too few eligible options.");
      inputs.push({
        id: step.id,
        kind: "option-selection",
        text: { key: "Choose modes." },
        required: step.minimum > 0,
        min: step.minimum,
        max: maximum,
        options: step.options.map((option) => ({
          id: option.id,
          text: { key: option.text },
          enabled: true,
        })),
      });
    } else {
      if (step.allowRepeated && (step.maximum === undefined || step.maximum > 1))
        return unavailable("Repeated target declarations need a repeated-choice form.");
      const eligible: EntityCandidate[] = [];
      for (const id of step.candidateIds) {
        const candidate = candidates.get(id);
        if (!candidate)
          return unavailable("This declaration requires a private selection context.");
        eligible.push(candidate);
      }
      const maximum = Math.min(step.maximum ?? eligible.length, eligible.length);
      inputs.push({
        id: step.id,
        kind: "entity-selection",
        role: "target",
        text: { key: `Choose ${step.binding.replaceAll("-", " ")}.` },
        required: step.minimum > 0,
        min: step.minimum,
        max: maximum,
        ordered: step.ordered,
        entityKinds: eligible.length
          ? [...new Set(eligible.map((candidate) => candidate.entity.kind))]
          : ["card"],
        candidates: eligible,
      });
    }
  }
  if ("paymentSteps" in preview) {
    try {
      inputs.push(...grandArchivePaymentInputs(preview.paymentSteps, candidates));
    } catch (error) {
      if (error instanceof Error && error.constructor === Error) return unavailable(error.message);
      throw error;
    }
    for (const step of preview.paymentSteps) {
      const value = request.values[step.id];
      if (value !== undefined) values[step.id] = value;
    }
  }
  const activeIds = new Set(inputs.map((input) => input.id));
  const ignoredInputIds = [
    ...new Set([
      ...preview.ignoredInputIds,
      ...Object.keys(request.values).filter((id) => !activeIds.has(id)),
    ]),
  ];
  const action: InteractionAction = {
    id: request.actionId,
    requestId: `${GRAND_ARCHIVE_PREVIEW_REQUEST_PREFIX}${stateVersion}:${origin ? request.actionId : decision!.id}`,
    intent: origin ? "activate" : "choose-targets",
    text: { key: origin?.label ?? "Announce triggered ability" },
    ...(origin?.command.sourceId && candidates.get(origin.command.sourceId)
      ? { source: candidates.get(origin.command.sourceId)!.entity }
      : {}),
    enabled: true,
    requiresPreview: true,
    inputs,
  };
  return {
    result: {
      status: preview.status,
      stateVersion,
      action,
      values,
      ignoredInputIds,
      ...(message ? { message } : {}),
    },
    ...(preview.status === "ready" ? { command: preview.command } : {}),
  };
}

export function grandArchivePreviewView(
  actorId: string,
  result: Exclude<InteractionPreviewResult, { status: "unavailable" }>,
): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "grand-archive" as const,
    actorId,
    stateVersion: result.stateVersion,
    status: "choosing" as const,
    actions: [result.action],
  };
}
