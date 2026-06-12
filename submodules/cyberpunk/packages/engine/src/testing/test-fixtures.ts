import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import type { PlayerId } from "../types/branded.ts";
import type { DieType } from "../types/gig-die.ts";
import type { GamePhase } from "../types/match-state.ts";
import type { TimeControlConfig } from "@tcg/engine-core";

export interface GigFixtureEntry {
  dieType: DieType;
  faceValue: number;
  /**
   * Fixture-only source pool for this die. Defaults to this player's fixer
   * area. Use "rival" to model a die this player previously stole.
   */
  source?: "self" | "rival";
}

export type FixtureCardEntry = StructuredCardDefinition | FixtureCardState;

export interface FixtureCardState {
  card: StructuredCardDefinition;
  spent?: boolean;
  faceDown?: boolean;
  damage?: number;
  powerModifier?: number;
  playedThisTurn?: boolean;
  hasAttackedThisTurn?: boolean;
  counters?: Record<string, number>;
  attachedGearIds?: string[];
  attachedGears?: StructuredCardDefinition[];
}

export interface PlayerFixture {
  hand?: number | FixtureCardEntry[];
  deck?: number | FixtureCardEntry[];
  field?: number | FixtureCardEntry[];
  trash?: number | FixtureCardEntry[];
  legendArea?: number | FixtureCardEntry[];
  eddies?: number;
  fixerDice?: DieType[];
  gigArea?: GigFixtureEntry[];
}

export interface TestEngineOptions {
  seed?: string;
  timeControl?: TimeControlConfig;
  skipSetup?: boolean;
  /**
   * For skipped-setup fixtures, choose the phase to place the authored fixture
   * into. Defaults to "main". Use `skipSetup: false` for the production setup
   * and mulligan window.
   */
  gamePhase?: GamePhase;
  /**
   * For `skipSetup: true` fixtures, choose whose turn the fixture represents.
   * Defaults to player one so card-behavior tests can put the subject under
   * test in the first fixture argument without depending on seeded setup
   * randomness. If explicit Gig counts make that active player impossible for
   * a legal turn order, the fixture counts win and a warning is emitted.
   */
  activePlayerId?: PlayerId;
  /**
   * Per the gameplay guide, GAIN A GIG is a player choice — the active player
   * picks which die to take from the fixer area at start of turn. The engine
   * surfaces this as a `gainGig` pending choice. For tests that don't care
   * about the choice (most card-behavior tests), the test harness resolves it
   * automatically by picking the first non-d20 (or d20 if it's the only die
   * left), matching pre-existing engine behavior. Set this to `false` to
   * exercise the rules-faithful flow and call `engine.gainGig({ die })`
   * explicitly. Default: `true`.
   */
  autoGainGig?: boolean;
  /**
   * Put the fixture directly into overtime. This clears both fixer areas and
   * sets the game-state overtime flag plus the legacy turn-metadata mirror.
   * Use this for card tests that depend on "during overtime" without manually
   * constructing two empty-fixer turn completions.
   */
  overtime?: boolean;
  /** Alias for {@link overtime}. */
  overTime?: boolean;
}

export function extractCard(entry: FixtureCardEntry): StructuredCardDefinition {
  if ("card" in entry) return entry.card;
  return entry;
}

export function isFixtureCardState(entry: FixtureCardEntry): entry is FixtureCardState {
  return "card" in entry;
}
