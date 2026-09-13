import type {
  GrandArchiveActivationState,
  GrandArchiveClass,
  GrandArchiveElement,
  GrandArchiveKeyword,
  GrandArchiveObservableEventName,
  GrandArchiveObjectState,
  GrandArchiveRulesType,
  GrandArchiveSupertype,
  GrandArchiveZone,
} from "@tcg/grand-archive-types";
import type { GrandArchiveLegalCommand } from "../../commands/legal-commands.ts";
import type { GrandArchiveGameMode } from "../../game/model.ts";
import type {
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveStackItemId,
  GrandArchiveTargetId,
} from "../../game/identity.ts";
import type { GrandArchiveObservedEvent } from "../../kernel/observed-events.ts";

export interface GrandArchiveHeuristicCard {
  readonly id: GrandArchiveObjectId;
  readonly definitionId: string;
  readonly name: string;
  /** Explicit printed lineage identity; never inferred by splitting the display name. */
  readonly lineageName: string | null;
  readonly ownerId: GrandArchivePlayerId;
  readonly controllerId: GrandArchivePlayerId;
  readonly zone: GrandArchiveZone;
  readonly facing: "face-up" | "face-down";
  readonly isToken: boolean;
  readonly hostId: GrandArchiveObjectId | null;
  readonly banishedBySourceId: GrandArchiveObjectId | null;
  readonly supertypes: readonly GrandArchiveSupertype[];
  readonly types: readonly GrandArchiveRulesType[];
  readonly classes: readonly GrandArchiveClass[];
  readonly subtypes: readonly string[];
  readonly elements: readonly GrandArchiveElement[];
  readonly keywords: readonly GrandArchiveKeyword[];
  readonly states: ReadonlySet<GrandArchiveObjectState>;
  readonly activationStates: ReadonlySet<GrandArchiveActivationState>;
  readonly counters: Readonly<Record<string, number>>;
  readonly costKind: "reserve" | "memory" | "none";
  readonly cost: number | null;
  readonly level: number | null;
  readonly power: number | null;
  readonly life: number | null;
  readonly durability: number | null;
  readonly damage: number;
  readonly ready: boolean;
}

export interface GrandArchiveHeuristicPlayer {
  readonly id: GrandArchivePlayerId;
  readonly name: string;
  readonly turnOrder: number;
  readonly hasTakenFirstTurn: boolean;
  readonly lost: boolean;
  readonly conceded: boolean;
  readonly states: Readonly<Record<string, string | number | boolean>>;
  readonly mastery: {
    readonly name: string;
    readonly counters: Readonly<Record<string, number>>;
  } | null;
  readonly champion: GrandArchiveHeuristicCard | null;
}

export interface GrandArchiveHeuristicCombat {
  readonly attackerId: GrandArchiveObjectId;
  readonly attackingPlayerId: GrandArchivePlayerId;
  readonly defendingPlayerIds: readonly GrandArchivePlayerId[];
  readonly targetIds: readonly GrandArchiveObjectId[];
  readonly cleavePlayerId: GrandArchivePlayerId | null;
  readonly retaliatorIds: readonly GrandArchiveObjectId[];
  readonly retaliationOrderConfirmed: boolean;
  readonly weaponIds: readonly GrandArchiveObjectId[];
  readonly intentIds: readonly GrandArchiveObjectId[];
  readonly step: "declaration" | "retaliation" | "damage" | "end";
  readonly actorIsAttackingPlayer: boolean;
  readonly actorIsDefendingPlayer: boolean;
}

/**
 * One rules-observable historical event with only identities that remain visible to this viewer.
 * The committed kernel event is intentionally never exposed to policy code.
 */
export type GrandArchiveHeuristicHistoryEvent = Omit<
  GrandArchiveObservedEvent,
  | "committedEvent"
  | "subjectId"
  | "subjectIds"
  | "recipientId"
  | "recipientIds"
  | "previousObjectId"
  | "stackItemId"
  | "sourceId"
  | "usingIds"
> & {
  readonly name: GrandArchiveObservableEventName;
  readonly subjectId?: GrandArchiveObjectId;
  readonly subjectIds?: readonly GrandArchiveObjectId[];
  readonly recipientId?: GrandArchiveObjectId;
  readonly recipientIds?: readonly GrandArchiveTargetId[];
  readonly previousObjectId?: GrandArchiveObjectId;
  /** Historical stack identities are omitted after the item leaves the Effects Stack. */
  readonly stackItemId?: GrandArchiveStackItemId;
  readonly sourceId?: GrandArchiveObjectId;
  readonly usingIds?: readonly GrandArchiveObjectId[];
};

/** Mirrors the engine's four rules-authored historical collection windows. */
export interface GrandArchiveHeuristicHistory {
  readonly turn: readonly GrandArchiveHeuristicHistoryEvent[];
  readonly phase: readonly GrandArchiveHeuristicHistoryEvent[];
  readonly combat: readonly GrandArchiveHeuristicHistoryEvent[] | null;
  readonly resolution: readonly GrandArchiveHeuristicHistoryEvent[] | null;
}

export interface GrandArchiveHeuristicSnapshot {
  readonly playerId: GrandArchivePlayerId;
  readonly mode: GrandArchiveGameMode;
  readonly matchStatus: "pregame" | "playing" | "finished";
  readonly winnerIds: readonly GrandArchivePlayerId[];
  readonly gameStates: Readonly<Record<string, boolean>>;
  readonly self: GrandArchiveHeuristicPlayer;
  readonly opponents: readonly GrandArchiveHeuristicPlayer[];
  readonly turnPlayerId: GrandArchivePlayerId;
  readonly isTurnPlayer: boolean;
  readonly phase: import("@tcg/grand-archive-types").GrandArchivePhase;
  readonly turnNumber: number;
  readonly stackDepth: number;
  readonly opportunityHolderId: GrandArchivePlayerId | null;
  readonly decisionKind: import("../../game/model.ts").GrandArchiveDecision["kind"] | null;
  readonly combat: GrandArchiveHeuristicCombat | null;
  readonly history: GrandArchiveHeuristicHistory;
  /** Main Deck identity is hidden even from its owner; only its size is projected. */
  readonly mainDeckCount: number;
  /** Only Main Deck cards the authoritative viewer projection currently reveals. */
  readonly revealedMainDeckCards: readonly GrandArchiveHeuristicCard[];
  readonly hand: readonly GrandArchiveHeuristicCard[];
  readonly memory: readonly GrandArchiveHeuristicCard[];
  readonly materialDeck: readonly GrandArchiveHeuristicCard[];
  readonly graveyard: readonly GrandArchiveHeuristicCard[];
  readonly banishment: readonly GrandArchiveHeuristicCard[];
  readonly field: readonly GrandArchiveHeuristicCard[];
  readonly intent: readonly GrandArchiveHeuristicCard[];
  readonly pantheon: readonly GrandArchiveHeuristicCard[];
  readonly innerLineage: readonly GrandArchiveHeuristicCard[];
  readonly loaded: readonly GrandArchiveHeuristicCard[];
  readonly effectsStackCards: readonly GrandArchiveHeuristicCard[];
  readonly opponentsField: readonly GrandArchiveHeuristicCard[];
  /** Opponent-owned cards whose identities the authoritative viewer projection exposes. */
  readonly visibleOpponentCards: readonly GrandArchiveHeuristicCard[];
  /** Current top card of the controlled champion lineage, when one exists. */
  readonly champion: GrandArchiveHeuristicCard | null;
}

export type GrandArchiveCompiledLineKind =
  | "decision"
  | "pregame"
  | "preserve"
  | "materialize"
  | "play"
  | "ability"
  | "attack"
  | "pass"
  | "concede";

/** One authoritative legal command with a policy score, never a predicted rules action. */
export interface GrandArchiveCompiledLine {
  readonly kind: GrandArchiveCompiledLineKind;
  readonly command: GrandArchiveLegalCommand;
  readonly score: number;
  readonly sourceId: GrandArchiveObjectId | null;
  /** Activated-ability identity, when this line activates an ability. */
  readonly abilityId: string | null;
  /** Modes already declared and proven legal by the command enumerator. */
  readonly modeIds: readonly string[];
  /** Target declarations retained by their authored binding identities. */
  readonly targets: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
  /** Flattened declared targets, including players and Effects Stack activations. */
  readonly targetIds: readonly GrandArchiveTargetId[];
  /** Resolved Attack card selected from the attacker's Intent, when present. */
  readonly attackCardId: GrandArchiveObjectId | null;
  /** Additional objects wielded during an attack declaration. */
  readonly weaponIds: readonly GrandArchiveObjectId[];
  /** Opponent selected to choose a defender for a delegated attack. */
  readonly delegatePlayerId: GrandArchivePlayerId | null;
  /** Player whose legal attackable objects become defenders for Cleave. */
  readonly cleavePlayerId: GrandArchivePlayerId | null;
}

export type GrandArchiveAttackRankingPreference =
  | {
      readonly attackCardId: GrandArchiveObjectId;
      readonly weaponId?: GrandArchiveObjectId;
      readonly delegatePlayerId?: GrandArchivePlayerId;
      readonly cleavePlayerId?: GrandArchivePlayerId;
    }
  | {
      readonly attackCardId?: GrandArchiveObjectId;
      readonly weaponId: GrandArchiveObjectId;
      readonly delegatePlayerId?: GrandArchivePlayerId;
      readonly cleavePlayerId?: GrandArchivePlayerId;
    }
  | {
      readonly attackCardId?: GrandArchiveObjectId;
      readonly weaponId?: GrandArchiveObjectId;
      readonly delegatePlayerId: GrandArchivePlayerId;
      readonly cleavePlayerId?: GrandArchivePlayerId;
    }
  | {
      readonly attackCardId?: GrandArchiveObjectId;
      readonly weaponId?: GrandArchiveObjectId;
      readonly delegatePlayerId?: GrandArchivePlayerId;
      readonly cleavePlayerId: GrandArchivePlayerId;
    };

export interface GrandArchiveLineRankingHint {
  readonly preferredSource?: {
    readonly objectId?: GrandArchiveObjectId;
    readonly definitionId?: string;
    /** Exact current printed name after Unicode/case normalization. */
    readonly name?: string;
    /** Authored profile metadata; the generic compiler does not interpret it. */
    readonly comboRole?: string;
  };
  /** Exact activated ability to prefer when one source exposes multiple legal abilities. */
  readonly preferredAbilityId?: string;
  /** Prefer a legal declaration containing this authored mode identity. */
  readonly preferredModeId?: string;
  /** Prefer a target globally or only within one authored target binding. */
  readonly preferredTarget?: {
    readonly id: GrandArchiveTargetId;
    readonly binding?: string;
  };
  /** Prefer one complete, already-legal Grand Archive attack composition. */
  readonly preferredAttack?: GrandArchiveAttackRankingPreference;
  /** Objects the profile wants to preserve instead of spending as reserve sources. */
  readonly preserveFromReservePaymentIds?: readonly GrandArchiveObjectId[];
}

export interface GrandArchiveLineRankingInput {
  readonly hint?: GrandArchiveLineRankingHint;
  /** Champion/deck policy adjustment applied after the generic score. Must be finite. */
  readonly adjustScore?: (
    line: GrandArchiveCompiledLine,
    snapshot: GrandArchiveHeuristicSnapshot,
  ) => number;
}
