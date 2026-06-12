import type { CardInstanceId, PlayerId } from "@tcg/lorcana-types";
import type { ResolutionExecutionOptions } from "@tcg/lorcana-engine";

import type { Interaction, PlayerInteractionView } from "../types/player-interaction-view";

export type SimulatedClickTarget =
  | { kind: "card"; cardId: CardInstanceId }
  | { kind: "player"; playerId: PlayerId }
  | { kind: "choice"; index: number }
  | { kind: "accept-optional" }
  | { kind: "decline-optional" }
  | { kind: "decline-target-prompt" }
  | { kind: "name-card"; namedCard: string }
  | { kind: "scry-place"; cardId: CardInstanceId; destinationId: string }
  | { kind: "submit" }
  | { kind: "cancel" };

export type SimulatedClickResult =
  | { ok: true; payload: ResolutionExecutionOptions; matched: Interaction | "submit" | "cancel" }
  | { ok: false; reason: "no-active-prompt" | "not-chooser" | "no-match" | "not-submittable" };

/**
 * Pure helper: given a view and a target, return the engine submission
 * payload the renderer would dispatch. Used by `*.interaction.test.ts`
 * suites to simulate the click → engine round trip without a DOM.
 */
export function simulateClick(
  view: PlayerInteractionView,
  target: SimulatedClickTarget,
): SimulatedClickResult {
  if (!view.activePrompt) {
    return { ok: false, reason: "no-active-prompt" };
  }
  if (view.viewerRole !== "chooser") {
    return { ok: false, reason: "not-chooser" };
  }

  if (target.kind === "submit") {
    if (!view.submission.canSubmit || !view.submission.submitPayload) {
      return { ok: false, reason: "not-submittable" };
    }
    return { ok: true, payload: view.submission.submitPayload, matched: "submit" };
  }

  if (target.kind === "cancel") {
    if (!view.submission.canCancel || !view.submission.cancelPayload) {
      return { ok: false, reason: "not-submittable" };
    }
    return { ok: true, payload: view.submission.cancelPayload, matched: "cancel" };
  }

  const interaction = matchInteraction(view.interactions, target);
  if (!interaction) {
    return { ok: false, reason: "no-match" };
  }
  if (interaction.kind === "name-card") {
    if (target.kind !== "name-card") {
      return { ok: false, reason: "no-match" };
    }
    return {
      ok: true,
      payload: interaction.buildPayload(target.namedCard),
      matched: interaction,
    };
  }
  if (interaction.kind === "unsupported") {
    return { ok: false, reason: "no-match" };
  }
  return { ok: true, payload: interaction.payload, matched: interaction };
}

function matchInteraction(
  interactions: readonly Interaction[],
  target: Exclude<SimulatedClickTarget, { kind: "submit" } | { kind: "cancel" }>,
): Interaction | null {
  for (const interaction of interactions) {
    if (
      interaction.kind === "select-card" &&
      target.kind === "card" &&
      interaction.cardId === target.cardId
    ) {
      return interaction;
    }
    if (
      interaction.kind === "select-player" &&
      target.kind === "player" &&
      interaction.playerId === target.playerId
    ) {
      return interaction;
    }
    if (
      interaction.kind === "select-choice" &&
      target.kind === "choice" &&
      interaction.index === target.index
    ) {
      return interaction;
    }
    if (interaction.kind === "accept-optional" && target.kind === "accept-optional") {
      return interaction;
    }
    if (interaction.kind === "decline-optional" && target.kind === "decline-optional") {
      return interaction;
    }
    if (interaction.kind === "decline-target-prompt" && target.kind === "decline-target-prompt") {
      return interaction;
    }
    if (interaction.kind === "name-card" && target.kind === "name-card") {
      return interaction;
    }
    if (
      interaction.kind === "scry-place" &&
      target.kind === "scry-place" &&
      interaction.cardId === target.cardId &&
      interaction.destinationId === target.destinationId
    ) {
      return interaction;
    }
  }
  return null;
}
