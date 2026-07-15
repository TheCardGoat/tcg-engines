export type MatchGameSummary = {
  gameNumber: number;
  result: "seat1_win" | "seat2_win" | "draw";
  playerSeat: number;
  onThePlaySeat: number | null;
  durationSeconds: number | null;
};

export type MatchSummary = {
  matchId: string;
  result: "win" | "loss" | "draw";
  opponentDisplayName: string | null;
  opponentDeckColorMask: number | null;
  playerDeckColorMask: number | null;
  playerDeckName: string | null;
  playerDeckListId: string | null;
  bestOf: number;
  formatId: string | null;
  matchType: "ranked" | "casual" | "testing" | "practice_vs_bot" | "private" | null;
  mmrBefore: number | null;
  mmrAfter: number | null;
  durationSeconds: number | null;
  completedAt: string;
  games: MatchGameSummary[];
  note: string;
};

export type MatchListResponse = {
  matches: MatchSummary[];
  nextCursor: string | null;
};

export type PlayerStatsByFormat = {
  formatId: string;
  mmr: number;
  highestMmr: number | null;
  bracket: string | null;
  gamesPlayed: number;
  gamesWon: number;
  losses: number;
  currentWinStreak: number;
  currentLossStreak: number;
};

export type PlayerStats = {
  gamesPlayed: number;
  gamesWon: number;
  losses: number;
  winRate: number;
  currentWinStreak: number;
  highestWinStreak: number;
  currentLossStreak: number;
  highestLossStreak: number;
  mmr: number | null;
  highestMmr: number | null;
  bracket: string | null;
  gamesToday: number;
  gamesThisWeek: number;
  recentResults: Array<"win" | "loss" | "draw">;
  takebacksGranted: number;
  takebacksReceived: number;
  sportsmanshipTier: string | null;
  byFormat: PlayerStatsByFormat[];
};

export type MmrHistoryPoint = {
  matchId: string;
  mmr: number;
  completedAt: string;
};

export type PlayingStreak = {
  currentStreak: number;
  longestStreak: number;
  lastPlayDate: string | null;
  recentActiveDates: string[];
  streakMultiplier: number;
  nextTier: { days: number; multiplier: number } | null;
};

export type DeckMatchupRow = {
  opponentDeckColorMask: number | null;
  matchCount: number;
  matchWins: number;
  matchWinRate: number | null;
  gamesTotal: number;
  otpPlayed: number;
  otpWins: number;
  otpRate: number | null;
  otdPlayed: number;
  otdWins: number;
  otdRate: number | null;
  isMirror: boolean;
  contribution: number;
};

export type PlayerDeckEntry = {
  deckListId: string | null;
  deckColorMask: number | null;
  deckName: string | null;
  matchCount: number;
};

export type Milestone = {
  id: string;
  unlocked: boolean;
  unlockedAt: string | null;
  /**
   * Normalized progress toward the criterion, in the closed interval [0, 1].
   * The server clamps server-side via `clamp01(value / target)`, so consumers
   * can render `progress * 100` directly. `target` below is the raw threshold
   * (e.g. `5` for "win 5 in a row") shown in copy, not used for normalization.
   */
  progress: number;
  /** Raw threshold magnitude — informational, e.g. `5` for "win 5 in a row". */
  target: number;
};

export type MilestonesResponse = {
  milestones: Milestone[];
};

export type DeckRundownResponse = {
  decks: PlayerDeckEntry[];
  matchups: DeckMatchupRow[];
  globalMatchWins: number;
  globalMatchTotal: number;
  globalOnPlayWins: number;
  globalOnPlayN: number;
};
