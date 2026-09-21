import type { GrandArchiveCommand } from "@tcg/grand-archive-engine/simulator";
import type { InteractionIntent } from "@tcg/protocol";
import { createContext, useContext } from "react";
import type { SimulatorCardAction } from "@tcg/simulator-contract";

export interface GrandArchiveCardAction extends SimulatorCardAction {
  shortLabel: string;
}

/** Viewer-authorized actions only; an active decision suspends source affordances. */
export const GrandArchiveCardActions = createContext<readonly GrandArchiveCardAction[]>([]);

export function useGrandArchiveCardActions(entityId: string) {
  return useContext(GrandArchiveCardActions).filter(
    (action) => action.sourceEntityId === entityId && action.availability.kind === "enabled",
  );
}

export function grandArchiveActionSummary(actions: readonly GrandArchiveCardAction[]) {
  return [...new Set(actions.map((action) => action.shortLabel))].join(" · ");
}

type ActionCommand = GrandArchiveCommand["move"] | InteractionIntent;

const actionLabels = {
  "activate-card": "Play",
  "activate-ability": "Activate",
  "declare-attack": "Attack",
  materialize: "Materialize",
  "bestow-boon": "Bestow",
  "return-preserved-card": "Return",
  "start-pregame-card": "Start",
  "complete-pregame-actions": "Continue",
  "skip-materialization": "Skip",
  "answer-decision": "Choose",
  pass: "Pass",
  concede: "Concede",
  "play-card": "Play",
  "resource-card": "Resource",
  attack: "Attack",
  activate: "Activate",
  "move-card": "Move",
  undo: "Undo",
  mulligan: "Mulligan",
  "choose-option": "Choose",
  "choose-targets": "Target",
  "order-cards": "Order",
  custom: "Choose",
} satisfies Record<ActionCommand, string>;

function isActionCommand(value: string): value is ActionCommand {
  return Object.hasOwn(actionLabels, value);
}

/** Validate the shared string at the game boundary; never silently label unknown moves. */
export function grandArchiveActionCommand(value: string): ActionCommand {
  if (isActionCommand(value)) return value;
  throw new Error(`Unknown Grand Archive action command: ${value}`);
}

/** Exhaustive over native moves and the protocol intents emitted for decisions. */
export function grandArchiveActionLabel(command: ActionCommand): string {
  return actionLabels[command];
}
