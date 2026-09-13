import { EngineInteractionView } from "@tcg/protocol";
import type { EngineInteractionView as InteractionView } from "@tcg/protocol";

export type HostedInteractionState =
  | { kind: "terminal" | "spectating"; view: null }
  | { kind: "ready"; view: InteractionView }
  | { kind: "resync"; view: null };

/** Missing actions are authoritative for terminal games and non-playing viewers. */
export function resolveHostedInteraction(input: {
  terminal: boolean;
  viewerId: string | null;
  version: number;
  interaction: unknown;
}): HostedInteractionState {
  if (input.terminal) return { kind: "terminal", view: null };
  if (!input.viewerId) return { kind: "spectating", view: null };
  const parsed = EngineInteractionView.safeParse(input.interaction);
  return parsed.success &&
    parsed.data.actorId === input.viewerId &&
    parsed.data.stateVersion === input.version
    ? { kind: "ready", view: parsed.data }
    : { kind: "resync", view: null };
}

export type HostedSubmissionOutcome = { kind: "submitted" } | { kind: "blocked"; reason: string };
