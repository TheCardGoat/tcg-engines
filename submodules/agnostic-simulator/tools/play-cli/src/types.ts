/**
 * Game-agnostic play session contracts.
 *
 * Adapters map native engines into this surface so the CLI and tests never
 * import a game package directly outside the registry.
 */

export type PlayTerminationReason =
  | "rules-win"
  | "deck-out"
  | "player-concession"
  | "automation-concession"
  | "repeated-state"
  | "unsupported-prompt"
  | "illegal-command"
  | "max-actions"
  | "infrastructure-error";

export interface PlayAction {
  /** Stable id for submit / logging (game-defined). */
  readonly actionId: string;
  /** Native command type or interaction intent. */
  readonly type: string;
  /** Seat / actor that may take this action. */
  readonly actorId: string;
  /** Short human/agent summary. */
  readonly summary: string;
}

export interface PlayObservation {
  readonly game: string;
  readonly step: number;
  readonly stateId: number;
  readonly turn: number;
  readonly phase?: string;
  readonly status: string;
  /** Actors that currently have a legal action (may be empty mid-resolution). */
  readonly toAct: readonly string[];
  readonly gameEnded: boolean;
  readonly winner: string | null;
  readonly termination?: PlayTerminationReason;
  /** Compact agent-facing state view (game-defined shape). */
  readonly state: unknown;
  readonly actions: readonly PlayAction[];
}

export interface PlayEndResult {
  readonly game: string;
  readonly seed: string;
  readonly winner: string | null;
  readonly termination: PlayTerminationReason;
  readonly turnCount: number;
  readonly actionCount: number;
  readonly step: number;
  readonly p1DeckId?: string;
  readonly p2DeckId?: string;
}

export interface CreatePlaySessionOptions {
  readonly seed?: string;
  readonly maxSteps?: number;
  /** Strategy id for seat p1 (south / player one). Defaults to game safe default. */
  readonly p1Strategy?: string;
  /** Strategy id for seat p2 (north / player two). Defaults to game safe default. */
  readonly p2Strategy?: string;
  /**
   * Deck id under tools/play-cli/decks/playable/, absolute/relative path to a
   * deck JSON file, or omit for the game default practice deck.
   */
  readonly p1Deck?: string;
  readonly p2Deck?: string;
}

export interface SeriesGameResult extends PlayEndResult {
  readonly gameIndex: number;
}

export interface SeriesResult {
  readonly seriesId: string;
  readonly bestOf: number;
  readonly p1Wins: number;
  readonly p2Wins: number;
  readonly winner: "p1" | "p2" | "draw";
  readonly games: readonly SeriesGameResult[];
}

export interface AutoStepResult {
  readonly accepted: boolean;
  readonly ended: boolean;
  readonly observation: PlayObservation;
  readonly result?: PlayEndResult;
}

export interface PlaySession {
  readonly game: string;
  readonly seed: string;
  observe(): PlayObservation;
  /**
   * Advance one automated decision for the current to-act actor using the
   * seat's configured bot strategy. Returns the new observation (or end result).
   */
  autoStep(): AutoStepResult;
  /** Drive autoStep until the match ends or maxSteps is hit. */
  runToEnd(): PlayEndResult;
  hasEnded(): boolean;
  result(): PlayEndResult | undefined;
}

export interface PlayDoctorCheck {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

export interface PlayDoctorResult {
  readonly ok: boolean;
  readonly game: string;
  readonly checks: readonly PlayDoctorCheck[];
}

export interface PlayAdapter {
  readonly game: string;
  doctor(): PlayDoctorResult | Promise<PlayDoctorResult>;
  createSession(options?: CreatePlaySessionOptions): PlaySession;
  listStrategies?(): readonly string[];
}
