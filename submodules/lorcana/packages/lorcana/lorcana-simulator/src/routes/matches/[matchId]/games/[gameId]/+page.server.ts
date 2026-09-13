import { isRedirect, redirect, type ServerLoadEvent } from "@sveltejs/kit";
import { base } from "$app/paths";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { replayRoutePath } from "$lib/navigation/replay-route-path.js";
import { serializeErrorDetails } from "$lib/server/error-details.js";
import { getServerApiOrigin } from "$lib/server/fetch-with-cf.js";
import { ServerJsonError, serverJson, serverJsonOrNull } from "$lib/data/server/server-json.js";
import { LiveMatchBootstrapV1Schema, type LiveMatchBootstrapV1 } from "@tcg/game-page-contract";

export interface GameContextParticipant {
  id: string;
  seat: number;
  userId?: string;
  isBot?: boolean;
  displayName: string;
  mmrAtMatch?: number;
  bracketId?: string;
  deckColorMask?: number;
  visualSettings?: {
    cardBack?: string;
    playmat?: string;
  };
  isMobile?: boolean;
  subscriptionTier?: string;
}

export interface GameContextMatch {
  matchId: string;
  gameType: string;
  format: string;
  status: string;
  matchType?: string;
  authority?: string;
  queueFormatId?: string;
  player1Score: number;
  player2Score: number;
  currentGameId?: string;
  gameIds: string[];
  winnerId?: string;
  createdAt: string;
  updatedAt: string;
  participants: GameContextParticipant[];
}

export interface GameContextGame {
  gameId: string;
  gameNumber: number;
  status: string;
  authority: string;
  state: unknown;
  version: number;
  cardsMaps: unknown;
}

import type { ServerGameplaySettings } from "$lib/features/settings/player-settings-store.svelte.js";

export interface UserSettingsPayload {
  playerSettings?: ServerGameplaySettings;
  gameSettings?: {
    lorcana?: {
      visual?: { cardBackId?: string; playmatId?: string };
      simulator?: Pick<
        ServerGameplaySettings,
        "primaryClickAction" | "cardInfoMode" | "priorityNudgeEnabled"
      >;
    };
  };
  visualSettings?: { cardBack?: string; playmat?: string };
  gameplaySettings?: ServerGameplaySettings;
  theme?: string;
  resolvedGameplaySettings?: ServerGameplaySettings;
}

export type GameSubMode = "bot" | "human-vs-human";

export type GamePageData =
  | { mode: "local" }
  | { mode: "error"; matchId: string; gameId: string; spectate: boolean; message: string }
  | {
      mode: "server";
      matchId: string;
      gameId: string;
      spectate: boolean;
      gameSubMode: GameSubMode;
      bootstrap: LiveMatchBootstrapV1;
      match: GameContextMatch;
      game: GameContextGame;
      userSettings?: UserSettingsPayload;
    };

export async function load(event: ServerLoadEvent): Promise<GamePageData> {
  const { params, request } = event;
  const matchId = params.matchId as string;
  const gameId = params.gameId as string;

  // Local mode — no server fetch needed
  if (matchId === "local" || gameId === "local") {
    return { mode: "local" };
  }

  // Server mode — fetch match context and user settings in parallel
  const generalApi = getServerApiOrigin(getApiOrigin());
  const authApiOrigin = getServerApiOrigin(getApiOrigin());
  const contextUrl = `${generalApi}/v1/games/lorcana/play/matches/${matchId}/games/${gameId}/context`;
  const settingsUrl = `${authApiOrigin}/v1/users/me/settings`;

  const cookie = request.headers.get("cookie") ?? "";
  const headers = { Accept: "application/json", ...(cookie ? { cookie } : {}) };
  let operation = "loading match context";

  try {
    const [contextResult, settingsResult] = await Promise.allSettled([
      serverJson<unknown>(contextUrl, { method: "GET", headers }),
      serverJsonOrNull<UserSettingsPayload>(settingsUrl, { method: "GET", headers }),
    ]);

    if (contextResult.status !== "fulfilled") {
      const contextStatus =
        contextResult.reason instanceof ServerJsonError ? contextResult.reason.status : null;

      if (contextStatus === 404) {
        operation = "checking for a durable replay after a missing match context";
        const replay = await serverJsonOrNull<{ gameId: string }>(
          `${generalApi}/v1/games/lorcana/play/replays/${encodeURIComponent(gameId)}`,
          { method: "GET", headers },
        );
        if (replay) {
          redirect(303, replayRoutePath(gameId, base));
        }
        console.info("[game-page-server] context expired {*}", {
          event: "game-page.context_expired",
          matchId,
          gameId,
          contextUrl,
          spectate: false,
        });
      } else {
        console.error("[game-page-server] context fetch failed {*}", {
          operation,
          matchId,
          gameId,
          contextUrl,
          status: contextStatus,
          statusText:
            contextResult.reason instanceof ServerJsonError
              ? contextResult.reason.statusText
              : null,
          error: serializeErrorDetails(contextResult.reason),
          spectate: false,
        });
      }

      return {
        mode: "error",
        matchId,
        gameId,
        spectate: false,
        message: "Match not found. It may have expired.",
      };
    }

    operation = "validating match context response";
    const bootstrap = LiveMatchBootstrapV1Schema.parse(contextResult.value);

    if (bootstrap.match.status === "completed") {
      operation = "checking for a durable replay after match completion";
      const replay = await serverJsonOrNull<{ gameId: string }>(
        `${generalApi}/v1/games/lorcana/play/replays/${encodeURIComponent(gameId)}`,
        { method: "GET", headers },
      );
      if (replay) {
        redirect(303, replayRoutePath(gameId, base));
      }
    }

    const ctx = toLegacyContext(bootstrap);
    const spectate = bootstrap.viewer.role === "spectator";
    const rawUserSettings =
      settingsResult.status === "fulfilled" ? (settingsResult.value ?? undefined) : undefined;
    const userSettings = rawUserSettings
      ? {
          ...rawUserSettings,
          resolvedGameplaySettings: {
            ...rawUserSettings.gameplaySettings,
            ...rawUserSettings.playerSettings,
            ...rawUserSettings.gameSettings?.lorcana?.simulator,
          },
        }
      : undefined;
    // Detect bot match server-side: match type is practice_vs_bot, or any participant without a userId is a bot seat.
    const gameSubMode: GameSubMode =
      ctx.match.matchType === "practice_vs_bot" ||
      (ctx.match.participants as GameContextParticipant[]).some((p) => p.isBot)
        ? "bot"
        : "human-vs-human";

    const response: GamePageData = {
      mode: "server",
      matchId,
      gameId,
      spectate,
      gameSubMode,
      bootstrap,
      match: ctx.match,
      game: ctx.game,
      userSettings,
    };

    return response;
  } catch (error) {
    if (isRedirect(error)) throw error;
    console.error("[game-page-server] context fetch error {*}", {
      operation,
      matchId,
      gameId,
      contextUrl,
      error: serializeErrorDetails(error),
    });
    return {
      mode: "error",
      matchId,
      gameId,
      spectate: false,
      message: "Failed to connect to the game server.",
    };
  }
}

function toLegacyContext(bootstrap: LiveMatchBootstrapV1): {
  match: GameContextMatch;
  game: GameContextGame;
} {
  const scores = bootstrap.match.scores ?? {};
  const participants: GameContextParticipant[] = bootstrap.match.participants.map(
    (participant) => ({
      id: participant.id,
      seat: participant.seat,
      ...(participant.userId ? { userId: participant.userId } : {}),
      ...(participant.isBot ? { isBot: true } : {}),
      displayName: participant.displayName,
      ...(participant.mmrAtMatch !== undefined ? { mmrAtMatch: participant.mmrAtMatch } : {}),
      ...(participant.visualSettings
        ? {
            visualSettings: {
              ...(participant.visualSettings.cardBackId
                ? { cardBack: participant.visualSettings.cardBackId }
                : {}),
              ...(participant.visualSettings.playmatId
                ? { playmat: participant.visualSettings.playmatId }
                : {}),
            },
          }
        : {}),
      ...(participant.isMobile !== undefined ? { isMobile: participant.isMobile } : {}),
      ...(participant.subscriptionTier ? { subscriptionTier: participant.subscriptionTier } : {}),
    }),
  );
  const playerOneId = participants.find((participant) => participant.seat === 1)?.id;
  const playerTwoId = participants.find((participant) => participant.seat === 2)?.id;
  return {
    match: {
      matchId: bootstrap.match.matchId,
      gameType: bootstrap.match.gameType,
      format: bootstrap.match.format,
      status: bootstrap.match.status,
      matchType: bootstrap.match.matchType,
      authority: bootstrap.game.authority,
      player1Score: playerOneId ? (scores[playerOneId] ?? 0) : 0,
      player2Score: playerTwoId ? (scores[playerTwoId] ?? 0) : 0,
      currentGameId: bootstrap.match.status === "in_progress" ? bootstrap.game.gameId : undefined,
      gameIds: bootstrap.match.gameIds,
      ...(bootstrap.match.winnerId ? { winnerId: bootstrap.match.winnerId } : {}),
      createdAt: "",
      updatedAt: "",
      participants,
    },
    game: {
      gameId: bootstrap.game.gameId,
      gameNumber: bootstrap.game.gameNumber,
      status: bootstrap.game.status,
      authority: bootstrap.game.authority,
      state: bootstrap.game.view,
      version: bootstrap.game.stateVersion,
      cardsMaps:
        bootstrap.game.resources &&
        typeof bootstrap.game.resources === "object" &&
        "cardsMaps" in bootstrap.game.resources
          ? bootstrap.game.resources.cardsMaps
          : undefined,
    },
  };
}
