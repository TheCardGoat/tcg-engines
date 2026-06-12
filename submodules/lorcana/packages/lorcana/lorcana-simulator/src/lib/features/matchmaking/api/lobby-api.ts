import { getApiOrigin } from "$lib/config/public-url-config.js";
import {
  HttpRequestError,
  requestJson,
  requestJsonOrNull,
  requestVoid,
} from "$lib/data/transport/http-client.js";

export interface LobbyRoomResponse {
  object: "lobby_room";
  roomCode: string;
  status?: "waiting" | "ready" | "matched";
  bestOf?: number;
  createdAt?: number;
  isCreator?: boolean;
  isJoiner?: boolean;
  creatorDisplayName?: string | null;
  joinerDisplayName?: string | null;
  creatorDeckName?: string | null;
  joinerDeckName?: string | null;
}

export interface LobbyJoinResponse {
  object: "lobby_room";
  roomCode: string;
  status: "ready" | "own_room";
}

export interface LobbyMatchResponse {
  object: "lobby_match";
  matchId: string;
  gameId: string;
}

export class LobbyApiError extends Error {
  readonly roomCode?: string;
  readonly matchId?: string;

  constructor(message: string, roomCode?: string, matchId?: string) {
    super(message);
    this.name = "LobbyApiError";
    this.roomCode = roomCode;
    this.matchId = matchId;
  }
}

function toLobbyApiError(error: unknown, fallback: string): LobbyApiError {
  if (error instanceof HttpRequestError) {
    const payload =
      typeof error.payload === "object" && error.payload !== null
        ? (error.payload as Record<string, unknown>)
        : null;
    const roomCode = payload && typeof payload.roomCode === "string" ? payload.roomCode : undefined;
    const matchId = payload && typeof payload.matchId === "string" ? payload.matchId : undefined;
    return new LobbyApiError(error.message, roomCode, matchId);
  }

  if (error instanceof Error) {
    return new LobbyApiError(error.message);
  }

  return new LobbyApiError(fallback);
}

export async function createLobbyRoom(params: {
  gameProfileId: string;
  bestOf: 1 | 3;
}): Promise<LobbyRoomResponse> {
  try {
    return await requestJson<LobbyRoomResponse>(
      `${getApiOrigin()}/v1/games/lorcana/play/lobby/rooms`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      },
      "Failed to create room",
    );
  } catch (error) {
    throw toLobbyApiError(error, "Failed to create room");
  }
}

export async function joinLobbyRoom(params: {
  roomCode: string;
  gameProfileId: string;
}): Promise<LobbyJoinResponse> {
  try {
    return await requestJson<LobbyJoinResponse>(
      `${getApiOrigin()}/v1/games/lorcana/play/lobby/rooms/${encodeURIComponent(params.roomCode.toUpperCase())}/join`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameProfileId: params.gameProfileId }),
      },
      "Failed to join room",
    );
  } catch (error) {
    throw toLobbyApiError(error, "Failed to join room");
  }
}

export async function startLobbyRoom(roomCode: string): Promise<LobbyMatchResponse> {
  try {
    return await requestJson<LobbyMatchResponse>(
      `${getApiOrigin()}/v1/games/lorcana/play/lobby/rooms/${encodeURIComponent(roomCode.toUpperCase())}/start`,
      {
        method: "POST",
      },
      "Failed to start game",
    );
  } catch (error) {
    throw toLobbyApiError(error, "Failed to start game");
  }
}

export async function leaveLobbyRoom(roomCode: string): Promise<void> {
  try {
    await requestVoid(
      `${getApiOrigin()}/v1/games/lorcana/play/lobby/rooms/${encodeURIComponent(roomCode.toUpperCase())}/leave`,
      {
        method: "POST",
      },
      "Failed to leave room",
    );
  } catch (error) {
    throw toLobbyApiError(error, "Failed to leave room");
  }
}

export async function getLobbyRoomStatus(roomCode: string): Promise<LobbyRoomResponse | null> {
  return requestJsonOrNull<LobbyRoomResponse>(
    `${getApiOrigin()}/v1/games/lorcana/play/lobby/rooms/${encodeURIComponent(roomCode.toUpperCase())}`,
    undefined,
    [404],
  );
}

export async function cancelLobbyRoom(roomCode: string): Promise<void> {
  try {
    await requestVoid(
      `${getApiOrigin()}/v1/games/lorcana/play/lobby/rooms/${encodeURIComponent(roomCode.toUpperCase())}`,
      {
        method: "DELETE",
      },
      "Failed to cancel room",
    );
  } catch (error) {
    throw toLobbyApiError(error, "Failed to cancel room");
  }
}
