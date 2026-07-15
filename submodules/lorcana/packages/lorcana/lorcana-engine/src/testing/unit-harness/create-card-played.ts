import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../types/domain-events";
import { PLAYER_ONE } from "./fixtures";

export type CreateCardPlayedArgs = {
  cardId: CardInstanceId | string;
  playerId?: PlayerId;
  cardType?: CardPlayedPayload["cardType"];
  costType?: CardPlayedPayload["costType"];
  usedShift?: boolean;
  singerIds?: CardInstanceId[];
};

/**
 * Build a minimal `CardPlayedPayload` for `evaluateActionCondition` and other
 * resolvers that need a "source of the effect" reference.
 */
export function createCardPlayed(args: CreateCardPlayedArgs): CardPlayedPayload {
  return {
    cardId: args.cardId as CardInstanceId,
    cardType: args.cardType ?? "action",
    costType: args.costType ?? "free",
    playerId: args.playerId ?? PLAYER_ONE,
    ...(args.usedShift !== undefined ? { usedShift: args.usedShift } : {}),
    ...(args.singerIds ? { singerIds: args.singerIds } : {}),
  } as CardPlayedPayload;
}
