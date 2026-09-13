import type {
  PresentationBundle,
  PresentationCatalogReference,
  PresentationRecords,
  PresentationBindings,
} from "@tcg/protocol/presentation";
import type { PlayableGameSlug } from "@tcg/protocol/games";
import type {
  DeckDocument,
  DeckDocumentDiagnostic,
  DeckDocumentEntryV1,
  DeckDocumentJsonObject,
  DeckDocumentV1,
  DeckDocumentV2,
} from "@tcg/game-page-contract/deck-document";
export type { PlayableGameSlug } from "@tcg/protocol/games";

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
  /**
   * Optional per-instance deck-section assignment (e.g. "main", "resource",
   * "side", "leader", "don"). Populated by adapters that receive section-aware
   * deck input. When present, server engines SHOULD trust this over
   * catalog-derived card type so the deck builder remains the single source of
   * truth for deck topology. Omitting it preserves legacy behavior.
   */
  instanceSections?: Record<string, string>;
  /**
   * Persistent rules-significant deck declarations, keyed by owner. These are
   * copied from DeckDocumentV2 without generic interpretation so the owning
   * game can consume choices such as a starting Champion.
   */
  deckDeclarationsByOwnerId?: Record<string, DeckDocumentJsonObject>;
  /**
   * Presentation overlay. Gameplay identity stays in `cardInstances`; this map
   * carries the printing chosen for each concrete instance or setup slot.
   */
  presentation?: {
    printingIdByInstanceId: Record<string, string>;
    printingIdBySetupSlotByOwnerId?: Record<string, Record<string, string>>;
  };
}

export interface DeckEntry {
  cardId: string;
  qty: number;
  /** Game-owned deck section such as "main", "resource", "side", "leader", or "don". */
  sectionId?: string;
  /** Presentation printing; omitted when the card id is already the printing. */
  printingId?: string;
}

export interface DeckBuildInput {
  owner: string;
  deck: DeckEntry[];
}

/** Section-preserving saved deck snapshot supplied to a game-owned pregame. */
export interface PregameDeckInput {
  readonly formatId: string;
  readonly deckVersionId?: string;
  readonly mainDeck: readonly DeckCard[];
  readonly inventory: readonly DeckCard[];
}

export interface PregameValidationResult {
  readonly valid: boolean;
  readonly issues: readonly { readonly code: string; readonly message: string }[];
}

/** Values which may cross the platform's JSON/Redis persistence boundary. */
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

/** Narrow an opaque adapter value without allowing lossy JSON coercion. */
export function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) {
    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.length !== value.length + 1 || !ownKeys.includes("length")) return false;
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.hasOwn(value, index) || !isJsonValue(value[index])) return false;
    }
    return ownKeys.every(
      (key) => key === "length" || (typeof key === "string" && /^\d+$/.test(key)),
    );
  }
  if (typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  return Object.values(value).every(isJsonValue);
}

export function parseJsonValue(value: unknown): JsonValue {
  if (!isJsonValue(value)) throw new Error("Value is not losslessly JSON-serializable");
  return value;
}

/**
 * Game-native pregame bridge. The shared play service persists pool and
 * selection values as opaque JSON and never interprets game rules.
 */
export interface GamePregameAdapter {
  readonly kind: string;
  /** Duration of the one preparation timer, in milliseconds. */
  readonly deadlineMs: number;
  readonly defaultFormatId: string;
  /** Omitted: choose turn order before selection. Other games randomize game one and allow later sideboarding before the loser declares order. */
  readonly turnOrderPolicy?: "random-then-loser-choice";
  /** Advance game-owned registration state while retaining the immutable match pool. */
  nextGamePool?(pool: JsonValue, previousSelection: JsonValue): JsonValue;
  /** Build the private, persisted pool. Runtime definitions must not be included. */
  createPool(input: PregameDeckInput): JsonValue;
  /** Validate and normalize a pool loaded from an untrusted persistence boundary. */
  parsePool(value: unknown): JsonValue;
  /** Validate and normalize a player selection before it is persisted. */
  parseSelection(value: unknown): JsonValue;
  /** Build the private JSON response shown only to the owning player. */
  projectPoolForPlayer(pool: JsonValue): JsonValue;
  createDefaultSelection(pool: JsonValue): JsonValue;
  validateSelection(pool: JsonValue, selection: JsonValue): PregameValidationResult;
  reconcileSelection(
    pool: JsonValue,
    selection: JsonValue,
  ): { readonly selection: JsonValue; readonly validation: PregameValidationResult };
  /** Cards which become owned match instances after the selection locks. */
  materializeDeck(pool: JsonValue, selection: JsonValue): readonly DeckEntry[];
}

export interface DeckCard {
  cardId: string;
  /** Stable gameplay identity shared by every printing. */
  canonicalId?: string;
  /** Optional cosmetic/physical printing selection. */
  printingId?: string;
  /** Game-owned deck section such as `main`, `resource`, or `side`. */
  sectionId?: string;
  quantity: number;
}

export interface DeckInterchangeResult {
  deck: DeckCard[];
  diagnostics: DeckDocumentDiagnostic[];
  declarations?: DeckDocumentJsonObject;
  appearance?: DeckDocumentJsonObject;
}

export type DeckDocumentValidationMode = "draft" | "registration";

export interface DeckDocumentProjectionOptions {
  readonly role?: DeckFormatSectionRole;
  /**
   * Draft validation preserves incomplete saved work. Registration validation
   * additionally enforces format counts and required declarations/appearance.
   */
  readonly validationMode?: DeckDocumentValidationMode;
}

export type DeckDocumentSections<TSection extends string> = Readonly<
  Partial<Record<TSection, readonly DeckDocumentEntryV1[]>>
>;

export type DeckFormatSectionRole = "validation" | "runtime";

export interface DeckFormatSectionDefinition<TSection extends string = string> {
  readonly id: TSection;
  readonly roles: readonly DeckFormatSectionRole[];
  readonly required: boolean;
  /** Stable localization key or game-native fallback label for builder clients. */
  readonly label: string;
  readonly exactCards?: number;
  readonly minimumCards?: number;
  readonly maximumCards?: number;
  /** Non-contiguous legal totals, for example a Riftbound sideboard of 0 or 8. */
  readonly allowedCardCounts?: readonly number[];
}

export type DeckFormatExtensionFieldKind =
  | "card-reference"
  | "printing-reference"
  | "string"
  | "number"
  | "boolean"
  | "json";

/**
 * A format-owned root extension field. These fields deliberately live beside
 * section definitions: declarations and cosmetics are not registered copies.
 */
export interface DeckFormatExtensionFieldDefinition<TSection extends string = string> {
  /** Dot-separated path below `declarations` or `appearance`. */
  readonly id: string;
  readonly label: string;
  readonly kind: DeckFormatExtensionFieldKind;
  /** Completion requirement for builders/legality, not for empty drafts. */
  readonly required: boolean;
  /** Optional registered section from which a card reference must be selected. */
  readonly sourceSectionId?: TSection;
}

export interface DeckFormatDefinition<
  TFormat extends string = string,
  TSection extends string = string,
> {
  readonly id: TFormat;
  /**
   * A format id identifies one immutable rules interpretation. Breaking rule
   * changes require a new id so persisted documents are never reinterpreted.
   */
  readonly label: string;
  readonly sections: readonly DeckFormatSectionDefinition<TSection>[];
  readonly declarationFields?: readonly DeckFormatExtensionFieldDefinition<TSection>[];
  readonly appearanceFields?: readonly DeckFormatExtensionFieldDefinition<TSection>[];
}

/**
 * Game-owned bridge between flat platform deck entries and the versioned
 * cross-game interchange document. Shared consumers preserve section ids and
 * printing choices; each game decides how those map to native deck rules.
 */
export interface DeckInterchangeAdapter<
  TGame extends DeckDocumentV1["game"] = DeckDocumentV1["game"],
  TSection extends string = string,
  TFormat extends string = string,
> {
  readonly game: TGame;
  readonly defaultFormatId: TFormat;
  readonly formats: Readonly<Record<TFormat, DeckFormatDefinition<TFormat, TSection>>>;
  getFormatDefinition(formatId: string): DeckFormatDefinition<TFormat, TSection> | null;
  createDocument(input: {
    formatId?: TFormat;
    name?: string;
    sections: DeckDocumentSections<TSection>;
    declarations?: DeckDocumentJsonObject;
    appearance?: DeckDocumentJsonObject;
  }): DeckDocumentV2<TGame, TFormat, TSection>;
  createEmptyDocument(input?: {
    formatId?: TFormat;
    name?: string;
  }): DeckDocumentV2<TGame, TFormat, TSection>;
  validateDocument(
    document: DeckDocumentV2<TGame, TFormat, TSection>,
    options?: { validationMode?: DeckDocumentValidationMode },
  ): DeckDocumentDiagnostic[];
  migrateDocument(
    document: DeckDocument,
  ):
    | { ok: true; document: DeckDocumentV2<TGame, TFormat, TSection> }
    | { ok: false; diagnostics: DeckDocumentDiagnostic[] };
  projectDocument(
    document: DeckDocument,
    options?: DeckDocumentProjectionOptions,
  ): DeckInterchangeResult;
  toDocument(input: {
    formatId: TFormat;
    name?: string;
    deck: ReadonlyArray<DeckCard>;
  }): DeckDocumentV2<TGame, TFormat, TSection>;
  fromDocument(document: DeckDocument): DeckInterchangeResult;
}

export type DeckMetadataFacetKind = "identity" | "individual" | "combination";

export interface DeckMetadataFacetDefinition {
  /** Stable, game-owned identifier such as `legend`, `leader`, or `color`. */
  type: string;
  /** Default vocabulary for API clients that do not provide localized copy. */
  label: string;
  pluralLabel: string;
  kind: DeckMetadataFacetKind;
  /** Lower values appear first in capability-driven clients. */
  order: number;
  /** Engagement projections this game-owned facet is eligible to produce. */
  ranking: {
    /** Seasonal Elo derived from completed ranked matches. */
    specialistSkill: boolean;
    /** Lifetime and period progress derived from completed PvP matches. */
    mastery: boolean;
  };
}

export interface DeckMetadataMember {
  cardId: string;
  label: string;
  colors: string[];
  imageUrl?: string | null;
  /** Small game-owned display facts; never interpreted by shared analytics. */
  attributes?: Record<string, string | number | boolean>;
}

export interface DeckMetadataFacet {
  type: string;
  /** Deterministic within a game and projection version. */
  key: string;
  label: string;
  colors: string[];
  members?: DeckMetadataMember[];
}

/**
 * Immutable, game-neutral deck facts captured when a match participant is
 * seated. Daily analytics are disposable projections of this snapshot.
 */
export interface DeckMetadataProjection {
  schemaVersion: 1;
  projectionVersion: number;
  game: PlayableGameSlug;
  cardCount: number;
  colors: string[];
  facets: DeckMetadataFacet[];
}

export interface GameMetadataCapabilities {
  colors: boolean;
  deckLists: boolean;
  archetypes: boolean;
}

export interface GameMetadataAdapter {
  /** Bump whenever facet keys or their meaning changes. */
  projectionVersion: number;
  capabilities: GameMetadataCapabilities;
  facets: readonly DeckMetadataFacetDefinition[];
  projectDeck(deck: ReadonlyArray<DeckCard>): DeckMetadataProjection;
  normalizeTemplate(deck: ReadonlyArray<DeckCard>): DeckCard[];
  normalizeSynergy(deck: ReadonlyArray<DeckCard>): DeckCard[];
}

export interface DeckFormatRule {
  kind: string;
  passed: boolean;
  message: string;
  details?: unknown;
}

export interface DeckFormatResult {
  formatId: string;
  /** Human-readable format name for error messages (e.g. "Infinity"). Falls back to formatId when absent. */
  label?: string;
  valid: boolean;
  rules: DeckFormatRule[];
}

/** A game-owned, opponent-visible deck identity such as a Leader or Hero. */
export interface MatchmakingDeckIdentity {
  id: string;
  label: string;
  imageUrl?: string | null;
}

/** Optional matchmaking identity capability for games with a single deck-defining card. */
export interface MatchmakingIdentityAdapter {
  /** Extract the one identity represented by an already validated deck. */
  getDeckIdentity(deck: ReadonlyArray<DeckCard>): MatchmakingDeckIdentity | null;
  /** List identities that may be selected as an opponent filter for a format. */
  listOpponentIdentities(formatId: string): readonly MatchmakingDeckIdentity[];
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
  label?: string;
  imageUrl?: string | null;
}

/**
 * Runtime package fingerprint for a game adapter. Exposed in API headers so a
 * browser bundle and server process can be compared during rolling deploys.
 */
export interface GameRuntimeFingerprint {
  game: PlayableGameSlug;
  runtimeHash: string;
  engine?: {
    packageName: string;
    version?: string;
    hash: string;
    metadata?: Record<string, string | number | boolean>;
  };
  cards?: {
    packageName: string;
    version?: string;
    hash: string;
    metadata?: Record<string, string | number | boolean>;
  };
}

/** Format-validation facts which are not registered card copies. */
export interface DeckValidationContext {
  readonly declarations?: DeckDocumentJsonObject;
  readonly appearance?: DeckDocumentJsonObject;
}

/**
 * The contract a game must satisfy to participate in the play module's
 * matchmaking, lobby, and match flows. Lives behind a slug-keyed registry
 * so {@link match-service}, {@link matchmaking-service}, and friends stay
 * game-agnostic.
 */
/** Optional presentation-only capability. Game-native state is narrowed by its adapter. */
export interface GamePresentationAdapter {
  prepare(inputs: readonly DeckBuildInput[]): Promise<PresentationBundle>;
  collectReferences(state: unknown, cardsMaps: CardsMaps): readonly string[];
  resolve(
    catalog: PresentationCatalogReference,
    references: readonly string[],
    printingIds: readonly string[],
  ): Promise<PresentationRecords>;
  projectBindings(
    state: unknown,
    resources: unknown,
    cardsMaps: CardsMaps,
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): PresentationBindings;
}

export interface GameAdapter {
  presentation?: GamePresentationAdapter;
  /** Game-owned practice fixtures, already resolved to canonical deck entries. */
  readonly practiceDecks?: {
    readonly ids: readonly string[];
    getDeck(id: string): readonly DeckCard[] | undefined;
  };
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
   * Resolves a game-native runtime public id (e.g. an engine cardId or instance
   * id) to the card's canonical id — the stable cross-printing gameplay identity.
   *
   * Used by cross-game systems (analytics, meta stats, deck hashing) to group
   * all printings/arts of the same card under one key. Implementations should
   * resolve any authored/printing id to its canonical id (e.g. Cyberpunk must
   * apply the merged-slug canonicalization; Gundam must strip the parallel-art
   * suffix from `cardNumber`).
   *
   * Optional: games that have not yet adopted the unified card model leave this
   * unimplemented. Callers MUST null-check and fall back to the raw publicId
   * when this returns null (or is absent).
   *
   * @returns the canonical id, or `null` if the publicId is unknown or the
   *          adapter does not support canonical resolution.
   */
  getCanonicalCardId?(publicId: string): string | null;
  /** Return the adapter's runtime package fingerprint for diagnostics. */
  getRuntimeFingerprint?(): GameRuntimeFingerprint;
  /**
   * Extract the game's current public score from a spectator-safe projection.
   * Values are keyed by game profile id so shared surfaces can align them to
   * seats without understanding game-native state.
   */
  getPublicGameScore?(spectatorView: unknown):
    | {
        kind: string;
        players: Record<string, number>;
      }
    | undefined;
  /**
   * Validate a deck against a format. Returns the per-rule breakdown; throws
   * when the format id is unknown for this game.
   */
  validateDeckForFormat(
    formatId: string,
    deck: ReadonlyArray<DeckCard>,
    context?: DeckValidationContext,
  ): DeckFormatResult;
  /** Game-owned identity filters used by matchmaking; omitted for games without one. */
  readonly matchmakingIdentity?: MatchmakingIdentityAdapter;
  /** Optional server-authoritative start-of-game selection lifecycle. */
  readonly pregame?: GamePregameAdapter;
  /** Optional versioned import/export bridge for builders and practice links. */
  readonly deckInterchange?: DeckInterchangeAdapter;
  /** Game-owned projection into the shared metadata analytics contract. */
  readonly metadata?: GameMetadataAdapter;

  // ── Server engine lifecycle (game-server only) ─────────────────────
  //
  // The play module calls these to create, persist, and restore engines
  // without knowing the underlying engine type. Adapters that don't host
  // server-authoritative play (e.g. read-only catalog adapters) may omit
  // these — the play module checks for them and refuses to seat a match.

  /** Create a fresh, fully-initialised server engine for a new game. */
  createServerEngine?(
    input: import("../game-engine/types.js").ServerEngineCreateInput,
  ): Promise<import("../game-engine/types.js").ServerGameEngine>;

  /**
   * Build a persistence envelope from a live engine. The play module writes
   * the returned object into Redis as opaque JSON.
   */
  serializeEngine?(
    engine: import("../game-engine/types.js").ServerGameEngine,
    cardsMaps: CardsMaps,
  ): import("../game-engine/types.js").EngineSnapshot;

  /** Recreate a live engine from a previously serialised snapshot. */
  restoreEngine?(
    snapshot: import("../game-engine/types.js").EngineSnapshot,
    context: import("../game-engine/types.js").ServerEngineRestoreContext,
  ): Promise<import("../game-engine/types.js").ServerGameEngine>;

  /**
   * Pull the cardsMaps out of a serialised snapshot without instantiating an
   * engine — used by post-game tooling and runtime cache warm paths.
   */
  extractCardsMapsFromSnapshot?(
    snapshot: import("../game-engine/types.js").EngineSnapshot,
  ): CardsMaps;

  /**
   * Derive the adapter-owned `automation` creation seed from per-seat
   * resolved game settings. Each seat carries its id plus this game's entry
   * from the platform-resolved settings map (`undefined` for guests/bots);
   * declared defaults have already been applied by the resolver. Adapters
   * validate only the fields they understand and fail closed by omitting
   * seats whose values they cannot read. Returns the seed handed to
   * {@link import("../game-engine/types.js").ServerEngineCreateInput.automation},
   * or `undefined` when no seat contributes. Adapters without engine-owned
   * automation omit this hook and the play module stamps nothing.
   */
  automationSeedFromSettings?(
    seats: ReadonlyArray<{ seatId: string; gameSettings: unknown }>,
  ): Record<string, unknown> | undefined;
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
