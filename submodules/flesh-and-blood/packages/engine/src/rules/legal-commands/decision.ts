import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabRulesView } from "../rules-view.ts";
import type { FabDecisionAnswer } from "../process.ts";
import { validateAnswer } from "../../procedures/decisions/helpers.ts";
import { evaluatedObject, shortId, type FabLegalCommand } from "./shared.ts";
import {
  MAX_DECISION_CANDIDATES,
  orderingCandidates,
  partitionCandidates,
  selectionCandidates,
} from "./decision-selections.ts";

/** Enumerate decision alternatives before a policy scores them, not only after a failed answer. */
export function instantiateAnswerDecisionLegalCommands(context: {
  readonly state: FabRulesSnapshot;
  readonly view: FabRulesView;
  readonly actorId: string;
  readonly push: (command: FabLegalCommand) => void;
}): void {
  const { state, view, actorId, push } = context;
  const decision = state.decision;
  if (!decision || decision.actorId !== actorId) return;
  // Keep explicit effect options, including every card-name choice. Only
  // combinatorial expansion needs sampling; a catalog suffix must not vanish.
  const limit =
    decision.kind === "effect-resolution" ? decision.options.length : MAX_DECISION_CANDIDATES;
  const seen = new Set<string>();
  const answer = (value: FabDecisionAnswer, label: string): void => {
    if (seen.size >= limit || validateAnswer(decision, value)) return;
    const key = JSON.stringify(value);
    if (seen.has(key)) return;
    seen.add(key);
    push({
      move: "answer-decision",
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: value,
      },
      label,
    });
  };
  switch (decision.kind) {
    case "payment":
      for (const ids of selectionCandidates(
        decision.candidates.map((candidate) => candidate.instanceId),
        1,
        decision.oneAtATime ? 1 : decision.candidates.length,
      )) {
        const name = ids
          .map((id) => evaluatedObject(state, view, id)?.current.names.join(" // ") || shortId(id))
          .join(" + ");
        answer({ kind: "payment", instanceIds: ids }, `Pitch ${name}`);
      }
      if (decision.cancellable) {
        answer({ kind: "cancel" }, "Cancel play");
      }
      break;
    case "ordering":
      for (const orderedIds of orderingCandidates(decision.entries.map((entry) => entry.id))) {
        answer({ kind: "ordering", orderedIds }, decision.label);
      }
      break;
    case "boolean":
      answer({ kind: "boolean", value: true }, decision.acceptLabel);
      answer({ kind: "boolean", value: false }, decision.declineLabel);
      break;
    case "option":
      for (const optionIds of selectionCandidates(
        decision.options.map((option) => option.id),
        decision.min,
        decision.max,
      )) {
        const labels = optionIds.map(
          (id) => decision.options.find((option) => option.id === id)!.label,
        );
        answer(
          { kind: "option", optionIds },
          labels.length > 0 ? `${decision.label}: ${labels.join("; ")}` : decision.label,
        );
      }
      break;
    case "entity-target": {
      const emit = (instanceIds: readonly string[], label: string): void => {
        if (instanceIds.length < decision.min || instanceIds.length > decision.max) return;
        answer({ kind: "entity-target", instanceIds: [...instanceIds] }, label);
      };
      for (const ids of selectionCandidates(
        decision.candidates.map((candidate) => candidate.instanceId),
        decision.min,
        decision.max,
      )) {
        const names = ids.map(
          (id) => evaluatedObject(state, view, id)?.current.names.join(" // ") || shortId(id),
        );
        emit(ids, names.length ? `Choose ${names.join(" + ")}` : decision.label);
      }
      break;
    }
    case "numeric":
      answer({ kind: "numeric", value: decision.min }, decision.label);
      answer({ kind: "numeric", value: decision.max }, `${decision.label}: ${decision.max}`);
      for (
        let value = decision.min + 1;
        value < decision.max && value < decision.min + MAX_DECISION_CANDIDATES - 1;
        value++
      ) {
        answer({ kind: "numeric", value }, `${decision.label}: ${value}`);
      }
      break;
    case "partition":
      for (const groups of partitionCandidates(
        decision.entries.map((entry) => entry.id),
        decision.groups.map((group) => group.id),
      )) {
        answer({ kind: "partition", groups }, decision.label);
      }
      break;
    case "effect-resolution": {
      for (const option of decision.options)
        answer({ kind: "effect-resolution", optionId: option.id }, option.label);
      break;
    }
    case "group-choice": {
      const ids = decision.entries.map((entry) => entry.id);
      for (const cohort of decision.cohorts) {
        if (seen.size >= limit) break;
        for (const selectedIds of selectionCandidates(cohort.entryIds, 1, cohort.entryIds.length)) {
          if (seen.size >= limit) break;
          const remainder = ids.filter((id) => !selectedIds.includes(id));
          for (const orderedRemainderIds of orderingCandidates(remainder)) {
            if (seen.size >= limit) break;
            answer({ kind: "group-choice", selectedIds, orderedRemainderIds }, cohort.label);
          }
        }
      }
      break;
    }
    default: {
      const exhaustive: never = decision;
      return exhaustive;
    }
  }
}
