export {
  DEFAULT_BASE_ID,
  DEFAULT_LEADER_ID,
  DEFAULT_UNIT_ID,
  P1,
  P2,
  createFixtureState,
  damagedCard,
  exhaustedCard,
  experiencedCard,
  extractDefinitionId,
  fixtureCard,
  shieldedCard,
  swuFixture,
  testCardIdentity,
} from "./test-fixtures.ts";
export type {
  FixtureCardEntry,
  FixtureCardOverrides,
  FixtureCardState,
  PlayerFixture,
  SwuTestFixture,
} from "./test-fixtures.ts";
export {
  FixtureAssertionError,
  MoveFailedError,
  SwuCardExpectation,
  SwuPlayerDriver,
  SwuTestEngine,
  expectSuccessfulCommand,
} from "./test-engine.ts";
export type { CardRef, MoveOptions } from "./test-engine.ts";
