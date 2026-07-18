import { isRedirect, redirect, type ServerLoadEvent } from "@sveltejs/kit";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { getServerApiOrigin } from "$lib/server/fetch-with-cf.js";
import { ServerJsonError, serverJson, serverJsonOrNull } from "$lib/data/server/server-json.js";

export interface GameContextParticipant {
  id: string;
  seat: number;
  userId?: string;
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
      match: GameContextMatch;
      game: GameContextGame;
      userSettings?: UserSettingsPayload;
    };

export async function load(event: ServerLoadEvent): Promise<GamePageData> {
  const { params, url, request } = event;
  const matchId = params.matchId as string;
  const gameId = params.gameId as string;
  const spectate = url.searchParams.has("spectate");

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

  try {
    const [contextResult, settingsResult] = await Promise.allSettled([
      serverJson<{
        match: GameContextMatch;
        game: GameContextGame;
      }>(contextUrl, { method: "GET", headers }),
      serverJsonOrNull<UserSettingsPayload>(settingsUrl, { method: "GET", headers }),
    ]);

    if (contextResult.status !== "fulfilled") {
      const contextStatus =
        contextResult.reason instanceof ServerJsonError ? contextResult.reason.status : null;

      if (contextStatus === 404) {
        const replay = await serverJsonOrNull<{ gameId: string }>(
          `${generalApi}/v1/games/lorcana/play/replays/${encodeURIComponent(gameId)}`,
          { method: "GET", headers },
        );
        if (replay) {
          redirect(303, `/replay/${encodeURIComponent(gameId)}`);
        }
      }

      console.error("[game-page-server] context fetch failed {*}", {
        matchId,
        gameId,
        contextUrl,
        status: contextStatus,
        statusText:
          contextResult.reason instanceof ServerJsonError ? contextResult.reason.statusText : null,
        error: contextResult.reason instanceof Error ? contextResult.reason.message : "unknown",
        spectate,
      });

      return {
        mode: "error",
        matchId,
        gameId,
        spectate,
        message: "Match not found. It may have expired.",
      };
    }

    const ctx = contextResult.value;
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
      (ctx.match.participants as GameContextParticipant[]).some((p) => !p.userId)
        ? "bot"
        : "human-vs-human";

    const response: GamePageData = {
      mode: "server",
      matchId,
      gameId,
      spectate,
      gameSubMode,
      match: ctx.match,
      game: ctx.game,
      userSettings,
    };

    return response;
  } catch (error) {
    if (isRedirect(error)) throw error;
    console.error("[game-page-server] context fetch error {*}", {
      matchId,
      gameId,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      mode: "error",
      matchId,
      gameId,
      spectate,
      message: "Failed to connect to the game server.",
    };
  }
}
