import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";

import { boardPressureFixture } from "./board-pressure.js";
import { cardStatesFixture } from "./card-states.js";
import { emptyBoardFixture } from "./empty-board.js";
import { lateGameFixture } from "./late-game.js";
import { openingHandFixture } from "./opening-hand.js";
import { openingSkirmishFixture } from "./opening-skirmish.js";
import { preGameFixture } from "./pre-game.js";
import { winStateFixture } from "./win-state.js";
import { fullBoardAllCardTypes } from "./full-board-all-card-types.js";
import { lookAtTheTopFixture } from "./look-at-the-top.js";
import { shiftFixture } from "./shift.js";
import { challengeKeywordsFixture } from "./challenge-keywords.js";
import { defensiveKeywordsFixture } from "./defensive-keywords.js";
import { questKeywordsFixture } from "./quest-keywords.js";
import { boostKeywordFixture } from "./boost-keyword.js";
import { multipleTriggers } from "./multiple-triggers.js";
import { discardEffectsFixture } from "./discard-effects.js";
import { modalAbilitiesFixture } from "./modal-abilities.js";
import { monstroComboFixture } from "./monstro-combo.js";
import { moveDamageFixture } from "./move-damage.js";
import { playerSelectionFixture } from "./player-selection.js";
import { alternativeCostsFixture } from "./alternative-costs.js";
import { bibbidiBobbidiBooFixture } from "./bibbidi-bobbidi-boo.js";
import { pongoDearOldDadFixture } from "./pongo-dear-old-dad.js";
import { singSecondStarFixture } from "./sing-second-star.js";
import { sugarRushSpeedwayStartingLineFinishLineFixture } from "./sugar-rush-speedway-starting-line-finish-line.js";
import { triage20260505DiabloDiscardShiftFixture } from "./triage-2026-05-05-diablo-discard-shift.js";
import { triage20260505EmeraldChromiconBanishTriggerFixture } from "./triage-2026-05-05-emerald-chromicon-banish-trigger.js";
import { triage20260505GoofySetForAdventureFixture } from "./triage-2026-05-05-goofy-set-for-adventure.js";
import { triage20260505LuciferMouseCatcherFixture } from "./triage-2026-05-05-lucifer-mouse-catcher.js";
import { triage20260505MadHatterScryFixture } from "./triage-2026-05-05-mad-hatter-scry.js";
import { triage20260505MufasaBogoRevealPlayFixture } from "./triage-2026-05-05-mufasa-bogo-reveal-play.js";
import { triage20260505SyndromePlayOrShiftFixture } from "./triage-2026-05-05-syndrome-play-or-shift.js";
import { triage20260505ThreeArrowsMeridaBanishFixture } from "./triage-2026-05-05-three-arrows-merida-banish.js";
import { triage20260505TouchTheSkyFixture } from "./triage-2026-05-05-touch-the-sky.js";
import { triage20260506BrawlCastMauiRushChallengeFixture } from "./triage-2026-05-06-brawl-cast-maui-rush-challenge.js";
import { triage20260508ShereKhanSkipOptionalFixture } from "./triage-2026-05-08-shere-khan-skip-optional.js";
import { triage20260511DinBodyguardEnterExertedFixture } from "./triage-2026-05-11-din-bodyguard-enter-exerted.js";
import { triage20260514BibbidiBobbidiBooFixture } from "./triage-2026-05-14-bibbidi-bobbidi-boo.js";
import { triage20260514CaptainHookUnderhandedFixture } from "./triage-2026-05-14-captain-hook-underhanded.js";
import { triage20260514LuisaConfidentClimberFixture } from "./triage-2026-05-14-luisa-confident-climber.js";
import { triage20260514TheFamilyScatteredFixture } from "./triage-2026-05-14-the-family-scattered.js";
import { triage20260514MushuMajesticDragonFixture } from "./triage-2026-05-14-mushu-majestic-dragon.js";
import { triage20260514BeastSnowfieldTroublemakerFixture } from "./triage-2026-05-14-beast-snowfield-troublemaker.js";
import { triage20260514SwordOfShanyuFixture } from "./triage-2026-05-14-sword-of-shan-yu.js";
import { triage20260514ChernabogUnnaturalForceFixture } from "./triage-2026-05-14-chernabog-unnatural-force.js";
import { triage20260514AnnaTrustingSisterFixture } from "./triage-2026-05-14-anna-trusting-sister.js";
import { triage20260514MrsIncredibleRegroupFixture } from "./triage-2026-05-14-mrs-incredible-regroup.js";
import { triage20260514AlmaMadrigalLeadingTheWayFixture } from "./triage-2026-05-14-alma-madrigal-leading-the-way.js";
import { triage20260514MrIncredibleSuperStrongFixture } from "./triage-2026-05-14-mr-incredible-super-strong.js";
import { triage20260514TamatoaHappyAsAClamFixture } from "./triage-2026-05-14-tamatoa-happy-as-a-clam.js";
import { triage20260514FergusOutpostBuilderFixture } from "./triage-2026-05-14-fergus-outpost-builder.js";
import { triage20260514ThisGrowingPressureFixture } from "./triage-2026-05-14-this-growing-pressure.js";
import { triage20260514CantHoldItBackAnymoreFixture } from "./triage-2026-05-14-cant-hold-it-back-anymore.js";
import { triage20260514OmnidroidV9ShiftFixture } from "./triage-2026-05-14-omnidroid-v9-shift.js";
import { triage20260515HandInTheBoxSpringLoadedFixture } from "./triage-2026-05-15-hand-in-the-box-spring-loaded.js";
import { triage20260516LuisaAndIsabelaFeelBetterFixture } from "./triage-2026-05-16-luisa-and-isabela-feel-better.js";
import { triage20260518BeyondTheHorizonEmptyHandFixture } from "./triage-2026-05-18-beyond-the-horizon-empty-hand.js";
import { triage20260518LuisaMulanMoveDamageFixture } from "./triage-2026-05-18-luisa-mulan-move-damage.js";
import { triage20260520FergusDiscardLocationFixture } from "./triage-2026-05-20-fergus-discard-location.js";
import { triage20260520SimbaCinderellaFreePlayFixture } from "./triage-2026-05-20-simba-cinderella-free-play.js";
import {
  triage20260522LiquidatorTurnOneExpectationFixture,
  triage20260522WoodyUnderTheSeaToyFollowupFixture,
} from "./triage-2026-05-22-manual-validation.js";
import {
  triage20260518BlackCauldronMufasaFixture,
  triage20260518EducationOrEliminationChoiceFixture,
  triage20260518FireflySwarmChoiceFixture,
  triage20260518FireflySwarmDiscardMetricFixture,
  triage20260518FireflySwarmRobinHoodFixture,
  triage20260518LuisaUndamagedSourceFixture,
  triage20260518MegaBotDestroyChoiceFixture,
} from "./triage-2026-05-18-daily-feedback.js";
import {
  triage20260517BibbidiAnotherCharacterFixture,
  triage20260517CheshireCatBoostMoveOneFixture,
  triage20260517HadesTargetClarityFixture,
  triage20260517HammPiggyBankExertFixture,
  triage20260517KristoffsLutePlayTopFixture,
  triage20260517LeviathanReturnOfHerculesFixture,
  triage20260517LyleDirtyTricksFixture,
  triage20260517MirabelCuriousChildRevealFixture,
  triage20260517SidDoublePrizesFixture,
  triage20260517TianaDaleBotChallengeFixture,
  triage20260517UnderTheSeaSingTogetherFixture,
  triage20260517WindUpFrogToyBanishFixture,
} from "./triage-2026-05-17-remaining.js";
import { createFixtureRegistry } from "./registry.js";

export const DEFAULT_LORCANA_FIXTURE_ID = "empty-board";

/**
 * Lorcana Simulator Fixtures
 *
 * These fixtures use REAL card definitions from @tcg/lorcana-cards.
 * Each card has full abilities, stats, and effects - just like in production.
 */
const fixtureRegistry = createFixtureRegistry(
  [
    emptyBoardFixture,
    openingHandFixture,
    openingSkirmishFixture,
    boardPressureFixture,
    lateGameFixture,
    preGameFixture,
    winStateFixture,
    cardStatesFixture,
    fullBoardAllCardTypes,
    lookAtTheTopFixture,
    shiftFixture,
    challengeKeywordsFixture,
    defensiveKeywordsFixture,
    questKeywordsFixture,
    boostKeywordFixture,
    multipleTriggers,
    discardEffectsFixture,
    modalAbilitiesFixture,
    playerSelectionFixture,
    monstroComboFixture,
    moveDamageFixture,
    alternativeCostsFixture,
    bibbidiBobbidiBooFixture,
    pongoDearOldDadFixture,
    singSecondStarFixture,
    sugarRushSpeedwayStartingLineFinishLineFixture,
    triage20260505GoofySetForAdventureFixture,
    triage20260505TouchTheSkyFixture,
    triage20260505DiabloDiscardShiftFixture,
    triage20260505MadHatterScryFixture,
    triage20260505MufasaBogoRevealPlayFixture,
    triage20260505SyndromePlayOrShiftFixture,
    triage20260505ThreeArrowsMeridaBanishFixture,
    triage20260505LuciferMouseCatcherFixture,
    triage20260505EmeraldChromiconBanishTriggerFixture,
    triage20260506BrawlCastMauiRushChallengeFixture,
    triage20260508ShereKhanSkipOptionalFixture,
    triage20260511DinBodyguardEnterExertedFixture,
    triage20260514LuisaConfidentClimberFixture,
    triage20260514BibbidiBobbidiBooFixture,
    triage20260514CaptainHookUnderhandedFixture,
    triage20260514TheFamilyScatteredFixture,
    triage20260514MushuMajesticDragonFixture,
    triage20260514BeastSnowfieldTroublemakerFixture,
    triage20260514SwordOfShanyuFixture,
    triage20260514ChernabogUnnaturalForceFixture,
    triage20260514AnnaTrustingSisterFixture,
    triage20260514MrsIncredibleRegroupFixture,
    triage20260514AlmaMadrigalLeadingTheWayFixture,
    triage20260514MrIncredibleSuperStrongFixture,
    triage20260514TamatoaHappyAsAClamFixture,
    triage20260514FergusOutpostBuilderFixture,
    triage20260514ThisGrowingPressureFixture,
    triage20260514CantHoldItBackAnymoreFixture,
    triage20260514OmnidroidV9ShiftFixture,
    triage20260515HandInTheBoxSpringLoadedFixture,
    triage20260516LuisaAndIsabelaFeelBetterFixture,
    triage20260518LuisaMulanMoveDamageFixture,
    triage20260518FireflySwarmChoiceFixture,
    triage20260518FireflySwarmDiscardMetricFixture,
    triage20260518FireflySwarmRobinHoodFixture,
    triage20260518EducationOrEliminationChoiceFixture,
    triage20260518MegaBotDestroyChoiceFixture,
    triage20260518BlackCauldronMufasaFixture,
    triage20260518LuisaUndamagedSourceFixture,
    triage20260517TianaDaleBotChallengeFixture,
    triage20260517KristoffsLutePlayTopFixture,
    triage20260517LeviathanReturnOfHerculesFixture,
    triage20260517HammPiggyBankExertFixture,
    triage20260517MirabelCuriousChildRevealFixture,
    triage20260517BibbidiAnotherCharacterFixture,
    triage20260517HadesTargetClarityFixture,
    triage20260517CheshireCatBoostMoveOneFixture,
    triage20260517WindUpFrogToyBanishFixture,
    triage20260517LyleDirtyTricksFixture,
    triage20260517SidDoublePrizesFixture,
    triage20260517UnderTheSeaSingTogetherFixture,
    triage20260518BeyondTheHorizonEmptyHandFixture,
    triage20260520FergusDiscardLocationFixture,
    triage20260520SimbaCinderellaFreePlayFixture,
    triage20260522WoodyUnderTheSeaToyFollowupFixture,
    triage20260522LiquidatorTurnOneExpectationFixture,
  ] satisfies LorcanaSimulatorFixture[],
  "general simulator fixtures",
);

export const LORCANA_SIMULATOR_FIXTURE_LIST = fixtureRegistry.list;
export const LORCANA_SIMULATOR_FIXTURE_MAP = fixtureRegistry.byId;
export const LORCANA_SIMULATOR_FIXTURES = fixtureRegistry.record;

export const getLorcanaFixture = (fixtureId: string): LorcanaSimulatorFixture => {
  const fixture =
    LORCANA_SIMULATOR_FIXTURES[fixtureId] ?? LORCANA_SIMULATOR_FIXTURES[DEFAULT_LORCANA_FIXTURE_ID];

  if (!fixture) {
    throw new Error(
      `Fixture "${fixtureId}" not found and default fixture "${DEFAULT_LORCANA_FIXTURE_ID}" is also missing`,
    );
  }

  return fixture;
};

/**
 * Helper to get card display name from a card definition
 */
export const getCardDisplayName = (card: { name: string; version?: string }): string => {
  if (card.version) {
    return `${card.name} - ${card.version}`;
  }
  return card.name;
};
