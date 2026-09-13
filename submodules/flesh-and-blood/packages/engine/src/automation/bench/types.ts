import type { FabMoveName } from "../../moves.ts";
import type { FabDeckCardLibrary } from "../resolve-text-deck.ts";

export type FabMatchTermination =
  | "life"
  | "concede"
  | "max-actions"
  | "stall"
  | "illegal"
  | "engine-throw"
  | "snapshot-refusal";

/**
 * Evidence bundle carried on a transcript when a mid-match state failed
 * persistence admission. Hosts that run Node (bench CLI, fuzz tests) persist
 * it via `writeFabSnapshotRefusalReport`; the engine module itself stays
 * environment-neutral and never touches the filesystem.
 */
export interface FabSnapshotRefusalEvidence {
  readonly message: string;
  readonly issues: unknown;
  readonly stateSummary: unknown;
  readonly rejectedSnapshot: unknown;
}

export interface FabDecisionHead {
  readonly kind: string;
  readonly score: number;
  readonly label: string;
  readonly play?: string;
  readonly arsenal?: string;
  readonly defend?: readonly string[];
}

export interface FabDecisionFrame {
  readonly index: number;
  readonly turnNumber: number;
  readonly actorId: string;
  readonly combatOpen: boolean;
  readonly defending: boolean;
  readonly life: number;
  readonly opponentLife: number | null;
  readonly actionPoints: number;
  readonly resourcePoints: number;
  readonly hand: readonly string[];
  readonly arsenal: readonly string[];
  readonly arena: readonly string[];
  readonly equipment: readonly string[];
  readonly remainingDamage: number | null;
  readonly isMirror: boolean;
  readonly legal: readonly string[];
  readonly considered: readonly FabDecisionHead[];
  readonly chosen: {
    readonly move: FabMoveName;
    readonly label: string;
    readonly score: number | null;
  };
}

export interface FabMatchTranscript {
  readonly seed: string;
  readonly p1Strategy: string;
  readonly p2Strategy: string;
  readonly p1Deck: string;
  readonly p2Deck: string;
  readonly player1Id: string;
  readonly player2Id: string;
  readonly termination: FabMatchTermination;
  readonly winnerId: string | null;
  readonly winReason: string | null;
  readonly actionCount: number;
  readonly turnCount: number;
  readonly frames: readonly FabDecisionFrame[];
  readonly error?: string;
  readonly snapshotRefusal?: FabSnapshotRefusalEvidence;
}

export interface FabBenchOptions {
  readonly cardLibrary: FabDeckCardLibrary;
  readonly p1Strategy: string;
  readonly p2Strategy: string;
  readonly p1Deck: string;
  readonly p2Deck: string;
  readonly matches: number;
  readonly seedBase: string;
  readonly maxActions: number;
  readonly label?: string;
}

export type FabBenchReportOptions = Omit<FabBenchOptions, "cardLibrary">;

export interface FabMatchReport {
  readonly matchId: number;
  readonly seed: string;
  readonly termination: FabMatchTermination;
  readonly winner: "p1" | "p2" | null;
  readonly winReason: string | null;
  readonly turnCount: number;
  readonly actionCount: number;
}

export interface FabBenchReport {
  readonly version: 1;
  readonly options: FabBenchReportOptions;
  readonly summary: {
    readonly matches: number;
    readonly p1Wins: number;
    readonly p2Wins: number;
    readonly draws: number;
    readonly p1WinRate: number;
    readonly avgTurns: number;
    readonly avgActions: number;
    readonly terminations: Readonly<Record<string, number>>;
  };
  readonly matches: readonly FabMatchReport[];
  readonly createdAt: string;
}

export interface FabBenchDiff {
  readonly version: 1;
  readonly for: "p1" | "p2";
  readonly baseline: FabBenchReportOptions;
  readonly candidate: FabBenchReportOptions;
  readonly flipped: number;
  readonly gained: number;
  readonly lost: number;
  readonly hangDelta: number;
  readonly illegalDelta: number;
  readonly p1WinRateDelta: number;
  readonly verdict: "keep" | "reject" | "inconclusive";
  readonly reason: string;
}
