import type { DonPaymentCommand, MatchState } from "../types.ts";
import { createChoicePrompt } from "../state.ts";
import { getInstance } from "../shared.ts";
import { donIdentitiesAt, donIdentityLabel, requiresDonIdentityChoice } from "./don-state.ts";

export function validCommandDonSelection(
  state: MatchState,
  seat: "south" | "north",
  amount: number,
  selected: string[],
): boolean {
  const active = donIdentitiesAt(state, { seat, area: "active" });
  return (
    selected.length === amount &&
    new Set(selected).size === amount &&
    selected.every((id) => active.includes(id))
  );
}

/** Pause before payment; callers retain all normal legality and completion logic. */
export function requestCommandDonPayment(
  state: MatchState,
  command: DonPaymentCommand,
  amount: number,
  objectId: string,
  selected?: string[],
): "ready" | "prompt" | "invalid" {
  if (selected && state.donIdentities)
    return validCommandDonSelection(state, command.seat, amount, selected) ? "ready" : "invalid";
  const candidates = donIdentitiesAt(state, { seat: command.seat, area: "active" });
  if (!state.donIdentities) return "ready";
  if (amount > candidates.length) return "invalid";
  if (!requiresDonIdentityChoice(state, candidates, amount)) return "ready";
  const source = getInstance(state, objectId);
  createChoicePrompt(state, {
    choiceKind: "costPayment",
    details: "Select the exact active DON!! cards to move.",
    seat: command.seat,
    label:
      command.type === "attachDon"
        ? "Choose the active DON!! to give."
        : "Choose the active DON!! to rest for this cost.",
    sourceCardId: source.cardId,
    sourceInstanceId: objectId,
    eventId: state.battle?.id ?? null,
    options: candidates.map((id) => ({
      id,
      label: donIdentityLabel(state, id),
      value: id,
      targetId: id,
    })),
    minSelections: amount,
    maxSelections: amount,
    context: {},
    resolutionContext: {
      intent: "commandDonPayment",
      controller: command.seat,
      command,
      amount,
      candidateIds: candidates,
      objectId,
      objectGeneration: source.zoneChangeCounter,
      ...(command.type === "resolvePrompt" ? { battleId: state.battle?.id } : {}),
    },
  });
  return "prompt";
}
