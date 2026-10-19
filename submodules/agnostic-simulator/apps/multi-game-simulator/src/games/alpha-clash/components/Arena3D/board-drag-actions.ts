import type { InteractionAction, InteractionSubmission } from "@tcg/protocol";
import { resolveInteractionText } from "@tcg/simulator-ui";
import { getCard, hasCard } from "@tcg/alpha-clash-cards";
import type { LiveBoardState } from "../board-types";

export type BoardDropZone = "resource" | "clash" | "clashground" | "accessory";
export interface BoardDragAction {
  sourceId: string;
  destination: string;
  zone?: BoardDropZone;
  action: InteractionAction;
  values: InteractionSubmission["values"];
  label: string;
}

/** Gestures only select advertised actions and candidates. The native draft owns
 * payment, remaining choices, confirmation, and submission. */
export function boardDragActions(
  board: LiveBoardState,
  actions: readonly InteractionAction[],
): BoardDragAction[] {
  const routes: BoardDragAction[] = [];
  for (const action of actions) {
    if (!action.enabled) continue;
    const label = resolveInteractionText(action.text);
    const add = (
      sourceId: string,
      destination: string,
      values: InteractionSubmission["values"] = {},
      zone?: BoardDropZone,
    ) => routes.push({ sourceId, destination, values, zone, action, label });
    if (action.id === "deployResource") {
      const input = action.inputs.find((entry) => entry.kind === "entity-selection");
      if (input?.kind === "entity-selection")
        for (const candidate of input.candidates)
          if (candidate.enabled && candidate.entity.instanceId)
            add(
              candidate.entity.instanceId,
              "resource",
              {
                [input.id]: [candidate.entity.instanceId],
              },
              "resource",
            );
      continue;
    }
    if (action.id === "initiateClash") {
      const attackers = action.inputs.find((entry) => entry.id === "attackerId");
      if (attackers?.kind !== "entity-selection") continue;
      for (const attacker of attackers.candidates) {
        const sourceId = attacker.entity.instanceId;
        if (!attacker.enabled || !sourceId) continue;
        const target = action.inputs.find(
          (entry) => entry.id === `targetId:${sourceId}` || entry.id === "targetId",
        );
        if (target?.kind !== "entity-selection") continue;
        for (const candidate of target.candidates)
          if (candidate.enabled && candidate.entity.instanceId)
            add(sourceId, `card:${candidate.entity.instanceId}`, {
              attackerId: [sourceId],
              [target.id]: [candidate.entity.instanceId],
            });
      }
      continue;
    }
    if (action.id === "declareObstructors" && board.clash) {
      const input = action.inputs.find((entry) => entry.id === "obstructorIds");
      if (input?.kind === "entity-selection")
        for (const candidate of input.candidates)
          if (candidate.enabled && candidate.entity.instanceId)
            add(candidate.entity.instanceId, `card:${board.clash.attackerId}`, {
              [input.id]: [candidate.entity.instanceId],
            });
      continue;
    }
    const sourceId = action.source?.instanceId;
    const card = board.cards.find((entry) => entry.instanceId === sourceId);
    if (!sourceId || !card) continue;
    // Targets with mode-dependent requirements remain in the native prompt.
    const target = action.inputs.find(
      (input) =>
        input.kind === "entity-selection" &&
        input.max === 1 &&
        (input.role === "target" || input.role === "defender") &&
        !input.requiredWhen,
    );
    if (target?.kind === "entity-selection")
      for (const candidate of target.candidates)
        if (
          candidate.enabled &&
          candidate.entity.instanceId &&
          candidate.entity.instanceId !== sourceId
        )
          add(sourceId, `card:${candidate.entity.instanceId}`, {
            [target.id]: [candidate.entity.instanceId],
          });
    if (action.id.startsWith("attachWeapon:")) continue;
    if (action.id.startsWith("setCard:") || action.id.startsWith("detachWeapon:")) {
      add(sourceId, "accessory", {}, "accessory");
      continue;
    }
    if (action.intent === "play-card" || action.id.startsWith("activateAbility:")) {
      const type =
        card.definitionId && hasCard(card.definitionId)
          ? getCard(card.definitionId).cardType
          : undefined;
      const zone = action.id.startsWith("activateAbility:")
        ? "clash"
        : type === "clashground"
          ? "clashground"
          : type === "accessory"
            ? "accessory"
            : "clash";
      add(sourceId, zone, {}, zone);
    }
  }
  return routes;
}
