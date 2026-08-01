/**
 * Core game state model. State is a plain serializable object tree; the
 * reducer shallow-copies it on every accepted action, and a game is fully
 * replayable from `seed` + the action log.
 */

export type PlayerId = "p1" | "p2";

export type Phase = "refresh" | "draw" | "main" | "end";

export type Step = "normal" | "counter";

export type AttackerKind = "leader" | "character";

export type TargetKind = "leader" | "character";

/** Hand/deck/trash/support entries. */
export interface CardInstance {
  readonly uid: string;
  readonly cardId: string;
}

/** A set support card; face-down until `revealed`. */
export interface SupportInstance extends CardInstance {
  readonly revealed?: boolean;
}

export interface CharacterInstance extends CardInstance {
  rested: boolean;
  damage: number;
  summonedOnTurn: number;
  powerBonus: number;
  damageBonus: number;
  attacksUsed: number;
  cannotAttackUntilTurn: number;
  rushUntilTurn: number;
  activatedThisTurn: boolean;
  powerDoubledUntilTurn: number;
  supportImmuneUntilTurn: number;
  effectsNegated: boolean;
}

export interface ChakraInstance {
  readonly uid: string;
  faceUp: boolean;
}

export interface PlayerState {
  readonly id: PlayerId;
  readonly name: string;
  readonly leaderId: string;
  life: number;
  leaderRested: boolean;
  leaderAttacksUsed: number;
  leaderCannotAttackUntilTurn: number;
  deck: CardInstance[];
  hand: CardInstance[];
  trash: CardInstance[];
  /** Open slots (5 shown, unlimited). */
  characters: (CharacterInstance | null)[];
  /** 5 slots, set face-down. */
  supports: (SupportInstance | null)[];
  /** 5, flipped face-down to pay costs. */
  chakra: ChakraInstance[];
  exPile: CardInstance[];
  summonRested: boolean;
  summonsUsedThisTurn: number;
  leaderUsedThisTurn: boolean;
  mulliganDone: boolean;
  /** Recovery lockout from certain support cards. */
  chakraLockedUntilTurn: number;
}

export interface PendingAttack {
  readonly attackerUid: string;
  readonly attacker: PlayerId;
  readonly attackerKind: AttackerKind;
  readonly targetKind: TargetKind;
  readonly targetUid: string | null;
}

/** Zones a choice option can point at. */
export type ChoiceZone = "character" | "leader" | "hand" | "deck" | "trash";

export interface ChoiceOption {
  readonly zone: ChoiceZone;
  /** Character uid, trash/deck/hand uid, or `leader:<playerId>`. */
  readonly key: string;
  readonly owner: PlayerId;
  readonly cardId: string;
  readonly index: number | null;
}

/** Choice-driven effect kinds (see effects.ts). */
export type EffectKind =
  | "leaderBoost"
  | "leaderPutBack"
  | "exRequirement"
  | "reviveFromTrash"
  | "freezeTarget"
  | "koTarget"
  | "bounceTarget"
  | "doublePower"
  | "supportImmune"
  | "searchSummon";

/**
 * Universal interaction primitive: whoever `player` is must answer with
 * RESOLVE_CHOICE. Single non-cancellable options auto-resolve; `data` carries
 * multi-step flow state (remaining/taken/restedOnly/nonEx, handUid/step/paid,
 * uid/cardId for summon-this-card supports).
 */
export interface PendingChoice {
  readonly effect: EffectKind;
  readonly source: string;
  readonly player: PlayerId;
  readonly promptKey: string;
  readonly options: readonly ChoiceOption[];
  readonly cancellable: boolean;
  readonly alwaysAsk?: boolean;
  readonly data: Readonly<Record<string, string | number>>;
}

/** Support chain link, resolved LIFO. */
export interface ChainLink {
  readonly player: PlayerId;
  readonly uid: string;
  readonly cardId: string;
}

/** Chain link whose effect is suspended on a pending choice. */
export interface ResolvingSupport extends ChainLink {
  readonly keepsCard: boolean;
}

export type LogActor = PlayerId | "system";

/** i18n-key log entries; `key` is e.g. "log.summon", "log.hitLeader". */
export interface LogEntry {
  readonly turn: number;
  readonly actor: LogActor;
  readonly key: string;
  readonly values?: Readonly<Record<string, string | number>>;
}

export interface GameState {
  turn: number;
  activePlayer: PlayerId;
  phase: Phase;
  step: Step;
  /** Who may respond during the counter step. */
  priority: PlayerId | null;
  pendingAttack: PendingAttack | null;
  pendingChoice: PendingChoice | null;
  chain: ChainLink[];
  resolvingSupport: ResolvingSupport | null;
  consecutivePasses: number;
  awaitingMulligan: PlayerId | null;
  winner: PlayerId | null;
  seed: number;
  log: LogEntry[];
  players: Record<PlayerId, PlayerState>;
}
