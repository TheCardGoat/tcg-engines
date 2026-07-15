/**
 * @tcg/core/testing
 *
 * Transitional testing surface for packages that still rely on CoreTestEngine-style
 * helpers while the runtime-first test engine contracts roll out.
 */

export {
  SPECTATOR_PLAYER_ID,
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
} from "./multiplayer-test-engine";
export { CoreTestEngine, GAME_TEST_VIEWS, isGameTestEngine } from "./core-test-engine";
export type {
  GameTestView,
  GameTestEngine,
  PlayerActionInterface,
  CheatAttemptResult,
  HiddenInfoResult,
} from "./core-test-engine";

type TestCard = { id: string; name: string };
let testCardCounter = 0;

export function resetCardCounter(): void {
  testCardCounter = 0;
}

//TODO: We have a duplicate in, we should convergepackages/lorcana/lorcana-engine/src/testing/card-mocks.ts
export function createTestCard<T extends Record<string, unknown> = Record<string, unknown>>(
  overrides: Partial<T & TestCard> = {},
): T & TestCard {
  const id = (overrides.id as string | undefined) ?? `test-card-${++testCardCounter}`;
  const name = (overrides.name as string | undefined) ?? `Test Card ${testCardCounter}`;
  return {
    id,
    name,
    ...(overrides as Record<string, unknown>),
  } as T & TestCard;
}

export function createTestCards<T extends Record<string, unknown> = Record<string, unknown>>(
  count: number,
  factory?: (index: number) => Partial<T & TestCard>,
): Array<T & TestCard> {
  return Array.from({ length: Math.max(0, Math.floor(count)) }, (_, index) =>
    createTestCard<T>(factory?.(index) ?? {}),
  );
}

// =============================================================================
// New Multiplayer Test Engine (Engine Simplification Plan)
// =============================================================================

export {
  MultiplayerTestEngine,
  type MultiplayerTestEngineConfig,
  type SyncOptions,
} from "./multiplayer-test-engine";
