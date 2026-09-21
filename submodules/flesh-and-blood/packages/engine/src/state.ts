import type { FabRegisteredCardDefinition } from "./cards.ts";
import type { FabRulesAssets } from "./game/assets.ts";
import type { FabCombatState, FabLastClosedCombat } from "./game/combat.ts";
import type { FabPlayerId } from "./game/identity.ts";
import type {
  FabAttackProxyRecord,
  FabLkiId,
  FabMoveLkiSnapshot,
  FabObjectRecord,
} from "./game/objects.ts";
import type { FabRuntimeContainers } from "./game/zones.ts";
import type { FabPhase } from "./game/turn.ts";
import type { FabTurnHistory } from "./game/turn-history.ts";
import type { FabObjectRef } from "./rules/continuous/ir.ts";
import type {
  FabCommittedEventContext,
  FabEventOccurrence,
  FabObjectSnapshot,
} from "./rules/events.ts";
export type { FabTurnHistory } from "./game/turn-history.ts";
export type { FabRulesAssets } from "./game/assets.ts";
export type {
  FabAttackTarget,
  FabAttackTargetRef,
  FabActiveAttackRef,
  FabChainLink,
  FabCombatState,
  FabCombatStep,
  FabDefendOrigin,
  FabLastClosedCombat,
} from "./game/combat.ts";
export type {
  FabAttackProxyId,
  FabCanonicalCardId,
  FabObjectInstanceId,
  FabPlayerId,
} from "./game/identity.ts";
import type { FabPublicCardIdentity, FabZone } from "@tcg/flesh-and-blood-types";

/**
 * A card banished this turn that must return to a zone at the beginning of the
 * end phase. `returnToZone` records the destination: hand for intimidate
 * (CR Intimidate); the card's previous zone for a banish-until effect
 * (CR 8.5.1c). The carrying field keeps the legacy `intimidatedInstanceIds`
 * name to avoid churn on this shared branch.
 */
export interface FabBanishReturnEntry {
  readonly instanceId: string;
  readonly returnToZone: FabZone;
}

export interface FabActivationLimitModifier {
  readonly modifierId: string;
  /** Monotonic match-local creation order; array position is not semantic. */
  readonly generatedSequence: number;
  readonly controllerId: FabPlayerId;
  readonly sourceRef: FabObjectRef;
  readonly attackSourceRef: FabObjectRef;
  readonly attackAbilityIds: readonly string[];
  readonly operation: "set-total" | "additional";
  readonly count: number;
  readonly turnNumber: number;
}
export type { FabPhase } from "./game/turn.ts";
export {
  lookupObject,
  type FabCounterRecord,
  type FabLkiId,
  type FabMoveLkiSnapshot,
  type FabObjectHistory,
  type FabObjectMarker,
  type FabObjectMoveHistoryEntry,
  type FabObjectRecord,
  type FabAttackProxyRecord,
} from "./game/objects.ts";
export {
  FAB_ZONE_KINDS,
  createEmptyFabZones,
  type FabZoneKind,
  type FabZoneRef,
  type FabZones,
} from "./game/zones.ts";
import type { FabPrngState } from "./random.ts";
import type {
  FabDecision,
  FabDelayedTrigger,
  FabDeterministicCounters,
  FabPersistedReplacement,
  FabRulesProcess,
} from "./rules/process.ts";
import type { FabRulesStackLayer } from "./rules/layers.ts";
import type {
  FabContinuousEffectInstance,
  FabContinuousOrderingRecord,
} from "./rules/continuous/ir.ts";

// v15 persists intrinsic object kind and an authoritative registered/frozen
// base-property source. Older snapshots cannot distinguish token lifecycle
// from copied type-box text or safely restore a frozen copy.
// v12 persists first-class card-property state and ordered card-resolution plans; older
// snapshots cannot reconstruct a chosen split face or a meld priority boundary.
// v9 makes persistence an explicit closed DTO and stores delayed-trigger
// lifetime/consumption as one discriminated policy. Runtime container
// membership is match-owned and every older persisted representation is rejected.
// v16 widens the persisted `intimidatedInstanceIds` element from a bare
// `string` to a structured `FabBanishReturnEntry` (instanceId + returnToZone)
// so the end-phase return can route to the card's pre-banish zone. Older v15
// snapshots stored plain instance-id strings and cannot be restored.
// v18 persists owner-private, match-scoped optional-trigger automation. Older
// snapshots cannot reproduce the authoritative auto-pass/auto-decline drain.
// v19 persists per-seat priority-automation modes. Older snapshots cannot
// reproduce the authoritative pass-only priority drain.
// v20 persists priority-window origin and per-seat one-shot priority-hold
// arms. Older snapshots cannot reproduce the authoritative own-window skip.
// v21 consolidates per-seat automation into one profile (mode, trigger-order
// auto-answer, per-card own-skip exceptions, per-card opponent-trigger yields)
// and widens the own-action origin with its source instance. Older snapshots
// cannot reproduce the authoritative drains and ordering auto-answers.
// v22 replaces decline-only optional-trigger flags with an explicit stored
// policy so a source can fail closed, auto-accept, or auto-decline.
// v23 stores declared object targets by exact instance and incarnation and
// separates player targets into their own identity domain.
// v24 persists per-seat, per-canonical-card Instant auto-yields. Older
// snapshots cannot reproduce the same authoritative priority drain.
// v25 persists the authoritative per-turn intimidate count. Older snapshots
// cannot reproduce count-based hero signals or two-or-more intimidate facts.
// v26 persists the selected first turn-player independently from the player
// who was entitled to make that choice (CR 4.1.3).
// v27 replaces legacy delayed-trigger expiry fields with an explicit policy.
// v28 persists structured semantic turn observations and source-scoped Scrap
// declaration facts. Older snapshots cannot reproduce those rules decisions.
// v29 retains per-source hit outcomes for every link on the last closed combat
// chain so source-native close triggers cannot inherit another attack's result.
// v30 persists per-seat singleton-target auto-select. Older snapshots cannot
// reproduce the authoritative forced entity-target drain.
// v31 persists the per-seat scoped auto-pass arm ("this combat" / "the
// opponent's turn"). Older snapshots cannot reproduce the scoped drain.
export const FAB_MATCH_SCHEMA_VERSION = 31 as const;

export type FabOptionalTriggerAutomationMode = "ask" | "auto-accept" | "auto-decline";
export type FabStoredOptionalTriggerAutomationMode = Exclude<
  FabOptionalTriggerAutomationMode,
  "ask"
>;

/**
 * One-shot auto-pass scopes. `combat` drains the seat's pass-only windows
 * until the current chain link closes; `opponent-turn` drains them until the
 * seat's own turn begins. Either way the seat is explicitly opting out of
 * interacting, so its Instant uses count as blanket-yielded and its optional
 * triggers auto-decline for the scope's lifetime (see
 * {@link rules/auto-pass.ts}).
 */
export type FabScopedAutoPassScope = "combat" | "opponent-turn";

/**
 * Per-seat priority mode. `auto-pass` lets the engine close the seat's
 * pass-only windows; `always-hold` never drains the seat; `play-and-skip`
 * additionally lets the engine close the seat's own follow-up window that
 * opens immediately after the seat's own play/activate/attack-declare.
 */
export type FabPriorityAutomationMode = "auto-pass" | "always-hold" | "play-and-skip";

/**
 * Consolidated per-seat automation profile. Every knob a seat retunes is one
 * object so adding the next knob is one field, one snapshot migration, and one
 * command patch — never a new flat state field.
 */
export interface FabAutomationPreferences {
  readonly priorityMode: FabPriorityAutomationMode;
  /** Auto-answer both simultaneous-trigger ordering decisions (entry order). */
  readonly autoOrderTriggers: boolean;
  /**
   * Auto-answer entity-target decisions whose selected set is mathematically
   * unique (min = max = candidate count, including the common 1-of-1 case).
   * The engine fails unseeded seats closed to ask; the product default is on.
   */
  readonly autoSelectSingletonTargets: boolean;
  /** canonicalIds whose own-action follow-up windows are never skipped. */
  readonly playAndSkipHoldCardIds: readonly string[];
  /** canonicalIds whose opposing triggered layers are passed unconditionally while top. */
  readonly opponentTriggerYieldCardIds: readonly string[];
  /** canonicalIds whose legal Instant uses do not block compatible automatic drains. */
  readonly instantYieldCardIds: readonly string[];
  /**
   * Owner-private one-shot auto-pass scope. While armed (and until its natural
   * boundary) the seat drains as `auto-pass` regardless of {@link priorityMode},
   * with its Instants blanket-yielded and its optional triggers auto-declined.
   */
  readonly scopedAutoPass: FabScopedAutoPassScope | null;
}

/** Fail-closed profile for any seat that was never configured. */
export const FAB_DEFAULT_AUTOMATION_PREFERENCES: FabAutomationPreferences = {
  priorityMode: "always-hold",
  autoOrderTriggers: false,
  autoSelectSingletonTargets: false,
  playAndSkipHoldCardIds: [],
  opponentTriggerYieldCardIds: [],
  instantYieldCardIds: [],
  scopedAutoPass: null,
};

/**
 * Drop one scope kind from every seat's profile. Chain close retires
 * `combat` arms for all seats; the turn flip retires the new active seat's
 * `opponent-turn` arm. Returns the input reference when nothing changes so
 * reducers can assign unconditionally.
 */
export function withoutFabScopedAutoPass(
  preferences: Record<string, FabAutomationPreferences>,
  scope: FabScopedAutoPassScope,
): Record<string, FabAutomationPreferences> {
  let changed = false;
  const next: Record<string, FabAutomationPreferences> = {};
  for (const [playerId, profile] of Object.entries(preferences)) {
    if (profile.scopedAutoPass === scope) {
      changed = true;
      next[playerId] = { ...profile, scopedAutoPass: null };
    } else {
      next[playerId] = profile;
    }
  }
  return changed ? next : preferences;
}

/** Drop one seat's scope arm, whatever its kind. Returns the input reference when unset. */
export function withoutFabScopedAutoPassForSeat(
  preferences: Record<string, FabAutomationPreferences>,
  playerId: string,
): Record<string, FabAutomationPreferences> {
  const profile = preferences[playerId];
  if (!profile || profile.scopedAutoPass === null) return preferences;
  return { ...preferences, [playerId]: { ...profile, scopedAutoPass: null } };
}

/** Typed event-derived facts, partitioned by the CR window that resets them. */
export interface FabHistoryIndex {
  readonly game: {
    readonly startedAtTurn: number;
    /**
     * Warmonger's Diplomacy (CR modal next-turn restriction). Persists across
     * the end-of-turn ledger reset so the opposing seat can still observe
     * chose-war / chose-peace on their following turn.
     */
    diplomacyChoice: "war" | "peace" | null;
  };
  readonly turn: FabTurnHistory;
  readonly combatChain: {
    combatNumber: number | null;
    draconicChainLinks: number;
    wagered: boolean;
    lastAttackNames: readonly string[];
    /** Whether the most recent chain link's attack hit; survives combat-chain-close
     * so combat-chain-close triggers (e.g. "if this didn't hit") can evaluate it.
     * Reset when a new combat opens. */
    lastAttackDidHit: boolean;
    /** Times this player paid boost on the open combat chain (Pulsewave Harpoon). */
    boostsThisCombatChain: number;
    /** Cards this player banished from their soul on the open combat chain (Battlefield Beacon). */
    cardsBanishedFromSoulThisCombatChain: number;
  };
  readonly chainLink: {
    chainLinkNumber: number | null;
    playedInstant: boolean;
    damageDealtByType: Record<"arcane" | "physical" | "generic", number>;
    damageDealtToOpposingHeroesByType: Record<"arcane" | "physical" | "generic", number>;
    /** Per-source damage dealt on the open chain link (Surge CR 8.4.8). */
    damageDealtBySource: Record<string, number>;
    /** Per-source hero-targeted damage on the open chain link (Surge 8.4.8). */
    damageDealtBySourceToHero: Record<string, number>;
  };
  readonly resolution: {
    processId: string | null;
  };
}

export interface FabPlayerState extends FabRulesAssets {
  readonly playerId: FabPlayerId;
  heroCardId: string | null;
  /** Current hero Intellect projection (CR 2.4), not a player asset. */
  intellect: number;
  /** Marked status (CR 9.3) — game-rule flag on the hero's controller. */
  marked: boolean;
  /**
   * Pending extra turns after the current one (CR "take an extra turn after
   * this one"). Incremented by take-extra-turn; consumed by end-turn advance.
   */
  extraTurnsQueued: number;
  /**
   * Active contract task text when a contract effect has registered
   * (CR 8.5.39). Cleared when the contract completes or leaves.
   */
  activeContract: string | null;
  history: FabHistoryIndex;
  /**
   * Cards banished this turn that return at the beginning of the end phase.
   * Each entry records the zone the card must return to: intimidate always
   * returns to hand (CR Intimidate); a banish-until effect returns the card to
   * its previous zone (CR 8.5.1c).
   */
  intimidatedInstanceIds: FabBanishReturnEntry[];
  /**
   * Instance ids of played crank permanents whose controller opted to
   * crank (CR 8.3.29); consumed when the permanent enters the arena.
   */
  pendingCrankInstanceIds: string[];
}
export interface FabLogEntry {
  readonly turnNumber: number;
  readonly actorId: string;
  readonly move: string;
  readonly message: string;
  readonly timestamp: number;
}

/** Bounded immutable facts used by CR 6.6.5d ordinal and replay evaluation. */
export interface FabTriggerOccurrenceRecord {
  readonly occurrence: FabEventOccurrence;
  readonly actorId: string | null;
  readonly eventNames: readonly string[];
  readonly selectedObjects: readonly FabObjectSnapshot[];
  readonly amount: number;
  readonly context: FabCommittedEventContext;
}

export interface FabMatchState {
  readonly schemaVersion: typeof FAB_MATCH_SCHEMA_VERSION;
  /**
   * Seated players in table order. Product scope is **1v1 only** — always
   * exactly two seats. Multiplayer formats are out of scope.
   */
  readonly playerIds: readonly FabPlayerId[];
  readonly players: Record<string, FabPlayerState>;
  /** Sole runtime owner of all zone, arsenal-slot, and hosted-subcard membership. */
  containers: FabRuntimeContainers;
  /** Schema-v2 exact records for every physical card/token instance. */
  objects: Record<string, FabObjectRecord>;
  /** CR 1.4.3 non-card attacks, keyed by their persisted proxy identity. */
  attackProxies: Record<string, FabAttackProxyRecord>;
  /** Reachable, interned last-known information. Cleared with its bounded move facts. */
  lkiArena: Record<FabLkiId, FabMoveLkiSnapshot>;
  cardDefinitions: Record<string, FabRegisteredCardDefinition>;
  /** Immutable public identity catalog supplied by the match program. */
  publicCardIdentities: readonly FabPublicCardIdentity[];
  /** Selected first turn-player. This is match history, not current priority. */
  firstTurnPlayerId: FabPlayerId;
  activePlayerId: FabPlayerId;
  /** Canonical persisted CR 1.11 window; null during game processes and Close. */
  priority: import("./priority.ts").FabPriorityWindow | null;
  turnNumber: number;
  phase: FabPhase;
  combat: FabCombatState | null;
  /** Snapshot of the most recently closed chain link's player roles, preserved so
   * combat-chain-close triggers can resolve attacking-hero/defending-hero selectors
   * after `combat` has been cleared. Reset when a new combat opens. */
  lastClosedCombat: FabLastClosedCombat | null;
  /** Persisted rules continuation; candidates are private in viewer projections. */
  decision: FabDecision | null;
  /** Active event/trigger transaction, serialized at every decision boundary. */
  rulesProcess: FabRulesProcess | null;
  /** Monotonic deterministic identifiers. Never derive these from wall-clock time. */
  counters: FabDeterministicCounters;
  /** Trigger usage keyed by stable source/ability/window identity. */
  triggerLimitUsage: Record<string, number>;
  /** Owner-private policy, keyed by owner then physical source instance. */
  optionalTriggerAutomation: Record<
    string,
    Partial<Record<string, FabStoredOptionalTriggerAutomationMode>>
  >;
  /**
   * Per-seat automation profile. A missing seat fails closed to
   * {@link FAB_DEFAULT_AUTOMATION_PREFERENCES}; only the profile's policies
   * decide what drains at the command dispatch tail.
   */
  automationPreferences: Record<string, FabAutomationPreferences>;
  /**
   * Per-seat one-shot priority hold ("play and hold" combo turns). While
   * armed, the seat's own follow-up windows drain as always-hold; any pass
   * commit by the seat (manual or automatic) clears the arm.
   */
  priorityHoldArmed: Record<string, true>;
  /** Committed observable occurrences, independent from transaction batching. */
  triggerOccurrenceLedger: FabTriggerOccurrenceRecord[];
  /** Activated-ability usage keyed by stable source/ability/window identity. */
  abilityLimitUsage: Record<string, number>;
  /** CR 5.2.3 turn-scoped changes to exact attack-ability activation limits. */
  activationLimitModifiers: FabActivationLimitModifier[];
  /** Layer-continuous triggers that remain functional until expiry or use. */
  delayedTriggers: FabDelayedTrigger[];
  /** Serialized floating replacement and prevention effects awaiting matching events. */
  replacementEffects: FabPersistedReplacement[];
  /** Compiled layer/static continuous semantics; raw catalog effects are never persisted. */
  continuousEffectInstances: FabContinuousEffectInstance[];
  /** Turn-player choices for equal-timestamp object effects in one stage/substage. */
  continuousOrderingDecisions: FabContinuousOrderingRecord[];
  /** Exhaustive card, activated-ability, and triggered-ability rules stack. */
  rulesStack: FabRulesStackLayer[];
  stateID: number;
  gameEnded: boolean;
  winnerId: string | null;
  endReason: string | null;
  /**
   * Yorick (LSS004) et al.: when set, every seat's deck and graveyard zone
   * lists redirect to this host player's zones for the rest of the match.
   * Null when no seated hero shares the library.
   */
  sharedLibraryHostId: string | null;
  readonly seed: string;
  rngState: FabPrngState;
  /** HVY Clash: last clash winner player id (null if tie / no clash). */
  lastClashWinnerId: string | null;
}

/**
 * The sole opposing seat in a 1v1 match.
 * Throws if the table is not exactly two seated players or `playerId` is not seated.
 */
export function opponentOf(state: FabMatchState, playerId: string): string {
  if (state.playerIds.length !== 2) {
    throw new Error(
      `opponentOf requires a 1v1 match (exactly 2 seated players); found ${state.playerIds.length}.`,
    );
  }
  const opponent = state.playerIds.find((id) => id !== playerId);
  if (!opponent) {
    throw new Error(`opponentOf: player "${playerId}" is not seated.`);
  }
  return opponent;
}
