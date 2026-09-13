import type { FabPlayOrigin } from "@tcg/flesh-and-blood-types";
import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import {
  beginFabPlayProcedure,
  type FabPlayDeclaration,
} from "../../procedures/play-card/index.ts";

function playOriginForCard(
  context: FabCommandHandlerContext,
  actorId: string,
  instanceId: string,
  requested: FabPlayOrigin | undefined,
): FabPlayOrigin | null {
  const state = context.state;
  const origin = requested ?? "hand";
  if (state.containers.zonesByPlayerId[actorId]![origin].includes(instanceId)) return origin;
  const crossOwner = state.playerIds.some(
    (playerId) =>
      playerId !== actorId &&
      (state.containers.zonesByPlayerId[playerId]?.[origin] ?? []).includes(instanceId),
  );
  return crossOwner ? origin : null;
}

export function handleBeginPlay(
  context: FabCommandHandlerContext,
  actorId: string,
  command: FabCommandFor<"begin-play">,
): FabCommandHandlerResult {
  const instanceId = command.instanceId;
  const origin = playOriginForCard(context, actorId, instanceId, command.from);
  if (!origin) {
    return {
      accepted: false,
      error: "That card is no longer in a legal play zone.",
      errorCode: "card_not_in_zone",
    };
  }

  const fuseCardIds = command.fuseInstanceIds ?? [];
  const declaration: FabPlayDeclaration = {
    actorId,
    instanceId,
    from: origin,
    requestedAttackTargetId: command.target ?? null,
    boost: command.boost === true,
    scrap: command.scrap === true,
    scrapInstanceId: command.scrapInstanceId ?? null,
    beatChest: command.beatChest === true,
    beatChestInstanceId: command.beatChestInstanceId ?? null,
    crank: command.crank !== false,
    playMethod: command.playMethod,
    fuseInstanceIds: command.fuse === true || fuseCardIds.length > 0 ? fuseCardIds : [],
    chargeInstanceId: command.chargeInstanceId ?? null,
    additionalAttackTargetId: command.additionalTarget ?? null,
    banishCostInstanceId: command.banishCostInstanceId ?? null,
    declaredOptionalCostAbilityIds: command.declaredOptionalCostAbilityIds ?? [],
    paidOptionalCostAbilityIds: command.paidOptionalCostAbilityIds ?? [],
    playPermissionId: command.playPermissionId,
  };
  const result = beginFabPlayProcedure(context.state, declaration, context.transactionOptions());
  if (result.kind === "failed") {
    return { accepted: false, error: result.error, errorCode: result.errorCode };
  }
  return {
    accepted: true,
    move: "begin-play",
    actorId,
    state: context.state,
    outcome:
      result.kind === "reversed"
        ? { kind: "rules-action-reversed", action: "play-card", reason: result.reason }
        : { kind: "applied" },
  };
}
