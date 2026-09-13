import type { FabMatchState } from "../../state.ts";
import type { FabDecision, FabDecisionAnswer, FabPendingTrigger } from "../../rules/process.ts";
import type { FabTargetRef } from "../../rules/targets.ts";
import type { FabDecisionSubmitResult } from "./types.ts";
import { differentNamesSelectionError } from "../../kernel/different-names.ts";

export function validateAnswer(decision: FabDecision, answer: FabDecisionAnswer): string | null {
  if (answer.kind === "cancel") {
    return decision.kind === "payment" && decision.cancellable
      ? null
      : "This FAB decision cannot be cancelled.";
  }
  if (decision.kind !== answer.kind) return `Expected a ${decision.kind} FAB decision answer.`;
  switch (decision.kind) {
    case "boolean":
      return null;
    case "option": {
      const optionIds = answer.kind === "option" ? answer.optionIds : [];
      const selected = new Set(optionIds);
      if (selected.size !== optionIds.length) return "Choose every option at most once.";
      if (selected.size < decision.min || selected.size > decision.max)
        return "Choose the required number of options.";
      return [...selected].every((id) => decision.options.some((option) => option.id === id))
        ? null
        : "Choose only legal options.";
    }
    case "entity-target": {
      const selected = new Set(answer.kind === "entity-target" ? answer.instanceIds : []);
      if (selected.size < decision.min || selected.size > decision.max)
        return "Choose the required number of targets.";
      if (
        ![...selected].every((id) =>
          decision.candidates.some((candidate) => candidate.instanceId === id),
        )
      ) {
        return "Choose only legal targets.";
      }
      if (decision.differentNames && answer.kind === "entity-target") {
        return differentNamesSelectionError(decision.candidates, answer.instanceIds);
      }
      return null;
    }
    case "ordering": {
      const ordered = answer.kind === "ordering" ? answer.orderedIds : [];
      return sameMembers(
        ordered,
        decision.entries.map((entry) => entry.id),
      )
        ? null
        : "Order every entry exactly once.";
    }
    case "group-choice": {
      if (answer.kind !== "group-choice") return "Submit a group-choice answer.";
      const selected = [...new Set(answer.selectedIds)];
      if (selected.length === 0) return "Choose at least one entry.";
      if (selected.length !== answer.selectedIds.length) return "Choose every entry at most once.";
      const cohort = decision.cohorts.find((candidate) =>
        selected.every((id) => candidate.entryIds.includes(id)),
      );
      if (!cohort) return "Every chosen entry must have the same name.";
      const selectedSet = new Set(selected);
      const expectedRemainder = decision.entries
        .map((entry) => entry.id)
        .filter((id) => !selectedSet.has(id));
      return sameMembers(answer.orderedRemainderIds, expectedRemainder)
        ? null
        : "Order every unchosen entry exactly once.";
    }
    case "numeric":
      return answer.kind === "numeric" &&
        Number.isInteger(answer.value) &&
        answer.value >= decision.min &&
        answer.value <= decision.max
        ? null
        : "Choose a number within the legal range.";
    case "partition": {
      if (answer.kind !== "partition") return "Submit a partition answer.";
      const legalGroups = new Set(decision.groups.map((group) => group.id));
      if (Object.keys(answer.groups).some((groupId) => !legalGroups.has(groupId)))
        return "Use only legal partition groups.";
      const assigned = Object.values(answer.groups).flat();
      return sameMembers(
        assigned,
        decision.entries.map((entry) => entry.id),
      )
        ? null
        : "Assign every partition entry exactly once.";
    }
    case "payment": {
      if (answer.kind !== "payment") return "Submit a payment answer.";
      const selected = new Set(answer.instanceIds);
      if (
        ![...selected].every((id) =>
          decision.candidates.some((candidate) => candidate.instanceId === id),
        )
      ) {
        return "Use only legal payment cards.";
      }
      if (decision.oneAtATime) {
        return selected.size === 1 ? null : "Pitch exactly one card at a time.";
      }
      const paid = decision.candidates
        .filter((candidate) => selected.has(candidate.instanceId))
        .reduce((total, candidate) => total + candidate.value, 0);
      return paid >= decision.amount ? null : "The selected cards do not satisfy the payment.";
    }
    case "effect-resolution":
      return answer.kind === "effect-resolution" &&
        decision.options.some((option) => option.id === answer.optionId)
        ? null
        : "Choose a legal effect-resolution option.";
  }
}

export function requireAnswer<Kind extends FabDecisionAnswer["kind"]>(
  answer: FabDecisionAnswer,
  kind: Kind,
): Extract<FabDecisionAnswer, { readonly kind: Kind }> {
  if (answer.kind !== kind)
    throw new Error(`FAB decision answer invariant failed: expected ${kind}.`);
  return answer as Extract<FabDecisionAnswer, { readonly kind: Kind }>;
}

export function declaredTargetsFromDecision(
  decision: Extract<FabDecision, { readonly kind: "entity-target" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "entity-target" }>,
): readonly FabTargetRef[] {
  return answer.instanceIds.map((instanceId) => {
    const candidate = decision.candidates.find(
      (legalCandidate) => legalCandidate.instanceId === instanceId,
    );
    if (!candidate) {
      throw new Error(`FAB target decision invariant failed: unknown target ${instanceId}.`);
    }
    return candidate.target;
  });
}

export function appliedDecision(state: FabMatchState): FabDecisionSubmitResult {
  return { accepted: true, state, outcome: { kind: "applied" } };
}

export function replacePending(
  pending: FabPendingTrigger[],
  pendingTriggerId: string,
  update: (pending: FabPendingTrigger) => FabPendingTrigger,
): void {
  const index = pending.findIndex((candidate) => candidate.pendingTriggerId === pendingTriggerId);
  if (index === -1) throw new Error(`Missing pending FAB trigger ${pendingTriggerId}.`);
  pending[index] = update(pending[index]!);
}

export function clockwisePlayers(state: FabMatchState, firstPlayerId: string): string[] {
  const start = state.playerIds.findIndex((playerId) => playerId === firstPlayerId);
  if (start === -1) throw new Error(`Unknown FAB trigger-order player ${firstPlayerId}.`);
  return state.playerIds.map(
    (_, offset) => state.playerIds[(start + offset) % state.playerIds.length]!,
  );
}

export function sameMembers(actual: readonly string[], expected: readonly string[]): boolean {
  return (
    actual.length === expected.length &&
    new Set(actual).size === actual.length &&
    actual.every((value) => expected.includes(value))
  );
}

export function failure(error: string, errorCode: string): FabDecisionSubmitResult {
  return { accepted: false, error, errorCode };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function stringArray(value: unknown): readonly string[] | null {
  return Array.isArray(value) && value.every((entry): entry is string => typeof entry === "string")
    ? value
    : null;
}
