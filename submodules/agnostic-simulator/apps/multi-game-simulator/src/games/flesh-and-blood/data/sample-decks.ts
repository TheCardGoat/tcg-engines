/**
 * Practice deck fixtures for the multi-game FAB simulator.
 * Canonical definitions live in `@tcg/flesh-and-blood-engine` automation.
 */
export {
  DEFAULT_PLAYER_DECK_ID,
  DEFAULT_BOT_DECK_ID,
  FAB_DECK_TEXT_FIXTURES,
  getFabDeckTextFixture,
  getFabDeckTextFixturesByFormat,
  type FabDeckTextFixture,
  type FabDeckFormat,
} from "@tcg/flesh-and-blood-engine/simulator";

export {
  FAB_PRACTICE_DECK_OPTIONS,
  FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL,
  FAB_PRACTICE_DECK_FORMAT_GROUP_ORDER,
  getFabPracticeDeckOption,
  getFabPracticeDeckOptionsByFormatGroup,
  listFabPracticeDeckOptionGroups,
  pickRandomClassicConstructedDeckId,
  pickRandomClassicConstructedMatchup,
  type FabPracticeDeckFormatGroup,
  type FabPracticeDeckOption,
} from "./practice-deck-options";

export { createFabLocalPracticeMatch } from "./create-local-practice-match";

export {
  buildFabPracticeMatchupFixture,
  createFabPracticeMatchup,
} from "./practice-matchup-fixture";

export {
  parseFabDeckTextLine,
  resolveCatalogCardByName,
  resolvePracticeDeckSelection,
  type ParsedFabDeckTextLine,
  type ResolvedPracticeSeat,
} from "./resolve-text-deck";
