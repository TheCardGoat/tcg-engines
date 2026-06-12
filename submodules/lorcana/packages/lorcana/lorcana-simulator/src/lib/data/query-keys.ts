export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  matchmaking: {
    context: () => ["matchmaking", "context"] as const,
    engagement: () => ["matchmaking", "engagement"] as const,
    dashboard: (limit: number) => ["matchmaking", "dashboard", limit] as const,
    queueStats: () => ["matchmaking", "queue-stats"] as const,
    liveMatches: (limit: number, filtersKey: string) =>
      ["matchmaking", "live-matches", limit, filtersKey] as const,
    status: () => ["matchmaking", "status"] as const,
    lobbyRoom: (roomCode: string) => ["matchmaking", "lobby-room", roomCode] as const,
    leaderboard: (
      gameSlug: string,
      type: string,
      gameProfileId: string | undefined,
      limit: number,
    ) => ["matchmaking", "leaderboard", gameSlug, type, gameProfileId ?? "anon", limit] as const,
  },
  matchHistory: {
    playerStats: () => ["match-history", "player-stats"] as const,
    matches: (
      cursor: string | undefined,
      limit: number | undefined,
      deckListId: string | undefined,
    ) =>
      [
        "match-history",
        "matches",
        cursor ?? "start",
        limit ?? "default",
        deckListId ?? "all",
      ] as const,
    mmrHistory: () => ["match-history", "mmr-history"] as const,
    playingStreak: () => ["match-history", "playing-streak"] as const,
    postGame: (gameId: string) => ["match-history", "post-game", gameId] as const,
  },
  gateway: {
    ticket: () => ["gateway", "ticket"] as const,
    quickMatchTicket: (matchId: string, playerId: string) =>
      ["gateway", "quick-match-ticket", matchId, playerId] as const,
  },
  replay: {
    blob: (gameId: string) => ["replay", "blob", gameId] as const,
  },
} as const;
