import type { CardInstanceId, PlayerId } from "#core";
import type { LorcanaRuntimeMoveInputs, PendingActionResolutionInput } from "../types";

import type {
  AutomatedActionCandidate,
  AutomatedActionDestinationSelection,
  AutomatedActionTargetId,
} from "./types";

export type AutomatedActionMoveRequest = {
  moveId: keyof LorcanaRuntimeMoveInputs & string;
  input: LorcanaRuntimeMoveInputs[keyof LorcanaRuntimeMoveInputs];
};

function splitTargets(
  playerIds: readonly PlayerId[],
  targets: readonly AutomatedActionTargetId[] | undefined,
): {
  cardTargets: CardInstanceId[];
  playerTargets: PlayerId[];
} {
  if (!targets || targets.length === 0) {
    return {
      cardTargets: [],
      playerTargets: [],
    };
  }

  return targets.reduce<{
    cardTargets: CardInstanceId[];
    playerTargets: PlayerId[];
  }>(
    (current, targetId) => {
      if (playerIds.includes(targetId as PlayerId)) {
        current.playerTargets.push(targetId as PlayerId);
      } else {
        current.cardTargets.push(targetId as CardInstanceId);
      }

      return current;
    },
    {
      cardTargets: [],
      playerTargets: [],
    },
  );
}

function buildActionResolutionParams(
  targets: readonly AutomatedActionTargetId[] | undefined,
  choiceIndex: number | undefined,
  namedCard: string | undefined,
  resolveOptional: boolean | undefined,
  destinations: readonly AutomatedActionDestinationSelection[] | undefined,
): Omit<PendingActionResolutionInput, "amount"> {
  return {
    ...(targets && targets.length > 0
      ? { targets: [...targets] as PendingActionResolutionInput["targets"] }
      : {}),
    ...(typeof choiceIndex === "number" ? { choiceIndex } : {}),
    ...(typeof namedCard === "string" && namedCard.trim().length > 0
      ? { namedCard: namedCard.trim() }
      : {}),
    ...(typeof resolveOptional === "boolean" ? { resolveOptional } : {}),
    ...(destinations
      ? {
          destinations: destinations.map((destination) => ({
            zone: destination.zone,
            cards: [...destination.cards],
          })),
        }
      : {}),
  };
}

export function buildAutomatedActionMoveRequest(
  actorId: PlayerId,
  candidate: AutomatedActionCandidate,
  playerIds: readonly PlayerId[],
): AutomatedActionMoveRequest {
  switch (candidate.family) {
    case "chooseWhoGoesFirst":
      return {
        moveId: "chooseWhoGoesFirst",
        input: {
          args: {
            playerId: candidate.firstPlayerId,
          },
        },
      };
    case "alterHand":
      return {
        moveId: "alterHand",
        input: {
          args: {
            playerId: actorId,
            cardsToMulligan: [...candidate.cardsToMulligan],
          },
        },
      };
    case "resolveBag":
      return {
        moveId: "resolveBag",
        input: {
          args: {
            bagId: candidate.bagId,
            params: buildActionResolutionParams(
              candidate.targets,
              candidate.choiceIndex,
              candidate.namedCard,
              candidate.resolveOptional,
              candidate.destinations,
            ),
          },
        },
      };
    case "resolveEffect":
      return {
        moveId: "resolveEffect",
        input: {
          args: {
            effectId: candidate.effectId,
            params: buildActionResolutionParams(
              candidate.targets,
              candidate.choiceIndex,
              candidate.namedCard,
              candidate.resolveOptional,
              candidate.destinations,
            ),
          },
        },
      };
    case "putCardIntoInkwell":
      return {
        moveId: "putCardIntoInkwell",
        input: {
          args: {
            cardId: candidate.cardId,
          },
        },
      };
    case "playCard": {
      const { cardTargets, playerTargets } = splitTargets(playerIds, candidate.targets);
      const sharedArgs = {
        cardId: candidate.cardId,
        ...(cardTargets.length > 0 || playerTargets.length > 0
          ? {
              targets: [
                ...cardTargets,
                ...playerTargets,
              ] as LorcanaRuntimeMoveInputs["playCard"]["args"]["targets"],
            }
          : {}),
        ...(playerTargets.length === 1
          ? { playerTargets: playerTargets[0] }
          : playerTargets.length > 1
            ? { playerTargets }
            : {}),
        ...(typeof candidate.choiceIndex === "number"
          ? { choiceIndex: candidate.choiceIndex }
          : {}),
        ...(typeof candidate.resolveOptional === "boolean"
          ? { resolveOptional: candidate.resolveOptional }
          : {}),
      };
      const args: LorcanaRuntimeMoveInputs["playCard"]["args"] =
        typeof candidate.cost === "string"
          ? {
              ...sharedArgs,
              cost: candidate.cost,
            }
          : candidate.cost.cost === "shift"
            ? {
                ...sharedArgs,
                cost: "shift",
                shiftTarget: candidate.cost.shiftTarget,
              }
            : candidate.cost.cost === "sing"
              ? {
                  ...sharedArgs,
                  cost: "sing",
                  singer: candidate.cost.singer,
                }
              : candidate.cost.cost === "singTogether"
                ? {
                    ...sharedArgs,
                    cost: "singTogether",
                    singers: [...candidate.cost.singers],
                  }
                : {
                    ...sharedArgs,
                    cost: candidate.cost.cost === "free" ? "free" : "standard",
                  };

      return {
        moveId: "playCard",
        input: {
          args,
        },
      };
    }
    case "activateAbility":
      return {
        moveId: "activateAbility",
        input: {
          args: {
            cardId: candidate.cardId,
            abilityIndex: candidate.abilityIndex,
            ...(candidate.targets && candidate.targets.length > 0
              ? {
                  targets: [
                    ...candidate.targets,
                  ] as LorcanaRuntimeMoveInputs["activateAbility"]["args"]["targets"],
                }
              : {}),
            ...(typeof candidate.choiceIndex === "number"
              ? { choiceIndex: candidate.choiceIndex }
              : {}),
            ...(candidate.costs ? { costs: { ...candidate.costs } } : {}),
          },
        },
      };
    case "quest":
      return {
        moveId: "quest",
        input: {
          args: {
            cardId: candidate.cardId,
          },
        },
      };
    case "challenge":
      return {
        moveId: "challenge",
        input: {
          args: {
            attackerId: candidate.attackerId,
            defenderId: candidate.defenderId,
          },
        },
      };
    case "moveCharacterToLocation":
      return {
        moveId: "moveCharacterToLocation",
        input: {
          args: {
            characterId: candidate.characterId,
            locationId: candidate.locationId,
          },
        },
      };
  }
}
