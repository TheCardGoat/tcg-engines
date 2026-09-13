import type { InteractionSubmission } from "@tcg/protocol";

import { logBrowserError, logBrowserInfo } from "../../observability/browser";
import { stringifyTelemetryValue } from "../../observability/browser-core";

export interface FabLiveCommandRequest {
  readonly gameId: string;
  readonly matchId: string;
  readonly actorId: string;
  readonly expectedVersion: number;
  readonly correlationId: string;
  readonly submission: InteractionSubmission;
}

type FabLiveCommandResponseKind = "accepted" | "rejected" | "state_sync";

function commandAttributes(command: FabLiveCommandRequest) {
  return {
    "game.id": command.gameId,
    "match.id": command.matchId,
    "player.id": command.actorId,
    "game.state_version": command.expectedVersion,
    "gateway.request_id": command.correlationId,
    "game.command.action_id": command.submission.actionId,
    "game.command.request_id": command.submission.requestId,
    "game.command.submission": stringifyTelemetryValue(command.submission),
  };
}

export function logFabLiveCommandSent(command: FabLiveCommandRequest): void {
  console.info("[fab-live] command sent", command);
  logBrowserInfo("fab.live.command.sent", commandAttributes(command));
}

export function logFabLiveCommandResponse(
  kind: FabLiveCommandResponseKind,
  payload: unknown,
  command?: FabLiveCommandRequest,
): void {
  const detail = { kind, ...(command ? { command } : {}), response: payload };
  const attributes = {
    ...(command ? commandAttributes(command) : {}),
    "game.command.response_kind": kind,
    "game.command.response": stringifyTelemetryValue(payload),
  };
  if (kind === "rejected") console.error("[fab-live] command response", detail);
  else console.info("[fab-live] command response", detail);
  logBrowserInfo("fab.live.command.response", attributes);
  if (kind === "rejected") logBrowserError("fab.live.command.rejected", attributes);
}

export function logFabLiveCommandTimeout(command: FabLiveCommandRequest): void {
  console.error("[fab-live] command confirmation timed out", command);
  logBrowserError("fab.live.command.confirmation_timeout", commandAttributes(command));
}

export function logFabLiveStateSyncRequested(
  gameId: string,
  command: FabLiveCommandRequest | undefined,
): void {
  const detail = { gameId, ...(command ? { command } : {}) };
  console.info("[fab-live] authoritative state sync requested", detail);
  logBrowserInfo("fab.live.state_sync.requested", {
    "game.id": gameId,
    ...(command ? commandAttributes(command) : {}),
  });
}
