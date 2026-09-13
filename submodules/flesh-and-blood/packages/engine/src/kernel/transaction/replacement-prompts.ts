import type { FabMatchState } from "../../state.ts";
import type { FabProcessId, ProposedEvent } from "../../rules/events.ts";
import type { FabDecisionContinuation, FabReplacementCandidate } from "../../rules/process.ts";
import {
  collectApplicableReplacementCandidates,
  persistedReplacementConsequenceTargetIds,
} from "../replacements/index.ts";
import { transitionFabRulesProcessStage } from "../process-state.ts";

/**
 * The replacement checkpoint is shared by ordinary transactions and atomic
 * journals. A caller supplies the persisted continuation variant; this keeps
 * ordering prompt construction and exact-permutation validation in one place.
 */
export function suspendForReplacementOrdering(
  state: FabMatchState,
  candidates: ReturnType<typeof collectApplicableReplacementCandidates>,
  controllerId: string,
  replacementKind: FabReplacementCandidate["replacementKind"],
  continuation:
    | {
        readonly kind: "replacement-order";
        readonly processId: FabProcessId;
        readonly controllerId: string;
        readonly replacementKind: FabReplacementCandidate["replacementKind"];
      }
    | {
        readonly kind: "journal-replacement-order";
        readonly processId: FabProcessId;
        readonly eventGroupId: string;
        readonly controllerId: string;
        readonly replacementKind: FabReplacementCandidate["replacementKind"];
        readonly sequencePrefix?: import("../../rules/process.ts").FabRulesProcess["sequencePrefixContinuation"];
      },
): void {
  const process = state.rulesProcess;
  if (!process) throw new Error("FAB replacement ordering has no persisted rules process.");
  process.replacementCandidates = [...candidates];
  transitionFabRulesProcessStage(process, "replacement-ordering");
  state.counters.decision += 1;
  state.decision = {
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    actorId: controllerId,
    kind: "ordering",
    label: `Order your applicable ${replacementKind} replacement effects.`,
    entries: candidates.map((candidate) => ({
      id: candidate.replacementId,
      label: `${candidate.source.current.names.join(" // ") || candidate.source.instanceId}: ${candidate.effect.type}`,
    })),
    continuation,
  };
}

export function suspendForReplacementConsequenceTarget(
  state: FabMatchState,
  candidates: readonly FabReplacementCandidate[],
  candidate: FabReplacementCandidate,
  continuation: Extract<
    import("../../rules/process.ts").FabDecisionContinuation,
    { readonly kind: "replacement-consequence-target" }
  >,
): void {
  const process = state.rulesProcess;
  if (!process) throw new Error("FAB replacement consequence has no persisted rules process.");
  const targetIds = persistedReplacementConsequenceTargetIds(state, candidate);
  if (targetIds.length === 0) throw new Error("The replacement consequence has no legal target.");
  process.replacementCandidates = [...candidates];
  transitionFabRulesProcessStage(process, "replacement-ordering");
  state.counters.decision += 1;
  state.decision = {
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    actorId: candidate.controllerId,
    kind: "entity-target",
    label:
      candidate.effect.type === "replacement" && candidate.effect.modification.type === "win-clash"
        ? "Choose which hero wins the clash."
        : "Choose one of the cards revealed by the replaced clash.",
    min: 1,
    max: 1,
    candidates: targetIds.map((instanceId) => ({
      instanceId,
      label: instanceId,
      target: {
        kind: "object" as const,
        ref: { instanceId, incarnation: state.objects[instanceId]!.incarnation },
      },
    })),
    continuation,
  };
}

export function suspendForReplacementFirstPlayer(
  state: FabMatchState,
  candidates: readonly FabReplacementCandidate[],
  controllerIds: readonly string[],
  continuation: Extract<
    import("../../rules/process.ts").FabDecisionContinuation,
    { readonly kind: "replacement-first-player" }
  >,
): void {
  const process = state.rulesProcess;
  if (!process) throw new Error("FAB replacement player selection has no persisted process.");
  process.replacementCandidates = [...candidates];
  transitionFabRulesProcessStage(process, "replacement-ordering");
  state.counters.decision += 1;
  state.decision = {
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    actorId: state.activePlayerId,
    kind: "option",
    label: "Choose the first player to apply replacement effects.",
    min: 1,
    max: 1,
    options: controllerIds.map((playerId) => ({ id: playerId, label: playerId })),
    continuation,
  };
}

export function suspendForOptionalReplacements(
  state: FabMatchState,
  candidates: ReturnType<typeof collectApplicableReplacementCandidates>,
  playerId: string,
  events: readonly ProposedEvent[],
  continuation: Extract<
    import("../../rules/process.ts").FabDecisionContinuation,
    { readonly kind: "replacement-player" }
  >,
): void {
  const process = state.rulesProcess;
  if (!process) throw new Error("FAB optional replacement has no persisted rules process.");
  process.replacementCandidates = [...candidates];
  transitionFabRulesProcessStage(process, "replacement-ordering");
  state.counters.decision += 1;
  const playerCandidates = candidates.filter(
    (candidate) => candidate.optional && candidate.controllerId === playerId,
  );
  const singletonCandidate = playerCandidates.length === 1 ? playerCandidates[0] : undefined;
  const directArcaneBarrierAmount =
    singletonCandidate?.effect.type === "prevention" &&
    singletonCandidate.staticPreventionApplication?.kind === "static-keyword" &&
    singletonCandidate.staticPreventionApplication.keyword === "arcane-barrier" &&
    typeof singletonCandidate.effect.amount === "number"
      ? singletonCandidate.effect.amount
      : undefined;
  const directArcaneBarrier =
    directArcaneBarrierAmount !== undefined ? singletonCandidate : undefined;
  const incomingArcaneDamage = events.find(
    (event): event is ProposedEvent<"deal-damage"> =>
      event.name === "deal-damage" &&
      event.data.damageType === "arcane" &&
      "kind" in event.data.target &&
      event.data.target.kind === "hero" &&
      event.data.target.playerId === playerId,
  );
  const directTakeDamage =
    directArcaneBarrierAmount !== undefined && incomingArcaneDamage
      ? Math.max(0, incomingArcaneDamage.data.amount - directArcaneBarrierAmount)
      : undefined;
  const directPresentation =
    directArcaneBarrier && incomingArcaneDamage
      ? {
          kind: "direct" as const,
          description: `${incomingArcaneDamage.data.source?.current.names[0] ?? "This effect"} would deal ${incomingArcaneDamage.data.amount} arcane damage.`,
          emptyLabel: `Take ${incomingArcaneDamage.data.amount} arcane damage`,
        }
      : undefined;
  state.decision = {
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    actorId: playerId,
    kind: "option",
    label: directPresentation
      ? "Prevent incoming arcane damage?"
      : "Choose which optional replacement and prevention effects to apply.",
    min: 0,
    max: playerCandidates.length,
    options: playerCandidates.map((candidate) => ({
      id: candidate.replacementId,
      label:
        directPresentation &&
        candidate === directArcaneBarrier &&
        candidate.effect.type === "prevention" &&
        typeof candidate.effect.amount === "number"
          ? `${candidate.source.current.names[0] ?? candidate.source.instanceId} · Pay ${candidate.effect.amount} ${candidate.effect.amount === 1 ? "resource" : "resources"} · Prevent ${candidate.effect.amount} · Take ${directTakeDamage}`
          : `${candidate.source.current.names.join(" // ") || candidate.source.instanceId}: ${candidate.effect.type}`,
    })),
    ...(directPresentation ? { presentation: directPresentation } : {}),
    continuation,
  };
}
