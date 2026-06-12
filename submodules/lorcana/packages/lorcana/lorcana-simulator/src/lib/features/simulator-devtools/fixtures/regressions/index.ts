import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";
import { createFixtureRegistry } from "../registry.js";
import { wardHiddenZoneSelectionRegressionFixture } from "./ward-hidden-zone-selection.js";
import { shiftingThenSingingUnderTheSea } from "@/features/simulator-devtools/fixtures/regressions/shifting-then-singing-under-the-sea";
import { moanaBlackCauldron } from "@/features/simulator-devtools/fixtures/regressions/moana-black-cauldron";
import { retroEvolutionDeviceGenie } from "@/features/simulator-devtools/fixtures/regressions/retro-evolution-device-genie";
import { bug01MadamMimSneakyMove } from "./2026-04-22/bug-01-madam-mim-sneaky-move.js";
import { bug02DinkyHasTheBrains } from "./2026-04-22/bug-02-dinky-has-the-brains.js";
import { bug03CheshireCatInexplicable } from "./2026-04-22/bug-03-cheshire-cat-inexplicable.js";
import { bug04BeKingUndisputed } from "./2026-04-22/bug-04-be-king-undisputed.js";
import { bug05MulanEliteArcher } from "./2026-04-22/bug-05-mulan-elite-archer.js";
import { bug06BlackCauldron } from "./2026-04-22/bug-06-black-cauldron.js";
import { bug07DonaldDuckPerfectGentleman } from "./2026-04-22/bug-07-donald-duck-perfect-gentleman.js";
import { bug08HerculesSpectralDemigod } from "./2026-04-22/bug-08-hercules-spectral-demigod.js";
import { bug09CinderellaDreamComeTrue } from "./2026-04-22/bug-09-cinderella-dream-come-true.js";
import { bug11OhanaMeansFamily } from "./2026-04-22/bug-11-ohana-means-family.js";
import { bug12ScroogeReformedEbenezer } from "./2026-04-22/bug-12-scrooge-reformed-ebenezer.js";
import { bug13MeekoSkittishScrounger } from "./2026-04-22/bug-13-meeko-skittish-scrounger.js";
import { bug14PlutoSteelBodyguard } from "./2026-04-22/bug-14-pluto-steel-bodyguard.js";
import { bug15EmeraldChromicon } from "./2026-04-22/bug-15-emerald-chromicon.js";
import { bug16AnastasiaBossyStepsister } from "./2026-04-22/bug-16-anastasia-bossy-stepsister.js";
import { bug17AuroraDreamingGuardian } from "./2026-04-22/bug-17-aurora-dreaming-guardian.js";
import { bug18PowerlineMusicalSuperstar } from "./2026-04-22/bug-18-powerline-musical-superstar.js";
import { bug19MaxGoofChartTopper } from "./2026-04-22/bug-19-max-goof-chart-topper.js";
import { bug20FaZhouWarHero } from "./2026-04-22/bug-20-fa-zhou-war-hero.js";
import { bug21MulanReadyForBattle } from "./2026-04-22/bug-21-mulan-ready-for-battle.js";
import { bug23SimbaPrideProtector } from "./2026-04-22/bug-23-simba-pride-protector.js";
import { bug24MauiHalfShark } from "./2026-04-22/bug-24-maui-half-shark.js";
import { bug25AnnaSoothingSisterShiftZero } from "./2026-04-22/bug-25-anna-soothing-sister-shift-zero.js";
import { bug26TodKnowsAllTheTricks } from "./2026-04-22/bug-26-tod-knows-all-the-tricks.js";
import { bug27BasilDisguisedDetective } from "./2026-04-22/bug-27-basil-disguised-detective.js";
import { bug28HiroHamadaArmorDesigner } from "./2026-04-22/bug-28-hiro-hamada-armor-designer.js";
import { bug29DemonaRoyalGuard } from "./2026-04-22/bug-29-demona-royal-guard.js";
import { bug30PullTheLeverVsIagoVanish } from "./2026-04-22/bug-30-pull-the-lever-vs-iago-vanish.js";
import { bug31PeteGhostOfChristmasFuture } from "./2026-04-22/bug-31-pete-ghost-of-christmas-future.js";
import { bug32GoofyEmeraldChampion } from "./2026-04-22/bug-32-goofy-emerald-champion.js";
import { bug33VincenzoSantorini } from "./2026-04-22/bug-33-vincenzo-santorini.js";
import { bug34RobinHoodSharpshooterFixture } from "./2026-04-22/bug-34-robin-hood-sharpshooter.js";
import { bug35MobSongFixture } from "./2026-04-22/bug-35-mob-song.js";
import { bug36BelleAccomplishedMysticFixture } from "./2026-04-22/bug-36-belle-accomplished-mystic.js";
import { bug37TinkerBellGiantFairyFixture } from "./2026-04-22/bug-37-tinker-bell-giant-fairy.js";
import { bug38ElsaSpiritOfWinterFixture } from "./2026-04-22/bug-38-elsa-spirit-of-winter.js";
import { bug39OlafHelpingHandFixture } from "./2026-04-22/bug-39-olaf-helping-hand.js";
import { bug40ResistCardsUnderFixture } from "./2026-04-22/bug-40-resist-cards-under.js";
import { bug41DonaldFlusteredLoreWinFixture } from "./2026-04-22/bug-41-donald-flustered-lore-win.js";
import { bug42DemonaMatchLogFixture } from "./2026-04-22/bug-42-demona-match-log.js";
import { bug43KristoffIcyExplorerFixture } from "./2026-04-22/bug-43-kristoff-icy-explorer.js";
import { bug43TianaRestaurantOwnerFixture } from "./2026-04-22/bug-43-tiana-restaurant-owner.js";
import { bug44BroadwayBodyguardLocationFixture } from "./2026-04-22/bug-44-broadway-bodyguard-location.js";
import { bug45MoanaKakamoraLeaderGatheringForcesFixture } from "./2026-04-22/bug-45-moana-kakamora-leader-gathering-forces.js";
import { bug46WoodyJungleGuideOptionalPlay } from "./2026-04-22/bug-46-woody-jungle-guide-optional-play.js";
import { bug47LeviathanStrengthBudget } from "./2026-05-04/bug-47-leviathan-strength-budget.js";
import { bug48TouchTheSkySingThenMove } from "./2026-05-04/bug-48-touch-the-sky-sing-then-move.js";
import { bug49TransportPodConfirm } from "./2026-05-04/bug-49-transport-pod-confirm.js";
import { bug50GoofySetForAdventureConfirm } from "./2026-05-04/bug-50-goofy-set-for-adventure-confirm.js";
import { bug51QueenOpponentDiscardOnly } from "./2026-05-04/bug-51-queen-opponent-discard-only.js";
import { bug52KingCandyOpponentChooser } from "./2026-05-04/bug-52-king-candy-opponent-chooser.js";
import { bug53HeiheiHornedKingDiscardMetric } from "./2026-05-04/bug-53-heihei-horned-king-discard-metric.js";
import { bug54KidaBoostDiscardMetric } from "./2026-05-04/bug-54-kida-boost-discard-metric.js";
import { bug55AnnaSoothingSisterWarmHeart } from "./2026-05-04/bug-55-anna-soothing-sister-warm-heart.js";
import { bug56GadgetRangerPlaneSupport } from "./2026-05-04/bug-56-gadget-ranger-plane-support.js";
import { bug57ThunderquackVillainClassification } from "./2026-05-04/bug-57-thunderquack-villain-classification.js";
import { bug58GrandmotherFaThisTurnDuration } from "./2026-05-04/bug-58-grandmother-fa-this-turn-duration.js";
import { bug59LadyDavidBodyguardExerted } from "./2026-05-04/bug-59-lady-david-bodyguard-exerted.js";
import { bug60MickeyExpeditionMayEnterExerted } from "./2026-05-04/bug-60-mickey-expedition-may-enter-exerted.js";
import { bug61SyndromeOutForRevengeRobotFilter } from "./2026-05-04/bug-61-syndrome-out-for-revenge-robot-filter.js";
import { bug62JessieEmptyOpponentField } from "./2026-05-04/bug-62-jessie-empty-opponent-field.js";
import { bug63RollerBobNoToys } from "./2026-05-04/bug-63-roller-bob-no-toys.js";
import { bug64HeiheiExpandedClearYourMind } from "./2026-05-04/bug-64-heihei-expanded-clear-your-mind.js";
import { bug65ThreeArrowsDifferentTargets } from "./2026-05-04/bug-65-three-arrows-different-targets.js";
import { bug66DesperatePlanDiscardStep } from "./2026-05-04/bug-66-desperate-plan-discard-step.js";
import { bug67LuisaMadrigalZeroDamage } from "./2026-05-04/bug-67-luisa-madrigal-zero-damage.js";
import { bug68ScroogeShushOnChallenged } from "./2026-05-04/bug-68-scrooge-shush-on-challenged.js";
import { bug69DonaldFredHoneywellDoubleTrigger } from "./2026-05-04/bug-69-donald-fred-honeywell-double-trigger.js";
import { bug70WoodyEveryoneGatherRound } from "./2026-05-04/bug-70-woody-everyone-gather-round.js";
import { beKingUndisputedSet9 } from "./2026-05-08/be-king-undisputed-set9.js";
import { sidPhillipsToySurgeonRegression } from "./2026-05-08/sid-phillips-toy-surgeon.js";
import { leviathansLairHandVsPlayRegression } from "./2026-05-19/leviathans-lair-hand-vs-play.js";
import { meridaMosquitoBitePutDamageRegression } from "./2026-05-20/merida-mosquito-bite-put-damage.js";

const regressionFixtureRegistry = createFixtureRegistry(
  [
    wardHiddenZoneSelectionRegressionFixture,
    shiftingThenSingingUnderTheSea,
    moanaBlackCauldron,
    retroEvolutionDeviceGenie,
    // --- 2026-04-22 QA validation batch ---
    bug01MadamMimSneakyMove,
    bug02DinkyHasTheBrains,
    bug03CheshireCatInexplicable,
    bug04BeKingUndisputed,
    bug05MulanEliteArcher,
    bug06BlackCauldron,
    bug07DonaldDuckPerfectGentleman,
    bug08HerculesSpectralDemigod,
    bug09CinderellaDreamComeTrue,
    bug11OhanaMeansFamily,
    bug12ScroogeReformedEbenezer,
    bug13MeekoSkittishScrounger,
    bug14PlutoSteelBodyguard,
    bug15EmeraldChromicon,
    bug16AnastasiaBossyStepsister,
    bug17AuroraDreamingGuardian,
    bug18PowerlineMusicalSuperstar,
    bug19MaxGoofChartTopper,
    bug20FaZhouWarHero,
    bug21MulanReadyForBattle,
    bug23SimbaPrideProtector,
    bug24MauiHalfShark,
    bug25AnnaSoothingSisterShiftZero,
    bug26TodKnowsAllTheTricks,
    bug27BasilDisguisedDetective,
    bug28HiroHamadaArmorDesigner,
    bug29DemonaRoyalGuard,
    bug30PullTheLeverVsIagoVanish,
    bug31PeteGhostOfChristmasFuture,
    bug32GoofyEmeraldChampion,
    bug33VincenzoSantorini,
    bug34RobinHoodSharpshooterFixture,
    bug35MobSongFixture,
    bug36BelleAccomplishedMysticFixture,
    bug37TinkerBellGiantFairyFixture,
    bug38ElsaSpiritOfWinterFixture,
    bug39OlafHelpingHandFixture,
    bug40ResistCardsUnderFixture,
    bug41DonaldFlusteredLoreWinFixture,
    bug42DemonaMatchLogFixture,
    bug43KristoffIcyExplorerFixture,
    bug43TianaRestaurantOwnerFixture,
    bug44BroadwayBodyguardLocationFixture,
    bug45MoanaKakamoraLeaderGatheringForcesFixture,
    bug46WoodyJungleGuideOptionalPlay,
    // --- 2026-05-04 QA validation batch ---
    bug47LeviathanStrengthBudget,
    bug48TouchTheSkySingThenMove,
    bug49TransportPodConfirm,
    bug50GoofySetForAdventureConfirm,
    bug51QueenOpponentDiscardOnly,
    bug52KingCandyOpponentChooser,
    bug53HeiheiHornedKingDiscardMetric,
    bug54KidaBoostDiscardMetric,
    bug55AnnaSoothingSisterWarmHeart,
    bug56GadgetRangerPlaneSupport,
    bug57ThunderquackVillainClassification,
    bug58GrandmotherFaThisTurnDuration,
    bug59LadyDavidBodyguardExerted,
    bug60MickeyExpeditionMayEnterExerted,
    bug61SyndromeOutForRevengeRobotFilter,
    bug62JessieEmptyOpponentField,
    bug63RollerBobNoToys,
    bug64HeiheiExpandedClearYourMind,
    bug65ThreeArrowsDifferentTargets,
    bug66DesperatePlanDiscardStep,
    bug67LuisaMadrigalZeroDamage,
    bug68ScroogeShushOnChallenged,
    bug69DonaldFredHoneywellDoubleTrigger,
    bug70WoodyEveryoneGatherRound,
    // --- 2026-05-08 ---
    beKingUndisputedSet9,
    sidPhillipsToySurgeonRegression,
    // --- 2026-05-19 ---
    leviathansLairHandVsPlayRegression,
    // --- 2026-05-20 ---
    meridaMosquitoBitePutDamageRegression,
  ] satisfies LorcanaSimulatorFixture[],
  "simulator regression fixtures",
);

export const LORCANA_REGRESSION_FIXTURE_LIST = regressionFixtureRegistry.list;
export const LORCANA_REGRESSION_FIXTURE_MAP = regressionFixtureRegistry.byId;
export const LORCANA_REGRESSION_FIXTURES = regressionFixtureRegistry.record;

export function getLorcanaRegressionFixture(fixtureId: string): LorcanaSimulatorFixture {
  const fixture = LORCANA_REGRESSION_FIXTURES[fixtureId];
  if (!fixture) {
    throw new Error(`Regression fixture "${fixtureId}" not found`);
  }

  return fixture;
}
