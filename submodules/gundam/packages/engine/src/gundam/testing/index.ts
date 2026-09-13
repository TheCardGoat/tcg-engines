export { GundamTestEngine, GundamPlayerActions, PLAYER_ONE, PLAYER_TWO } from "./test-engine.ts";
export type {
  GundamPlayerId,
  TestPlayerState,
  TestCardEntry,
  PlayerTestProxy,
} from "./test-engine.ts";
// CardRef types exported with value exports below
export { registerGundamMatchers, expectSuccess, expectFailure } from "./matchers.ts";
export {
  createMockUnit,
  createMockResource,
  createMockCommand,
  createMockPilot,
  createMockBase,
} from "./card-mocks.ts";
export { testLogger, engineLogger } from "./configure-logger.ts";
export type { LogLevel } from "./configure-logger.ts";
export {
  activeResources,
  restedResources,
  expectUnitCanDeploy,
  findStatModifier,
  countStatModifiers,
  hasKeywordGrant,
  hasContinuousRestriction,
  hasPreventDamage,
  hasForceAttackTarget,
  hasGrantAttackTargetOption,
  getContinuousEffects,
  getCardZoneKey,
  expectAttackRedirectedTo,
  expectCardInTrash,
  expectCardInHand,
  getDamageCounter,
  isCardExhausted,
  markAsLinkUnit,
  firstIdOr,
} from "./command-test-helpers.ts";
export { seedShieldsFromDeck, giveShield, seedBaseAsShield } from "./shield-seeding.ts";
export {
  assertResourceShape,
  assertResourceInert,
  assertResourceReminderText,
} from "./resource-shape.ts";
export {
  resolveBattle,
  passBattleWithoutBlock,
  endTurn,
  passMainIntoEndAction,
  zoneCount,
  getWinner,
  expectWinner,
  getPhase,
  discardToHandLimit,
} from "./rules-aaa.ts";
export {
  resolveCardRef,
  listCardRefs,
  makeInstanceRef,
  isCardInstanceRef,
  isCardDefinition,
  cardRefId,
  otherPlayer,
  AmbiguousCardRefError,
  CardRefNotFoundError,
} from "./card-ref.ts";
export type { CardInstanceRef, CardRef, CardRefFilter } from "./card-ref.ts";
export {
  createFluentMust,
  playerUnit,
  playerCardIn,
  playerRef,
  playerUnits,
} from "./player-fluent.ts";
export type { FluentMust, FluentAttackBuilder } from "./player-fluent.ts";
export {
  expectCard,
  expectPlayer,
  expectWinnerIs,
  FluentCardAssert,
  FluentPlayerAssert,
} from "./fluent-assert.ts";
export {
  getAllGameLogs,
  getLogsForPlayer,
  getLogsOfType,
  expectLogType,
  expectPublicLog,
  expectPrivateLog,
  expectNoPrivateCardIdsInViewerLogs,
} from "./log-helpers.ts";
export type { TypedGameLog } from "./log-helpers.ts";
