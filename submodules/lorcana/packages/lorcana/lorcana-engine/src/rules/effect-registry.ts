import type { CardInstanceId, PlayerId } from "#core";

export type EffectDuration =
  | "this-turn"
  | "next-turn"
  | "their-next-turn"
  | "during-challenge"
  | "until-start-of-next-turn"
  | "until-end-of-turn"
  | "permanent";

export type EffectLifecycle = {
  createdAtTurn: number;
  startsAtTurn: number;
  expiresAtTurn: number;
  duration: EffectDuration | string | unknown;
};

export type EffectContext = {
  sourceId?: CardInstanceId;
  targetId?: CardInstanceId;
  controllerId?: PlayerId;
};

function getDefaultCurrentTurn(currentTurn: number): number {
  return typeof currentTurn === "number" && Number.isFinite(currentTurn) && currentTurn >= 1
    ? currentTurn
    : 0;
}

export function resolveEffectWindow(
  currentTurn: number,
  duration: unknown,
  options?: {
    currentPlayerId?: PlayerId;
    targetOwnerId?: PlayerId;
  },
): { startsAtTurn: number; expiresAtTurn: number } {
  const turn = getDefaultCurrentTurn(currentTurn);

  if (turn === 0) {
    return {
      startsAtTurn: 0,
      expiresAtTurn: 0,
    };
  }

  if (typeof duration === "string") {
    switch (duration) {
      case "next-turn":
        return {
          startsAtTurn: turn + 1,
          expiresAtTurn: turn + 1,
        };
      case "their-next-turn":
        if (
          options?.currentPlayerId &&
          options?.targetOwnerId &&
          options.targetOwnerId !== options.currentPlayerId
        ) {
          return {
            startsAtTurn: turn + 1,
            expiresAtTurn: turn + 1,
          };
        }
        return {
          startsAtTurn: turn + 2,
          expiresAtTurn: turn + 2,
        };
      case "until-start-of-next-turn":
        return {
          startsAtTurn: turn,
          expiresAtTurn: turn + 1,
        };
      case "permanent":
      case "while-in-play":
        return {
          startsAtTurn: turn,
          expiresAtTurn: Number.MAX_SAFE_INTEGER,
        };
      case "this-turn":
      case "until-end-of-turn":
      default:
        return {
          startsAtTurn: turn,
          expiresAtTurn: turn,
        };
    }
  }

  return {
    startsAtTurn: turn,
    expiresAtTurn: turn,
  };
}

export function isEffectActive(lifecycle: EffectLifecycle, currentTurn: number): boolean {
  return currentTurn >= lifecycle.startsAtTurn && currentTurn <= lifecycle.expiresAtTurn;
}

export function isEffectExpired(
  lifecycle: { expiresAtTurn: number },
  currentTurn: number,
): boolean {
  return lifecycle.expiresAtTurn < currentTurn;
}
