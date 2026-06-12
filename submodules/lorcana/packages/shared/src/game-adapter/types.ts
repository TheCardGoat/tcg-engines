/**
 * Per-match instance map: opaque card-instance ids to the public card id they
 * represent, plus the per-player owner index.
 *
 * Game-agnostic: every supported game produces the same shape from its own
 * deck-to-instances translator.
 */
export interface CardsMaps {
  /** instanceId → public card id (e.g. Lorcana short id). */
  cardInstances: Record<string, string>;
  /** playerId → instance ids owned by that player. */
  owners: Record<string, string[]>;
}

export interface DeckEntry {
  cardId: string;
  qty: number;
}

export interface DeckBuildInput {
  owner: string;
  deck: DeckEntry[];
}

export interface DeckCard {
  cardId: string;
  quantity: number;
}

export interface DeckFormatRule {
  kind: string;
  passed: boolean;
  message: string;
}

export interface DeckFormatResult {
  formatId: string;
  /** Human-readable format name for error messages (e.g. "Infinity"). Falls back to formatId when absent. */
  label?: string;
  valid: boolean;
  rules: DeckFormatRule[];
}

/**
 * Minimal card metadata exposed across games. Each game's adapter resolves a
 * `publicId` to one of these. `colors` is the game-native color/affiliation
 * concept (Lorcana inks, Magic mana colors, etc.), serialised as opaque
 * strings; consumers that care about the game-specific union narrow as needed.
 */
export interface CardSummary {
  publicId: string;
  colors: readonly string[];
}

/**
 * Games that have matchmaking, lobby, and play capabilities enabled.
 * All `gameSlug` parameters in the play module use this type.
 *
 * Kept in sync with `PLAYABLE_GAME_SLUGS` below — the runtime tuple
 * drives the gateway's namespace regex + game-server's GAME_SLUG env
 * validation, and it must enumerate every member of this union.
 */
export type PlayableGameSlug = "lorcana" | "gundam" | "cyberpunk" | "riftbound" | "one-piece";

/**
 * Runtime enumeration of every playable game slug. Source of truth for
 * the gateway's namespace allowlist and any value-level slug validation.
 * Order is intentional: matches the static type union member order so
 * a satisfy-check below catches drift if either side is updated alone.
 */
export const PLAYABLE_GAME_SLUGS = [
  "lorcana",
  "gundam",
  "cyberpunk",
  "riftbound",
  "one-piece",
] as const satisfies readonly PlayableGameSlug[];

/** Type guard: narrows arbitrary strings into `PlayableGameSlug`. */
export function isPlayableGameSlug(value: unknown): value is PlayableGameSlug {
  return typeof value === "string" && (PLAYABLE_GAME_SLUGS as readonly string[]).includes(value);
}

/**
 * The contract a game must satisfy to participate in the play module's
 * matchmaking, lobby, and match flows. Lives behind a slug-keyed registry
 * so {@link match-service}, {@link matchmaking-service}, and friends stay
 * game-agnostic.
 */
export interface GameAdapter {
  /** Slug used in URLs and persistence (e.g. "lorcana"). */
  readonly slug: PlayableGameSlug;
  /** Mint a fresh per-match instance gameId. Format is opaque. */
  createGameId(): string;
  /** Derive an offline-friendly display name from a stable gameProfileId. */
  generateUserName(gameProfileId: string): string;
  /** Convert deck entries (per player) into the per-match instance map. */
  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps;
  /** Look up a card by its public id; returns null when unknown. */
  getCardById(publicId: string): CardSummary | null;
  /**
   * Validate a deck against a format. Returns the per-rule breakdown; throws
   * when the format id is unknown for this game.
   */
  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult;

  // ── Server engine lifecycle (game-server only) ─────────────────────
  //
  // The play module calls these to create, persist, and restore engines
  // without knowing the underlying engine type. Adapters that don't host
  // server-authoritative play (e.g. read-only catalog adapters) may omit
  // these — the play module checks for them and refuses to seat a match.

  /** Create a fresh, fully-initialised server engine for a new game. */
  createServerEngine?(
    input: import("../game-engine/types").ServerEngineCreateInput,
  ): Promise<import("../game-engine/types").ServerGameEngine>;

  /**
   * Build a persistence envelope from a live engine. The play module writes
   * the returned object into Redis as opaque JSON.
   */
  serializeEngine?(
    engine: import("../game-engine/types").ServerGameEngine,
    cardsMaps: CardsMaps,
  ): import("../game-engine/types").EngineSnapshot;

  /** Recreate a live engine from a previously serialised snapshot. */
  restoreEngine?(
    snapshot: import("../game-engine/types").EngineSnapshot,
    context: import("../game-engine/types").ServerEngineRestoreContext,
  ): Promise<import("../game-engine/types").ServerGameEngine>;

  /**
   * Pull the cardsMaps out of a serialised snapshot without instantiating an
   * engine — used by post-game tooling and runtime cache warm paths.
   */
  extractCardsMapsFromSnapshot?(snapshot: import("../game-engine/types").EngineSnapshot): CardsMaps;
}

/**
 * Adapter narrowed to the methods the game-server needs. Use
 * {@link requireServerGameAdapter} to get this type from the registry.
 */
export type ServerGameAdapter = Required<
  Pick<
    GameAdapter,
    "createServerEngine" | "serializeEngine" | "restoreEngine" | "extractCardsMapsFromSnapshot"
  >
> &
  GameAdapter;
