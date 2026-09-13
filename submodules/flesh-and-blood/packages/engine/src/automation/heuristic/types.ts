import type { FabLegalCommand } from "../legal-commands.ts";

/** Goldfish personas that rank the same compiled line, not forked move loops. */
export type FabGoldfishPersona = "value-extract" | "defend-only" | "never-defend";

/** How a named card should be used when a ranking hint points at it. */
export type FabCardRole = "play" | "pitch" | "arsenal" | "defend";

/**
 * Later hero / deck-guide input. A preferred card or combo role reweights
 * the line compiler; it does not replace it.
 */
export interface FabLineRankingHint {
  readonly preferArsenalInstanceId?: string;
  readonly preferArsenalCanonicalId?: string;
  readonly preferArsenalName?: string;
  readonly preferPlayInstanceId?: string;
  readonly preferPlayCanonicalId?: string;
  readonly preferPitchInstanceId?: string;
  readonly preferPitchCanonicalId?: string;
  readonly preferred?: {
    readonly instanceId?: string;
    readonly canonicalId?: string;
    readonly name?: string;
    readonly role?: FabCardRole;
    /** Reserved for deck-guide combo roles (e.g. "enabler"). */
    readonly comboRole?: string;
  };
}

export interface FabLineRankingInput {
  readonly persona: FabGoldfishPersona;
  /** Observer receives the actual ranking, including hero adjustments and safety ordering. */
  readonly onRanked?: (lines: readonly FabCompiledLine[]) => void;
  readonly hint?: FabLineRankingHint;
  /** Hero / deck-guide adjustment added to the compiled line score. */
  readonly adjustScore?: (line: FabCompiledLine, snapshot: FabHeuristicSnapshot) => number;
}

export interface FabHeuristicCard {
  readonly instanceId: string;
  readonly canonicalId: string;
  readonly name: string;
  readonly types: readonly string[];
  readonly subtypes: readonly string[];
  readonly power: number;
  readonly cost: number;
  readonly defense: number;
  readonly pitch: number;
  readonly isAttack: boolean;
  readonly isDefenseReaction: boolean;
  readonly isResource: boolean;
  readonly isEquipment: boolean;
  readonly hasGoAgain: boolean;
  readonly hasStealth: boolean;
  readonly hasHeave: boolean;
  readonly hasWateryGrave: boolean;
  /** CR 8.3.2: permanent -1{d} counter when this defends — armor decays with use. */
  readonly hasBattleworn: boolean;
  /** CR 8.3.10: -1{d} counter when this defends, destroyed at zero — finite defends. */
  readonly hasTemper: boolean;
  /** CR 8.3.3: destroyed when it defends — a one-shot defend at best. */
  readonly hasBladeBreak: boolean;
  /** Required additional-cost random/chosen discards paid from hand besides the played card. */
  readonly additionalHandDiscard: number;
}

export interface FabHeuristicSnapshot {
  readonly actorId: string;
  readonly isActive: boolean;
  readonly combatOpen: boolean;
  readonly stackOpen: boolean;
  readonly defending: boolean;
  readonly actionPoints: number;
  readonly resourcePoints: number;
  readonly intellect: number;
  readonly life: number;
  readonly opponentLife: number | null;
  /** Public cards in the opposing graveyard, used by graveyard interaction lines. */
  readonly opponentGraveyardCount?: number;
  readonly hand: readonly FabHeuristicCard[];
  readonly arsenal: readonly FabHeuristicCard[];
  readonly equipment: readonly FabHeuristicCard[];
  readonly banished: readonly FabHeuristicCard[];
  readonly arena: readonly FabHeuristicCard[];
  readonly graveyard: readonly FabHeuristicCard[];
  /** Cards this player has committed to the current combat chain. */
  readonly combatChain: readonly FabHeuristicCard[];
  readonly arsenalHasRoom: boolean;
  readonly seismicSurgeCount: number;
  readonly turnNumber: number;
  /**
   * CR 4.4.3f: a non-turn player refills to intellect at the end of turn 1.
   * Hand cards spent during the current turn are consequently replaceable;
   * arsenal and equipment are not.
   */
  readonly refillsHandAtEndOfTurn: boolean;
  readonly boostsThisTurn: number;
  readonly remainingDamage: number | null;
  readonly attackPower: number | null;
  readonly attackHasGoAgain: boolean;
  readonly attackOnHitValue: number;
  readonly chainLinkNumber: number;
  readonly combatStep: "defend" | "reaction" | null;
  readonly decisionKind: string | null;
  /** Announced attack payment; committed pitches can still be present in the staged hand. */
  readonly pendingAttackPayment?: {
    readonly sourceInstanceId: string;
    readonly remainingCost: number;
    readonly pitchedInstanceIds: readonly string[];
  };
  readonly heroCanonicalId: string | null;
  readonly heroName: string;
  readonly opponentHeroCanonicalId: string | null;
  readonly opponentHeroName: string;
  /** True when both seats share the same printed hero identity (a true mirror). */
  readonly isMirror: boolean;
  readonly discardedPower6: boolean;
  readonly pitchedPower6: boolean;
  readonly opponentMarked: boolean;
  /** Gravy: a blue card entered this hero's graveyard this turn (Watery Grave permission). */
  readonly bluePutIntoGraveyardThisTurn: boolean;
}

export type FabCompiledLineKind =
  | "play"
  | "activate"
  | "pitch"
  | "defend"
  | "end-turn"
  | "pass"
  | "prompt";

/** One planned turn head: the next legal command plus leftover intent. */
export interface FabCompiledLine {
  readonly kind: FabCompiledLineKind;
  readonly command: FabLegalCommand;
  readonly score: number;
  readonly playInstanceId: string | null;
  readonly pitchInstanceIds: readonly string[];
  readonly arsenalInstanceId: string | null;
  readonly defendInstanceIds: readonly string[] | null;
}
