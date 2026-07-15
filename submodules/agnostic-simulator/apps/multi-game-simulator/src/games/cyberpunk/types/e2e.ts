/**
 * Shared types between the React simulator app and the Playwright e2e harness.
 *
 * IMPORTANT: This file must be importable by BOTH the React app's `src/**` code
 * AND the e2e tsconfig (which is scoped to `e2e/**` and only includes `node`
 * library types). To keep that contract, this file:
 *
 *   - Has zero runtime exports — every export is a `type` declaration.
 *   - Imports only type-only declarations from `@tcg/cyberpunk-engine`.
 *   - MUST NOT import from React, dnd-kit, react-router-dom, or any runtime
 *     module that has side effects or pulls DOM/React types into the e2e
 *     typecheck.
 *
 * If you find yourself wanting to add a runtime helper here, put it elsewhere
 * (e.g. `src/engine/`) and keep this file types-only.
 */

import type { PlayerId } from "@tcg/cyberpunk-engine";
import type { CardType } from "@tcg/cyberpunk-types";

/**
 * Identifier for one of the demo scenarios bootstrapped by
 * `src/games/cyberpunk/engine/fixtures/scenarios/`. The runtime registry of
 * scenarios lives there; this file owns only the type so the e2e harness can
 * reference it without dragging scenario fixture modules (and their
 * `@tcg/cyberpunk-cards` runtime deps) into the e2e typecheck.
 *
 * Keep this union in sync with the SCENARIO entries in `fixtures/scenarios/`. The
 * compiler enforces it: `SCENARIO_SEEDS: Record<ScenarioId, string>` over there
 * fails if the union and the entries drift apart.
 */
export type ScenarioGroup =
  | "core"
  | "program-spend"
  | "program-bounce"
  | "program-gig"
  | "program-power"
  | "program-gig-manipulation"
  | "program-cost-modifier"
  | "program-legend-call"
  | "gear-attack-trigger"
  | "gear-blocker"
  | "gear-stat-boost"
  | "gear-rush"
  | "gear-fight-reward"
  | "gear-gig-steal"
  | "gear-spent-trigger"
  | "legend-go-solo"
  | "legend-passive"
  | "legend-attack-trigger"
  | "legend-call-trigger"
  | "legend-defeated"
  | "legend-qa"
  | "unit-blocker"
  | "unit-gig-stolen"
  | "unit-power-scaling"
  | "unit-street-cred"
  | "unit-play-trigger"
  | "unit-attack-trigger"
  | "unit-defeated"
  | "unit-gig-condition"
  | "unit-vanilla"
  | "unit-activated"
  | "unit-rush";

export type ScenarioId =
  | "gameStart"
  | "retailCardCatalog"
  | "retailProgramTargetBench"
  | "retailCombatGigBench"
  | "retailGearLegendBench"
  | "mobileLedgerZeroLegends"
  | "mobileLedgerOneLegend"
  | "mobileLedgerTwoLegends"
  | "mobileLedgerThreeLegends"
  | "mobileLedgerFriendlyOneRivalThree"
  | "mobileLedgerFriendlyZeroRivalTwo"
  | "retailPr2295Cards"
  | "retailNewCardAbilities"
  | "openingMain"
  | "attackStep"
  | "stealGigTest"
  | "reactStep"
  | "chooseCardTarget"
  | "opponentTurn"
  | "endGame"
  | "progCorporateSurveillance"
  | "progCorporateSurveillanceNoTargets"
  | "progFloorIt"
  | "progFloorItNoTargets"
  | "progIndustrialAssembly"
  | "progIndustrialAssemblyHighCred"
  | "progRebootOptics"
  | "progRebootOpticsEmptyField"
  | "progAfterpartyAtLizzies"
  | "progFoolOnTheHill"
  | "progCyberpsychosis"
  | "progChromeReverie"
  | "gearDyingNightHighCred"
  | "gearDyingNightLowCred"
  | "gearKiroshiOptics"
  | "gearKiroshiOpticsNoFaceDown"
  | "gearMandibularUpgrade"
  | "gearMantisBlades"
  | "gearSandevistan"
  | "gearSatoriSwordOfSaburo"
  | "gearGorillaArms"
  | "gearGorillaArmsRetail"
  | "gearZetatechFaceplate"
  | "gearZetatechFaceplateRetail"
  | "gearAttachToGoSoloLegend"
  | "legendVCorporateExile"
  | "legendGoroTakemuraHandsUnclean"
  | "legendVStreetkid"
  | "legendRoycePsychoOnTheEdge"
  | "legendAltCunninghamSoulkillerArchitect"
  | "legendSaburoArasakaStubbornPatriach"
  | "legendYorinobuArasakaEmbracingDestruction"
  | "legendJackieWellesPourOneOutForMe"
  | "legendViktorVektorSitDownAndRelax"
  | "legendViktorOpponentPrivateSearch"
  | "legendEvelynParkerBeautifulEnigma"
  | "legendRiverWardDetectiveOnTheHunt"
  | "legendDumDumMaelstromTriggerman"
  | "legendPanamPalmerNomadCavalry"
  | "legendGoroTakemuraVengefulBodyguard"
  | "legendLucynaKushinada"
  | "legendVStreetkidRetail"
  | "legendAltCunninghamSoulkillerArchitectRetail"
  | "legendRoycePsychoOnTheEdgeRetail"
  | "legendDumDumMaelstromTriggermanRetail"
  | "legendEvelynParkerBeautifulEnigmaRetail"
  | "legendGoroTakemuraVengefulBodyguardRetail"
  | "legendPanamPalmerNomadCavalryRetail"
  | "legendRiverWardDetectiveOnTheHuntRetail"
  | "progBootlegBlackSapphireShowRetail"
  | "progCarnageAtTheColosseumRetail"
  | "progChromeReverieRetail"
  | "progCyberpsychosisRetail"
  | "progPeaceOfferingRetail"
  | "unitSecondhandBombus"
  | "unitCorpoSecurity"
  | "unitDelamainCab"
  | "unitEmergencyAtlus"
  | "unitSwordwiseHuscle"
  | "unitTBugAmateurPhilosopher"
  | "unitRuthlessLowlife"
  | "unitWelcomeToNightCityRetailMoxIncitersMustAttack"
  | "unitEvelynParkerSchemingSiren"
  | "unitJackieWellesRideOrDieChoom"
  | "unitGoroTakemuraLosingHisWay"
  | "unitMt0d12Flathead"
  | "unitArmoredMinotaur"
  | "unitHanakoArasakaInAGildedCage"
  | "unitGildedMaton"
  | "unitMamanBrigitte"
  | "unitPlacideVoodooSentinel"
  | "unitAdamSmasherMetalOverMeat"
  | "unitElSombreronLaVenganzaLenta"
  | "unitCaliberTotentanzSTopDog"
  | "unitMeredithStoutStoneColdCorpo"
  | "unitKerryEurodyneTheLastRockerboy"
  | "unitRidingNomad"
  | "unitRoyceDonTCallMeSimonHighCred"
  | "unitRoyceDonTCallMeSimonLowCred"
  | "unitSandayuOdaHanakoSGuardian"
  | "unitAdamSmasherMetalOverMeatRetail"
  | "unitCaliberTotentanzSTopDogRetail"
  | "unitElSombreronLaVenganzaLentaRetail"
  | "unitGildedMatonRetail"
  | "unitHanakoArasakaInAGildedCageRetail"
  | "unitKerryEurodyneTheLastRockerboyRetail"
  | "unitMamanBrigitteRetail"
  | "unitMeredithStoutStoneColdCorpoRetail"
  | "unitModdedKusanagiRetail"
  | "unitPlacideVoodooSentinelRetail"
  | "unitRidingNomadRetail"
  | "unitRoyceDonTCallMeSimonHighCredRetail"
  | "unitRoyceDonTCallMeSimonLowCredRetail"
  | "unitSandayuOdaHanakoSGuardianRetail"
  | "unitWraithMaraudersRetail"
  | "legendVCorporateExileRetail"
  | "legendGoroTakemuraHandsUncleanRetail"
  | "legendJackieWellesPourOneOutForMeRetail"
  | "legendSaburoArasakaStubbornPatriachRetail"
  | "legendYorinobuArasakaEmbracingDestructionRetail"
  | "legendViktorVektorSitDownAndRelaxRetail"
  | "legendRebeccaHavingAMomentPrm01"
  | "legendTheHeistVCorporateExile"
  | "legendTheHeistJackieWellesPourOneOutForMe"
  | "legendEmbracingGoroTakemuraHandsUnclean"
  | "legendEmbracingSaburoArasakaStubbornPatriarch"
  | "legendEmbracingYorinobuArasakaEmbracingDestruction"
  | "unitTheHeistDexterDeshawnOneLastChance"
  | "unitTheHeistMt0d12Flathead"
  | "unitEmbracingGoroTakemuraLosingHisWay"
  | "unitEmbracingMinotaur"
  | "progPeaceOffering"
  | "progCarnageAtTheColosseum"
  | "progCarnageAtTheColosseumCostReduction"
  | "legendAdamSmasherEnderOfLegendsRetail"
  | "legendKerryEurodyneAxeAttitudeAudienceRetail"
  | "legendSashaYakovlevaWonTLetYouDownRetail"
  | "legendQaPromosAndV"
  | "legendQaArasakaPressure"
  | "legendQaBlueSetup"
  | "legendQaReactionTools"
  | "legendQaGearTempo"
  | "legendQaLateGameThreats"
  | "legendQaVStreetkidAndPrintParity"
  | "legendQaEmbracingPowerPrints"
  | "unit6thStreetRecruitsRetail"
  | "unitAugmentedNegotiatorsRetail"
  | "unitJackedInVoodooBoyRetail"
  | "unitLaLloronaGhostOfThePastRetail"
  | "unitLizzyWizzyDelicateWeaponRetail"
  | "unitMistyOlszewskiMenderOfBrokenSpiritsRetail"
  | "unitNadiaFightingThroughGriefRetail"
  | "unitOffdutyMalfiniRetail"
  | "unitSaulBrightStormriderRetail"
  | "unitScrewLovelornFoolRetail"
  | "unitSketchyRipperRetail"
  | "unitYorinobuArasakaSteelDragonRetail"
  | "gearOverwatchPanamsGiftRetail"
  | "progAllIsLostRetail"
  | "progOverTheEdgeRetail"
  | "progTakeControlRetail"
  | "unitFieldOperatorRetail"
  | "unitMoxIncitersRetail"
  | "unitPsychoSquadRetail"
  | "unitViktorVektorYouMightFeelALittlePinchRetail";

/**
 * Discriminated union of UI-driven engine actions. Each maps 1:1 onto a method
 * on `CyberpunkTestEngine`. Adding a new action means: (a) add a variant here,
 * (b) handle it in the dispatch switch in `EngineProvider`. This keeps the UI
 * → engine surface narrow and easy to audit.
 *
 * Mirrored to e2e so specs can write strongly-typed `expectLastDispatch` calls
 * (e.g. `{ type: "mulligan", as: P1 }`) instead of stringly-typed `Record`s.
 */
export type EngineAction =
  | { type: "playCard"; cardId: string; attachToId?: string; as?: PlayerId }
  | { type: "sellCard"; cardId: string; as?: PlayerId }
  | { type: "callLegend"; cardId: string; as?: PlayerId }
  | { type: "goSolo"; cardId: string; as?: PlayerId }
  | {
      type: "attackUnit";
      attackerId: string;
      defenderId: string;
      as?: PlayerId;
    }
  | { type: "attackRival"; attackerId: string; as?: PlayerId }
  | { type: "useBlocker"; blockerId: string; as?: PlayerId; success?: boolean }
  | { type: "activateAbility"; cardId: string; abilityIndex: number; as?: PlayerId }
  | { type: "resolveAttack"; pass?: boolean; as?: PlayerId }
  | { type: "resolveStealGigs"; dieIds: string[]; as?: PlayerId }
  | { type: "resolveTrigger"; triggerId?: string; pass?: boolean; as?: PlayerId }
  | { type: "resolveAdjustGig"; value: number; as?: PlayerId }
  | { type: "resolveEffectTarget"; targetIds?: string[]; pass?: boolean; as?: PlayerId }
  | { type: "resolveDiscardFromHand"; cardIds?: string[]; pass?: boolean; as?: PlayerId }
  | { type: "resolveScry"; destinations: Array<{ zone: string; cardIds: string[] }>; as?: PlayerId }
  | { type: "resolveRevealDestination"; destination: "hand" | "trash"; as?: PlayerId }
  | { type: "resolveCardTypeChoice"; cardType: CardType; as?: PlayerId }
  | { type: "passPhase"; as?: PlayerId }
  | { type: "mulligan"; as?: PlayerId }
  | { type: "keepHand"; as?: PlayerId }
  | { type: "gainGig"; dieId: string; as?: PlayerId }
  | { type: "resolveCardToPlay"; cardId: string; as?: PlayerId }
  | { type: "resolveCardToMove"; cardId?: string; pass?: boolean; as?: PlayerId }
  | { type: "concede"; as?: PlayerId }
  | { type: "undo" }
  | { type: "undoToTurnStart" };

/**
 * Helper for matchers that want to assert a partial shape of an
 * {@link EngineAction}. `Partial<EngineAction>` would erase the `type`
 * discriminant (making it optional and breaking narrowing); this type keeps
 * `type` required while letting every other field be omitted, and — because
 * it distributes over the union — preserves the per-variant payload shape so
 * `{ type: "mulligan", as: P1 }` still typechecks against the `mulligan`
 * variant only.
 */
export type EngineActionMatcher = {
  [K in EngineAction["type"]]: { type: K } & Partial<Extract<EngineAction, { type: K }>>;
}[EngineAction["type"]];
