import type { InteractionAction } from "@tcg/protocol";
import type { MatchState, PlayerPrompt } from "@tcg/cyberpunk-engine";
import { entityInput, optionInput } from "./interactionInputs";

export type TargetPromptPresentation = "drawer" | "none" | "spatial";

export interface TargetPromptPresentationResult {
  action: InteractionAction | null;
  presentation: TargetPromptPresentation;
  requestId: string | null;
}

export function choiceModalActionFromInteractionView(
  actions: readonly InteractionAction[],
  matchState: MatchState,
  opts: { includeSpatialTargets?: boolean; visibleHandOwnerId?: string } = {},
): InteractionAction | null {
  for (const action of actions) {
    if (optionInput(action, "effectId")) {
      return action;
    }
    switch (action.id) {
      case "resolveScry":
      case "resolveRevealDestination":
      case "resolveCardTypeChoice":
        return action;
      case "resolveTrigger":
        return optionInput(action, "triggerId")?.required === true ? action : null;
      case "resolveEffectTarget": {
        const cardTargetInput = entityInput(action, "targetIds", "card");
        const dieTargetInput = entityInput(action, "targetIds", "die");
        const targetInput = cardTargetInput ?? dieTargetInput;
        if (!targetInput) {
          return null;
        }
        // Single-target board choices are usually handled inline by Card.tsx
        // (the player clicks the card directly). Hand/trash/deck choices need
        // the drawer even if the card is technically visible elsewhere in the UI.
        const allTargetsAreVisible =
          targetInput.candidates.length > 0 &&
          targetInput.candidates.every((candidate) =>
            isVisibleEntityTarget(matchState, candidate.entity.instanceId, candidate.entity.kind),
          );
        return allTargetsAreVisible && !opts.includeSpatialTargets ? null : action;
      }
      case "resolveDiscardFromHand":
      case "resolveCardToMove":
        return opts.includeSpatialTargets ? action : null;
      case "resolveStealGigs":
        // Gig dice are visible and selectable in the center row; keep this as
        // a board-spatial interaction instead of covering the board with a modal.
        return null;
      default:
        break;
    }
  }
  return null;
}

export function getTargetPromptPresentation({
  actions,
  matchState,
  selectedPlayTargetRequestId = null,
  choice,
  visibleHandOwnerId,
}: {
  actions: readonly InteractionAction[];
  matchState: MatchState;
  selectedPlayTargetRequestId?: string | null;
  choice?: PlayerPrompt["choice"] | null;
  visibleHandOwnerId?: string;
}): TargetPromptPresentationResult {
  const drawerAction = choiceModalActionFromInteractionView(actions, matchState, {
    visibleHandOwnerId,
  });
  if (drawerAction) {
    return {
      action: drawerAction,
      presentation: "drawer",
      requestId: drawerAction.requestId,
    };
  }

  const spatialAction = choiceModalActionFromInteractionView(actions, matchState, {
    includeSpatialTargets: true,
    visibleHandOwnerId,
  });
  if (spatialAction) {
    switch (spatialAction.id) {
      case "resolveEffectTarget":
        return {
          action: spatialAction,
          presentation: "spatial",
          requestId: spatialAction.requestId,
        };
      case "resolveDiscardFromHand":
      case "resolveCardToMove":
        return {
          action: spatialAction,
          presentation: "drawer",
          requestId: spatialAction.requestId,
        };
      default:
        break;
    }
  }

  const nativeTargetRequestId = nativeTargetChoiceModalRequestId(choice);
  if (nativeTargetRequestId && choice?.type === "chooseTarget") {
    const targetIds = nativeTargetChoiceIds(choice);
    const targetKind = choice.payload.type === "effectTarget" ? choice.payload.targetKind : "card";
    if (choice.payload.type === "effectTarget" && targetKind === "gig" && targetIds.length > 0) {
      return {
        action: null,
        presentation: "spatial",
        requestId: nativeTargetRequestId,
      };
    }
    const resolvedTargetKind = targetKind === "gig" ? "die" : (targetKind ?? "card");
    const allTargetsAreVisible =
      targetIds.length > 0 &&
      (targetKind === "gig"
        ? targetIds.every((id) => isVisibleGigTarget(matchState, id))
        : targetIds.every((id) => isVisibleEntityTarget(matchState, id, resolvedTargetKind)));
    return {
      action: null,
      presentation: allTargetsAreVisible ? "spatial" : "drawer",
      requestId: nativeTargetRequestId,
    };
  }

  if (selectedPlayTargetRequestId) {
    return {
      action: null,
      presentation: "spatial",
      requestId: selectedPlayTargetRequestId,
    };
  }

  return {
    action: null,
    presentation: "none",
    requestId: null,
  };
}

export function nativeTargetChoiceModalRequestId(
  choice: PlayerPrompt["choice"] | null | undefined,
): string | null {
  if (
    choice?.type !== "chooseTarget" ||
    choice.payload.type !== "effectTarget" ||
    !(choice.payload.cards?.length || choice.payload.eligibleIds?.length)
  ) {
    return null;
  }
  const targetIds = (
    choice.payload.cards?.map((card) => card.instanceId) ??
    choice.payload.eligibleIds ??
    []
  ).join(",");
  return [
    "native-target-choice",
    choice.chooserId,
    choice.payload.source?.cardId ?? "",
    choice.payload.source?.definitionId ?? "",
    targetIds,
  ].join(":");
}

export function choiceActionHasRenderableDrawerContent(action: InteractionAction): boolean {
  switch (action.id) {
    case "resolveEffectTarget":
      return Boolean(
        entityInput(action, "targetIds", "card") ?? entityInput(action, "targetIds", "die"),
      );
    case "resolveDiscardFromHand":
      return Boolean(entityInput(action, "cardIds", "card"));
    case "resolveTrigger":
      return Boolean(optionInput(action, "triggerId"));
    case "resolveScry":
      return Boolean(entityInput(action, "selectedCardIds", "card"));
    case "resolveRevealDestination":
      return Boolean(optionInput(action, "destination"));
    case "resolveCardTypeChoice":
      return Boolean(optionInput(action, "cardType"));
    case "resolveCardToMove":
      return Boolean(entityInput(action, "cardId", "card"));
    default:
      return false;
  }
}

function nativeTargetChoiceIds(choice: Extract<PlayerPrompt["choice"], { type: "chooseTarget" }>) {
  return choice.payload.type === "effectTarget"
    ? (choice.payload.cards?.map((card) => card.instanceId) ?? choice.payload.eligibleIds ?? [])
    : [];
}

function isVisibleEntityTarget(
  matchState: MatchState,
  entityId: string,
  entityKind: Parameters<typeof entityInput>[2],
): boolean {
  if (entityKind === "card") {
    return isVisibleCardTarget(matchState, entityId);
  }
  if (entityKind === "die") {
    return isVisibleGigTarget(matchState, entityId);
  }
  return false;
}

function isVisibleCardTarget(matchState: MatchState, cardId: string): boolean {
  const card = matchState.G.cardIndex[cardId];
  if (!card) {
    return false;
  }
  return card.zone === "field" || card.zone === "legendArea";
}

function isVisibleGigTarget(matchState: MatchState, dieId: string): boolean {
  return Object.values(matchState.G.players).some((player) =>
    (player.gigArea as readonly string[]).includes(dieId),
  );
}
