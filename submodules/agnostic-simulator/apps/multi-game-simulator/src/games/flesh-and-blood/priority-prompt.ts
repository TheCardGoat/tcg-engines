import type { FabPresentationState } from "./state";

interface PriorityPrompt {
  readonly title: string;
  readonly body: string;
  readonly details?: string;
  readonly submitLabel: string;
}

/** Explain an existing stop; never decide whether priority should be held or passed. */
export function deriveFabPriorityPrompt(
  state: Pick<
    FabPresentationState,
    "terminal" | "priorityPlayerId" | "phase" | "priorityWindow" | "combat" | "activePlayerId"
  >,
  viewerId: string,
  pendingLayer: { readonly title: string } | undefined,
  passOnly: boolean,
): PriorityPrompt | undefined {
  if (state.terminal || state.priorityPlayerId !== viewerId || state.phase !== "action") {
    return undefined;
  }
  switch (state.priorityWindow?.kind) {
    case "none":
    case "decision":
    case "defense-declaration":
      return undefined;
  }

  const step = state.combat?.open ? state.combat.step : undefined;
  const response = passOnly
    ? "You have no available responses. Pass priority to continue."
    : step === "reaction"
      ? "Play or activate an available reaction or Instant, or pass priority."
      : "Play or activate an available Instant, or pass priority.";
  const pass = (title: string, details?: string): PriorityPrompt => ({
    title,
    body: response,
    details,
    submitLabel: "Pass priority",
  });

  // A pending layer must resolve before an empty-stack step can advance.
  if (pendingLayer) {
    return pass(
      `Before ${pendingLayer.title} resolves`,
      `Pending: ${pendingLayer.title}. Both players must pass in succession for this layer to resolve.`,
    );
  }
  switch (step) {
    case "layer":
      return pass("Before the attack resolves");
    case "attack":
      return pass("Before declaring defenders");
    case "defend":
      return pass(
        "Defenders declared",
        "The Reaction Step begins after both players pass in succession.",
      );
    case "reaction":
      return pass("Before combat damage");
    case "damage":
      return pass(
        "After combat damage",
        "Combat damage has been calculated. The chain link has not yet resolved.",
      );
    case "resolution":
      if (state.priorityWindow?.kind === "combat-chain-continuation") {
        return {
          title: "Resolution step",
          body: "Play another attack or an available Instant, or pass to close the combat chain.",
          details:
            "The combat chain closes after both players pass in succession with nothing pending.",
          submitLabel: "Close combat chain",
        };
      }
      return pass(
        "Before the combat chain closes",
        "The combat chain closes after both players pass in succession with nothing pending.",
      );
    case "close":
      return undefined;
    case undefined:
      // Idle turn-player Action Phase already exposes legal plays and Pass.
      // Keep the overlay for the non-turn player's empty-stack response window.
      if (state.activePlayerId === viewerId) return undefined;
      return pass(
        "Before the action phase ends",
        "The end phase begins after both players pass in succession with nothing pending.",
      );
  }
}
