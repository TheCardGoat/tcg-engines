import { goto } from "$app/navigation";
import {
  createLobbyRoom,
  joinLobbyRoom,
  cancelLobbyRoom,
  startLobbyRoom,
  leaveLobbyRoom,
  LobbyApiError,
} from "../api/lobby-api.js";
import { saveRankedMatchSession } from "$lib/features/practice-match/practice-match-storage.js";
import { logError } from "$lib/telemetry/logs.js";

export type LobbyRoomStatus =
  | "idle"
  | "creating"
  | "waiting"
  | "opponent_joined"
  | "joining"
  | "joined_waiting"
  | "starting"
  | "match_found"
  | "error";

export type LobbyMode = "1" | "3";

export class LobbyRoomStore {
  status: LobbyRoomStatus = $state("idle");
  roomCode: string | null = $state(null);
  error: string | null = $state(null);
  /** Room code from a conflict error (user already has an active room). */
  existingRoomCode: string | null = $state(null);
  /** Match ID from a conflict error (user has an active match). */
  activeMatchId: string | null = $state(null);
  selectedMode: LobbyMode = $state("1");
  matchId: string | null = $state(null);
  gameId: string | null = $state(null);

  /** True while a client-side navigation to the match route is in progress. */
  navigatingToMatch: boolean = $state(false);

  /** Whether the current user is the room creator. */
  isCreator: boolean = $state(false);

  /** Display name of the opponent (set when they join). */
  opponentName: string | null = $state(null);
  opponentGameProfileId: string | null = $state(null);

  /** Display name of the creator (set on room creation). */
  creatorName: string | null = $state(null);

  /** Selected deck name for display in the room screen. */
  creatorDeckName: string | null = $state(null);

  /** Selected deck name of the opponent (set when they join). */
  opponentDeckName: string | null = $state(null);

  get isActive(): boolean {
    return (
      this.status === "creating" ||
      this.status === "waiting" ||
      this.status === "opponent_joined" ||
      this.status === "joining" ||
      this.status === "joined_waiting" ||
      this.status === "starting"
    );
  }

  /** Whether the room screen should be shown. */
  get isInRoom(): boolean {
    return (
      this.status === "waiting" ||
      this.status === "opponent_joined" ||
      this.status === "joined_waiting" ||
      this.status === "starting"
    );
  }

  async createRoom(
    gameProfileId: string,
    creatorName: string,
    deckName: string | null,
  ): Promise<void> {
    console.log("[lobby-room] createRoom starting", {
      gameProfileId,
      creatorName,
      deckName,
      selectedMode: this.selectedMode,
    });
    this.status = "creating";
    this.error = null;
    try {
      const bestOf = this.selectedMode === "1" ? 1 : 3;
      const result = await createLobbyRoom({ gameProfileId, bestOf: bestOf as 1 | 3 });
      console.log("[lobby-room] createRoom success", {
        roomCode: result.roomCode,
        bestOf,
      });
      this.roomCode = result.roomCode;
      this.isCreator = true;
      this.creatorName = creatorName;
      this.creatorDeckName = deckName;
      this.status = "waiting";
      console.log("[lobby-room] status changed to waiting", {
        roomCode: this.roomCode,
        creatorName: this.creatorName,
      });
    } catch (err) {
      console.error("[lobby-room] createRoom failed", err);
      logError(
        "matchmaking_room_create_failed",
        { mode: this.selectedMode },
        err instanceof Error ? err : undefined,
      );
      this.error = err instanceof Error ? err.message : "Failed to create room";
      this.existingRoomCode = err instanceof LobbyApiError && err.roomCode ? err.roomCode : null;
      this.activeMatchId = err instanceof LobbyApiError && err.matchId ? err.matchId : null;
      this.status = "error";
      console.log("[lobby-room] status changed to error", {
        error: this.error,
        existingRoomCode: this.existingRoomCode,
      });
    }
  }

  /**
   * Rejoin an existing room that was detected from a conflict error.
   * Puts the store into "waiting" state with the existing room code.
   */
  rejoinExistingRoom(): void {
    console.log("[lobby-room] rejoinExistingRoom", {
      existingRoomCode: this.existingRoomCode,
    });
    if (!this.existingRoomCode) {
      console.warn("[lobby-room] rejoinExistingRoom: no existingRoomCode available");
      return;
    }
    this.roomCode = this.existingRoomCode;
    this.isCreator = true;
    this.error = null;
    this.existingRoomCode = null;
    this.status = "waiting";
    console.log("[lobby-room] rejoined existing room", {
      roomCode: this.roomCode,
      status: this.status,
    });
  }

  /**
   * Cancel an existing room detected from a conflict error, then reset.
   */
  async cancelExistingRoom(): Promise<void> {
    console.log("[lobby-room] cancelExistingRoom starting", {
      existingRoomCode: this.existingRoomCode,
    });
    const code = this.existingRoomCode;
    if (!code) {
      console.warn("[lobby-room] cancelExistingRoom: no existingRoomCode available");
      return;
    }
    try {
      await cancelLobbyRoom(code);
      console.log("[lobby-room] cancelExistingRoom success, resetting");
      this.existingRoomCode = null;
      this.error = null;
      this.status = "idle";
    } catch (err) {
      console.error("[lobby-room] cancelExistingRoom failed:", err);
      logError(
        "matchmaking_room_cancel_existing_failed",
        {},
        err instanceof Error ? err : undefined,
      );
      this.error = err instanceof Error ? err.message : "Failed to cancel room";
      console.log("[lobby-room] error after cancelExistingRoom:", this.error);
    }
  }

  async joinRoom(roomCode: string, gameProfileId: string): Promise<void> {
    console.log("[lobby-room] joinRoom starting", { roomCode, gameProfileId });
    this.status = "joining";
    this.error = null;
    try {
      const result = await joinLobbyRoom({ roomCode, gameProfileId });
      console.log("[lobby-room] joinRoom success", { result });
      if (result.status === "own_room") {
        // Creator tried to join their own room — navigate to it
        console.log("[lobby-room] user is own_room creator, setting to waiting");
        this.roomCode = result.roomCode;
        this.isCreator = true;
        this.status = "waiting";
        return;
      }
      this.roomCode = result.roomCode;
      this.isCreator = false;
      this.status = "joined_waiting";
      console.log("[lobby-room] status changed to joined_waiting", {
        roomCode: this.roomCode,
        isCreator: this.isCreator,
      });
    } catch (err) {
      console.error("[lobby-room] joinRoom failed", err);
      logError("matchmaking_room_join_failed", {}, err instanceof Error ? err : undefined);
      this.error = err instanceof Error ? err.message : "Failed to join room";
      this.activeMatchId = err instanceof LobbyApiError && err.matchId ? err.matchId : null;
      this.status = "error";
      console.log("[lobby-room] status changed to error", { error: this.error });
    }
  }

  async startRoom(): Promise<void> {
    console.log("[lobby-room] startRoom starting", {
      roomCode: this.roomCode,
      currentStatus: this.status,
    });
    if (!this.roomCode) {
      console.warn("[lobby-room] startRoom: no roomCode available");
      return;
    }
    this.status = "starting";
    this.error = null;
    try {
      const result = await startLobbyRoom(this.roomCode);
      console.log("[lobby-room] startRoom success", {
        matchId: result.matchId,
        gameId: result.gameId,
      });
      // Use HTTP response as fallback if WS match_found hasn't arrived yet
      if (this.status === "starting") {
        this.matchId = result.matchId;
        this.gameId = result.gameId;
        this.status = "match_found";
        console.log("[lobby-room] status changed to match_found, navigating to match");
        void this.navigateToMatch(result.matchId, result.gameId);
      }
    } catch (err) {
      console.error("[lobby-room] startRoom failed", err);
      logError("matchmaking_room_start_failed", {}, err instanceof Error ? err : undefined);
      this.error = err instanceof Error ? err.message : "Failed to start game";
      this.status = "opponent_joined"; // revert to allow retry
      console.log("[lobby-room] status reverted to opponent_joined, error:", this.error);
    }
  }

  async cancelRoom(): Promise<void> {
    console.log("[lobby-room] cancelRoom starting", {
      roomCode: this.roomCode,
      currentStatus: this.status,
    });
    if (!this.roomCode) {
      console.warn("[lobby-room] cancelRoom: no roomCode available");
      return;
    }
    try {
      await cancelLobbyRoom(this.roomCode);
      console.log("[lobby-room] cancelRoom success, resetting state");
      this.reset();
    } catch (err) {
      console.error("[lobby-room] cancelRoom failed:", err);
      logError("matchmaking_room_cancel_failed", {}, err instanceof Error ? err : undefined);
      this.error = err instanceof Error ? err.message : "Failed to cancel room";
      this.status = "error";
      console.log("[lobby-room] status changed to error after cancel failure");
    }
  }

  async leaveRoom(): Promise<void> {
    console.log("[lobby-room] leaveRoom starting", {
      roomCode: this.roomCode,
      currentStatus: this.status,
      isCreator: this.isCreator,
    });
    if (!this.roomCode) {
      console.warn("[lobby-room] leaveRoom: no roomCode available");
      return;
    }
    try {
      await leaveLobbyRoom(this.roomCode);
      console.log("[lobby-room] leaveRoom success, resetting state");
      this.reset();
    } catch (err) {
      console.error("[lobby-room] leaveRoom failed:", err);
      logError("matchmaking_room_leave_failed", {}, err instanceof Error ? err : undefined);
      this.error = err instanceof Error ? err.message : "Failed to leave room";
      this.status = "error";
      console.log("[lobby-room] status changed to error after leave failure");
    }
  }

  /**
   * Update room state from server response (used for polling).
   * Called periodically to sync room state when not relying on WebSocket.
   */
  updateFromServerResponse(response: {
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
  }): void {
    console.log("[lobby-room] updateFromServerResponse", { response });

    if (!this.isInRoom) {
      console.warn("[lobby-room] updateFromServerResponse: not in room, ignoring update");
      return;
    }

    // Check if game has started (room status changed to "matched")
    if (
      response.status === "matched" &&
      this.status !== "starting" &&
      this.status !== "match_found"
    ) {
      // If we already have matchId/gameId (from a prior WS message or HTTP response), navigate
      if (this.matchId && this.gameId) {
        console.log("[lobby-room] game started via poll, navigating with stored IDs", {
          matchId: this.matchId,
          gameId: this.gameId,
        });
        this.status = "match_found";
        void this.navigateToMatch(this.matchId, this.gameId);
        return;
      }
      console.warn("[lobby-room] game started via poll but no matchId/gameId available yet", {
        currentStatus: this.status,
        roomStatus: response.status,
      });
      return;
    }

    // Update opponent name if we're the creator and joiner just appeared
    if (this.isCreator && response.joinerDisplayName && !this.opponentName) {
      console.log("[lobby-room] opponent joined via poll", {
        opponentName: response.joinerDisplayName,
      });
      this.opponentName = response.joinerDisplayName;
      this.opponentDeckName = response.joinerDeckName ?? null;
      this.opponentGameProfileId = null; // Will be updated via WebSocket with actual ID
      this.status = "opponent_joined";
    }

    // Update opponent name if we're the joiner
    if (response.isJoiner && response.creatorDisplayName && !this.creatorName) {
      console.log("[lobby-room] creator info updated via poll", {
        creatorName: response.creatorDisplayName,
      });
      this.creatorName = response.creatorDisplayName;
      this.creatorDeckName = response.creatorDeckName ?? null;
    }
  }

  /**
   * Handle lobby_player_joined WebSocket message (for room creator).
   */
  handlePlayerJoined(msg: {
    roomCode: string;
    joinerDisplayName: string;
    joinerGameProfileId: string;
  }): void {
    console.log("[lobby-room] handlePlayerJoined received", {
      roomCode: msg.roomCode,
      joinerDisplayName: msg.joinerDisplayName,
      joinerGameProfileId: msg.joinerGameProfileId,
      currentStatus: this.status,
      currentRoomCode: this.roomCode,
    });
    if (this.status !== "waiting") {
      console.warn("[lobby-room] handlePlayerJoined: ignoring message, status is not 'waiting'", {
        currentStatus: this.status,
        expectedStatus: "waiting",
      });
      return;
    }
    console.log("[lobby-room] handlePlayerJoined: updating opponent info", {
      opponentName: msg.joinerDisplayName,
      opponentGameProfileId: msg.joinerGameProfileId,
    });
    this.opponentName = msg.joinerDisplayName;
    this.opponentGameProfileId = msg.joinerGameProfileId;
    this.status = "opponent_joined";
    console.log("[lobby-room] status changed to opponent_joined", {
      roomCode: this.roomCode,
      opponentName: this.opponentName,
      status: this.status,
    });
  }

  /**
   * Handle lobby_room_cancelled WebSocket message (for joiner).
   */
  handleRoomCancelled(): void {
    console.log("[lobby-room] handleRoomCancelled received", {
      currentStatus: this.status,
      currentRoomCode: this.roomCode,
    });
    if (this.status !== "joined_waiting") {
      console.warn(
        "[lobby-room] handleRoomCancelled: ignoring message, status is not 'joined_waiting'",
        {
          currentStatus: this.status,
        },
      );
      return;
    }
    console.log("[lobby-room] room cancelled by host, changing to error state");
    this.error = "The room was cancelled by the host.";
    this.status = "error";
    this.roomCode = null;
  }

  /**
   * Handle lobby_player_left WebSocket message (for creator).
   */
  handlePlayerLeft(): void {
    console.log("[lobby-room] handlePlayerLeft received", {
      currentStatus: this.status,
      opponentName: this.opponentName,
    });
    if (this.status !== "opponent_joined") {
      console.warn(
        "[lobby-room] handlePlayerLeft: ignoring message, status is not 'opponent_joined'",
        {
          currentStatus: this.status,
        },
      );
      return;
    }
    console.log("[lobby-room] opponent left, clearing opponent info");
    this.opponentName = null;
    this.opponentGameProfileId = null;
    this.opponentDeckName = null;
    this.status = "waiting";
    console.log("[lobby-room] status changed back to waiting");
  }

  /**
   * Handle match_found WebSocket message (for both creator and joiner).
   */
  handleMatchFound(msg: { matchId: string; gameId: string; playerId?: string }): void {
    console.log("[lobby-room] match_found received", {
      matchId: msg.matchId,
      gameId: msg.gameId,
      playerId: msg.playerId,
      currentStatus: this.status,
      currentRoomCode: this.roomCode,
    });

    if (
      this.status !== "waiting" &&
      this.status !== "opponent_joined" &&
      this.status !== "starting" &&
      this.status !== "joined_waiting"
    ) {
      console.warn("[lobby-room] match_found: ignoring message, invalid status", {
        currentStatus: this.status,
        validStatuses: ["waiting", "opponent_joined", "starting", "joined_waiting"],
      });
      return;
    }

    console.log("[lobby-room] match_found: valid status, proceeding");
    this.matchId = msg.matchId;
    this.gameId = msg.gameId;
    this.status = "match_found";
    if (msg.playerId) {
      console.log("[lobby-room] saving ranked match session", {
        matchId: msg.matchId,
        gameId: msg.gameId,
        playerId: msg.playerId,
      });
      saveRankedMatchSession({
        matchId: msg.matchId,
        gameId: msg.gameId,
        gameProfileId: msg.playerId,
      });
    } else {
      console.warn("[lobby-room] match_found missing playerId, session not saved");
    }
    console.log("[lobby-room] navigating to match", { matchId: msg.matchId, gameId: msg.gameId });
    void this.navigateToMatch(msg.matchId, msg.gameId);
  }

  /** Navigate to a match route, setting the navigating guard flag. */
  async navigateToMatch(matchId: string, gameId?: string | null): Promise<void> {
    this.navigatingToMatch = true;
    try {
      if (gameId) {
        await goto(`/matches/${matchId}/games/${gameId}`);
      } else {
        await goto(`/matches/${matchId}`);
      }
    } catch {
      this.navigatingToMatch = false;
    }
  }

  reset(): void {
    console.log("[lobby-room] reset called", {
      previousStatus: this.status,
      previousRoomCode: this.roomCode,
    });
    this.status = "idle";
    this.roomCode = null;
    this.error = null;
    this.existingRoomCode = null;
    this.activeMatchId = null;
    this.matchId = null;
    this.gameId = null;
    this.isCreator = false;
    this.opponentName = null;
    this.opponentGameProfileId = null;
    this.creatorName = null;
    this.creatorDeckName = null;
    this.opponentDeckName = null;
    this.navigatingToMatch = false;
    console.log("[lobby-room] reset complete");
  }
}
