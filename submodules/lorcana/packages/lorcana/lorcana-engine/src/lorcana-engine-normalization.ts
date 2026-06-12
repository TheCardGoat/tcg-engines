import type { CardInstanceId, PlayerId } from "#core";
import type { LorcanaRuntimeMoveInputs, LorcanaRuntimeMoveParams } from "./types";

export type PlayCardCostInput = "standard" | "free" | PlayCardCostObject;

/**
 * Convenience type for playCard cost parameter in client mode.
 */
type PlayCardCostObject =
  | { cost: "standard"; amount?: number; targets?: PlayCardMoveParams["targets"] }
  | { cost: "free"; amount?: number; targets?: PlayCardMoveParams["targets"] }
  | {
      cost: "shift";
      shiftTarget: CardInstanceId;
      discardCards?: CardInstanceId[];
      amount?: number;
      targets?: PlayCardMoveParams["targets"];
    }
  | {
      cost: "sing";
      singer: CardInstanceId;
      amount?: number;
      targets?: PlayCardMoveParams["targets"];
    }
  | {
      cost: "singTogether";
      singers: CardInstanceId[];
      amount?: number;
      targets?: PlayCardMoveParams["targets"];
    }
  | {
      cost: "sacrifice";
      sacrificeTarget: CardInstanceId;
      amount?: number;
      targets?: PlayCardMoveParams["targets"];
    }
  | {
      cost: "exert-items";
      exertTargets: CardInstanceId[];
      amount?: number;
      targets?: PlayCardMoveParams["targets"];
    }
  | {
      cost: "put-on-deck-bottom";
      deckBottomTarget: CardInstanceId;
      amount?: number;
      targets?: PlayCardMoveParams["targets"];
    };

type PlayCardMoveParams = LorcanaRuntimeMoveParams["playCard"];
type NormalizedPlayCardOptions = {
  targets?: PlayCardMoveParams["targets"];
  playerTargets?: PlayerId | PlayerId[];
  amount?: number;
  namedCard?: string;
  resolveOptional?: boolean;
  enterPlayExerted?: boolean;
  choiceIndex?: number;
  destinations?: PlayCardMoveParams["destinations"];
  preventAutoResolveTriggeredEffects?: boolean;
};

type NormalizedPlayCardFields = Pick<
  PlayCardMoveParams,
  | "targets"
  | "playerTargets"
  | "amount"
  | "namedCard"
  | "resolveOptional"
  | "enterPlayExerted"
  | "choiceIndex"
  | "destinations"
  | "preventAutoResolveTriggeredEffects"
>;

export function normalizeMoveRequestId(moveId: string): keyof LorcanaRuntimeMoveInputs & string {
  if (moveId === "putACardIntoTheInkwell") {
    return "putCardIntoInkwell";
  }
  if (moveId === "chooseFirstPlayer" || moveId === "chooseFirtPlayer") {
    return "chooseWhoGoesFirst";
  }
  if (moveId === "mulligan") {
    return "alterHand";
  }

  return moveId as keyof LorcanaRuntimeMoveInputs & string;
}

export function normalizePlayCardCost(
  cardId: CardInstanceId,
  cost: PlayCardCostInput,
  options?: NormalizedPlayCardOptions,
): PlayCardMoveParams {
  const actionResolutionFields: Partial<NormalizedPlayCardFields> = {};

  if (options?.targets) {
    actionResolutionFields.targets = options.targets;
  }
  if (options?.playerTargets) {
    actionResolutionFields.playerTargets = options.playerTargets;
  }
  if (typeof options?.amount === "number") {
    actionResolutionFields.amount = options.amount;
  }
  if (typeof options?.namedCard === "string" && options.namedCard.trim().length > 0) {
    actionResolutionFields.namedCard = options.namedCard.trim();
  }
  if (typeof options?.resolveOptional === "boolean") {
    actionResolutionFields.resolveOptional = options.resolveOptional;
  }
  if (typeof options?.enterPlayExerted === "boolean") {
    actionResolutionFields.enterPlayExerted = options.enterPlayExerted;
  }
  if (typeof options?.choiceIndex === "number") {
    actionResolutionFields.choiceIndex = options.choiceIndex;
  }
  if (Array.isArray(options?.destinations) && options.destinations.length > 0) {
    actionResolutionFields.destinations = options.destinations;
  }
  if (typeof options?.preventAutoResolveTriggeredEffects === "boolean") {
    actionResolutionFields.preventAutoResolveTriggeredEffects =
      options.preventAutoResolveTriggeredEffects;
  }

  if (cost === "standard") {
    return {
      cardId,
      cost: "standard",
      ...actionResolutionFields,
    };
  }

  if (cost === "free") {
    return {
      cardId,
      cost: "free",
      ...actionResolutionFields,
    };
  }

  switch (cost.cost) {
    case "standard":
      return {
        cardId,
        cost: "standard",
        ...actionResolutionFields,
      };
    case "free":
      return {
        cardId,
        cost: "free",
        ...actionResolutionFields,
      };
    case "shift":
      return {
        cardId,
        cost: "shift",
        shiftTarget: cost.shiftTarget,
        ...(cost.discardCards ? { discardCards: cost.discardCards } : {}),
        ...actionResolutionFields,
      };
    case "sing":
      return {
        cardId,
        cost: "sing",
        singer: cost.singer,
        ...actionResolutionFields,
      };
    case "singTogether":
      return {
        cardId,
        cost: "singTogether",
        singers: cost.singers,
        ...actionResolutionFields,
      };
    case "sacrifice":
      return {
        cardId,
        cost: "sacrifice",
        sacrificeTarget: cost.sacrificeTarget,
        ...actionResolutionFields,
      };
    case "exert-items":
      return {
        cardId,
        cost: "exert-items",
        exertTargets: cost.exertTargets,
        ...actionResolutionFields,
      };
    case "put-on-deck-bottom":
      return {
        cardId,
        cost: "put-on-deck-bottom",
        deckBottomTarget: cost.deckBottomTarget,
        ...actionResolutionFields,
      };
  }
}
