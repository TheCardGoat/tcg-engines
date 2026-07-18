import {
  CyberpunkTestEngine,
  P1,
  P2,
  type FixtureCardEntry,
  type PlayerFixture,
} from "@tcg/cyberpunk-engine";
import * as c from "@tcg/cyberpunk-cards";
import type { ScenarioId } from "./types";

export { c, CyberpunkTestEngine, P1, P2 };
export type { PlayerFixture };

export const playerBase: PlayerFixture = {
  hand: [
    c.welcomeToNightCityRetailMoxInciters,
    c.welcomeToNightCityRetailSwordwiseHuscle,
    c.welcomeToNightCityRetailFloorIt,
  ],
  field: [
    { card: c.welcomeToNightCityRetailSecondhandBombus, spent: false },
    { card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false },
  ],
  legendArea: [c.theHeistRetailStarterDeckVCorporateExile, c.welcomeToNightCityRetailVStreetkid],
  eddies: 5,
};

export const opponentBase: PlayerFixture = {
  hand: 4,
  field: [
    { card: c.embracingPowerRetailStarterDeckMinotaur, spent: false },
    { card: c.welcomeToNightCityRetailJackieWellesRideOrDieChoom, spent: true },
  ],
  legendArea: [c.welcomeToNightCityRetailJackieWellesRideOrDieChoom],
  eddies: 3,
};

const POWER_THREE_MOCK_UNIT_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20500%20700%22%3E%3Crect%20width=%22500%22%20height=%22700%22%20fill=%22%23070b12%22/%3E%3Crect%20x=%2222%22%20y=%2222%22%20width=%22456%22%20height=%22656%22%20rx=%2218%22%20fill=%22%23161122%22%20stroke=%22%23ff2d8f%22%20stroke-width=%228%22/%3E%3Crect%20x=%2244%22%20y=%22148%22%20width=%22412%22%20height=%22370%22%20fill=%22%230d1721%22%20stroke=%22%23f6ff00%22%20stroke-width=%225%22/%3E%3Ctext%20x=%2248%22%20y=%2284%22%20fill=%22%23f6ff00%22%20font-family=%22monospace%22%20font-size=%2236%22%20font-weight=%22700%22%3EPOWER-3%3C/text%3E%3Ctext%20x=%2248%22%20y=%22124%22%20fill=%22%23ffffff%22%20font-family=%22monospace%22%20font-size=%2228%22%20font-weight=%22700%22%3EMOCK%20UNIT%3C/text%3E%3Ccircle%20cx=%22418%22%20cy=%2284%22%20r=%2244%22%20fill=%22%23ff2d8f%22/%3E%3Ctext%20x=%22418%22%20y=%2299%22%20fill=%22%23070b12%22%20text-anchor=%22middle%22%20font-family=%22monospace%22%20font-size=%2246%22%20font-weight=%22700%22%3E3%3C/text%3E%3Cpath%20d=%22M110%20210h260l-64%20120h84L210%20494l40-126h-92z%22%20fill=%22%23f6ff00%22/%3E%3Ctext%20x=%22250%22%20y=%22582%22%20fill=%22%23ffffff%22%20text-anchor=%22middle%22%20font-family=%22monospace%22%20font-size=%2224%22%3ESCENARIO%20ONLY%3C/text%3E%3Ctext%20x=%2248%22%20y=%22644%22%20fill=%22%23ff2d8f%22%20font-family=%22monospace%22%20font-size=%2224%22%20font-weight=%22700%22%3EUNIT%3C/text%3E%3Ctext%20x=%22426%22%20y=%22644%22%20fill=%22%23f6ff00%22%20text-anchor=%22middle%22%20font-family=%22monospace%22%20font-size=%2230%22%20font-weight=%22700%22%3E03%3C/text%3E%3C/svg%3E";

export const powerThreeMockUnit = {
  ...c.welcomeToNightCityRetailMoxInciters,
  id: "scenario-royce-power-three-mock",
  slug: "scenario-royce-power-three-mock",
  name: "Power-3 Mock Unit",
  displayName: "Power-3 Mock Unit",
  rulesText: "Scenario-only mock unit with 3 power.",
  power: 3,
  imageUrl: POWER_THREE_MOCK_UNIT_IMAGE,
  abilities: [],
} satisfies FixtureCardEntry;

export const endGamePlayer: PlayerFixture = {
  hand: [
    c.welcomeToNightCityRetailMoxInciters,
    c.welcomeToNightCityRetailSwordwiseHuscle,
    c.welcomeToNightCityRetailFloorIt,
  ],
  field: [
    { card: c.welcomeToNightCityRetailSecondhandBombus, spent: false },
    { card: c.welcomeToNightCityRetailSwordwiseHuscle, spent: false },
    { card: c.embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay, spent: true },
    {
      card: c.welcomeToNightCityRetailTBugAmateurPhilosopher,
      spent: false,
      attachedGears: [
        c.welcomeToNightCityRetailSatoriSwordOfSaburo,
        c.welcomeToNightCityRetailKiroshiOptics,
        c.welcomeToNightCityRetailDyingNightVSPistol,
      ],
    },
  ],
  legendArea: [
    { card: c.theHeistRetailStarterDeckVCorporateExile, faceDown: false },
    { card: c.embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
    { card: c.embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction, faceDown: false },
  ],
  eddies: 8,
  gigArea: [
    { dieType: "d4", faceValue: 2 },
    { dieType: "d8", faceValue: 8 },
    { dieType: "d10", faceValue: 9 },
    { dieType: "d12", faceValue: 7 },
  ],
};

export const endGameOpponent: PlayerFixture = {
  hand: 4,
  field: [
    { card: c.embracingPowerRetailStarterDeckMinotaur, spent: false },
    { card: c.welcomeToNightCityRetailJackieWellesRideOrDieChoom, spent: true },
    { card: c.welcomeToNightCityRetailCorpoSecurity, spent: false },
    { card: c.welcomeToNightCityRetailSecondhandBombus, spent: true },
  ],
  legendArea: [
    { card: c.theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
    { card: c.embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, faceDown: false },
    { card: c.theHeistRetailStarterDeckViktorVektorSitDownAndRelax, faceDown: false },
  ],
  eddies: 7,
  gigArea: [
    { dieType: "d4", faceValue: 4 },
    { dieType: "d6", faceValue: 1 },
    { dieType: "d12", faceValue: 10 },
  ],
};

export const startBase: PlayerFixture = {
  deck: 30,
  eddies: 0,
};

export const SCENARIO_SEEDS: Record<ScenarioId, string> = {
  gameStart: "scenario:gameStart",
  retailCardCatalog: "scenario:retailCardCatalog",
  retailProgramTargetBench: "scenario:retailProgramTargetBench",
  retailCombatGigBench: "scenario:retailCombatGigBench",
  retailGearLegendBench: "scenario:retailGearLegendBench",
  mobileLedgerZeroLegends: "scenario:mobileLedgerZeroLegends",
  mobileLedgerOneLegend: "scenario:mobileLedgerOneLegend",
  mobileLedgerTwoLegends: "scenario:mobileLedgerTwoLegends",
  mobileLedgerThreeLegends: "scenario:mobileLedgerThreeLegends",
  mobileLedgerFriendlyOneRivalThree: "scenario:mobileLedgerFriendlyOneRivalThree",
  mobileLedgerFriendlyZeroRivalTwo: "scenario:mobileLedgerFriendlyZeroRivalTwo",
  retailPr2295Cards: "scenario:retailPr2295Cards",
  retailNewCardAbilities: "scenario:retailNewCardAbilities",
  openingMain: "scenario:openingMain",
  attackStep: "scenario:attackStep",
  reactStep: "scenario:reactStep",
  chooseCardTarget: "scenario:chooseCardTarget",
  opponentTurn: "scenario:opponentTurn",
  stealGigTest: "scenario:stealGigTest",
  endGame: "scenario:endGame",
  unitWelcomeToNightCityRetailMoxIncitersMustAttack:
    "scenario:unitWelcomeToNightCityRetailMoxIncitersMustAttack",
  progCorporateSurveillance: "scenario:progCorporateSurveillance",
  progCorporateSurveillanceNoTargets: "scenario:progCorporateSurveillanceNoTargets",
  progFloorIt: "scenario:progFloorIt",
  progFloorItNoTargets: "scenario:progFloorItNoTargets",
  progIndustrialAssembly: "scenario:progIndustrialAssembly",
  progIndustrialAssemblyHighCred: "scenario:progIndustrialAssemblyHighCred",
  progRebootOptics: "scenario:progRebootOptics",
  progRebootOpticsEmptyField: "scenario:progRebootOpticsEmptyField",
  progAfterpartyAtLizzies: "scenario:progAfterpartyAtLizzies",
  progFoolOnTheHill: "scenario:progFoolOnTheHill",
  progCyberpsychosis: "scenario:progCyberpsychosis",
  progChromeReverie: "scenario:progChromeReverie",
  gearDyingNightHighCred: "scenario:gearDyingNightHighCred",
  gearDyingNightLowCred: "scenario:gearDyingNightLowCred",
  gearKiroshiOptics: "scenario:gearKiroshiOptics",
  gearKiroshiOpticsNoFaceDown: "scenario:gearKiroshiOpticsNoFaceDown",
  gearMandibularUpgrade: "scenario:gearMandibularUpgrade",
  gearMantisBlades: "scenario:gearMantisBlades",
  gearSandevistan: "scenario:gearSandevistan",
  gearSatoriSwordOfSaburo: "scenario:gearSatoriSwordOfSaburo",
  gearGorillaArms: "scenario:gearGorillaArms",
  gearGorillaArmsRetail: "scenario:gearGorillaArmsRetail",
  gearZetatechFaceplate: "scenario:gearZetatechFaceplate",
  gearZetatechFaceplateRetail: "scenario:gearZetatechFaceplateRetail",
  gearAttachToGoSoloLegend: "scenario:gearAttachToGoSoloLegend",
  legendVCorporateExile: "scenario:legendVCorporateExile",
  legendGoroTakemuraHandsUnclean: "scenario:legendGoroTakemuraHandsUnclean",
  legendVStreetkid: "scenario:legendVStreetkid",
  legendRoycePsychoOnTheEdge: "scenario:legendRoycePsychoOnTheEdge",
  legendAltCunninghamSoulkillerArchitect: "scenario:legendAltCunninghamSoulkillerArchitect",
  legendSaburoArasakaStubbornPatriach: "scenario:legendSaburoArasakaStubbornPatriach",
  legendYorinobuArasakaEmbracingDestruction: "scenario:legendYorinobuArasakaEmbracingDestruction",
  legendJackieWellesPourOneOutForMe: "scenario:legendJackieWellesPourOneOutForMe",
  legendViktorVektorSitDownAndRelax: "scenario:legendViktorVektorSitDownAndRelax",
  legendViktorOpponentPrivateSearch: "scenario:legendViktorOpponentPrivateSearch",
  legendEvelynParkerBeautifulEnigma: "scenario:legendEvelynParkerBeautifulEnigma",
  legendRiverWardDetectiveOnTheHunt: "scenario:legendRiverWardDetectiveOnTheHunt",
  legendDumDumMaelstromTriggerman: "scenario:legendDumDumMaelstromTriggerman",
  legendPanamPalmerNomadCavalry: "scenario:legendPanamPalmerNomadCavalry",
  legendGoroTakemuraVengefulBodyguard: "scenario:legendGoroTakemuraVengefulBodyguard",
  legendLucynaKushinada: "scenario:legendLucynaKushinada",
  legendVStreetkidRetail: "scenario:legendVStreetkidRetail",
  legendAltCunninghamSoulkillerArchitectRetail:
    "scenario:legendAltCunninghamSoulkillerArchitectRetail",
  legendRoycePsychoOnTheEdgeRetail: "scenario:legendRoycePsychoOnTheEdgeRetail",
  legendDumDumMaelstromTriggermanRetail: "scenario:legendDumDumMaelstromTriggermanRetail",
  legendEvelynParkerBeautifulEnigmaRetail: "scenario:legendEvelynParkerBeautifulEnigmaRetail",
  legendGoroTakemuraVengefulBodyguardRetail: "scenario:legendGoroTakemuraVengefulBodyguardRetail",
  legendPanamPalmerNomadCavalryRetail: "scenario:legendPanamPalmerNomadCavalryRetail",
  legendRiverWardDetectiveOnTheHuntRetail: "scenario:legendRiverWardDetectiveOnTheHuntRetail",
  progBootlegBlackSapphireShowRetail: "scenario:progBootlegBlackSapphireShowRetail",
  progCarnageAtTheColosseumRetail: "scenario:progCarnageAtTheColosseumRetail",
  progChromeReverieRetail: "scenario:progChromeReverieRetail",
  progCyberpsychosisRetail: "scenario:progCyberpsychosisRetail",
  progPeaceOfferingRetail: "scenario:progPeaceOfferingRetail",
  progLiveWithTheAftermathRetail: "scenario:progLiveWithTheAftermathRetail",
  unitSecondhandBombus: "scenario:unitSecondhandBombus",
  unitCorpoSecurity: "scenario:unitCorpoSecurity",
  unitDelamainCab: "scenario:unitDelamainCab",
  unitEmergencyAtlus: "scenario:unitEmergencyAtlus",
  unitSwordwiseHuscle: "scenario:unitSwordwiseHuscle",
  unitTBugAmateurPhilosopher: "scenario:unitTBugAmateurPhilosopher",
  unitRuthlessLowlife: "scenario:unitRuthlessLowlife",
  unitEvelynParkerSchemingSiren: "scenario:unitEvelynParkerSchemingSiren",
  unitJackieWellesRideOrDieChoom: "scenario:unitJackieWellesRideOrDieChoom",
  unitGoroTakemuraLosingHisWay: "scenario:unitGoroTakemuraLosingHisWay",
  unitMt0d12Flathead: "scenario:unitMt0d12Flathead",
  unitArmoredMinotaur: "scenario:unitArmoredMinotaur",
  unitHanakoArasakaInAGildedCage: "scenario:unitHanakoArasakaInAGildedCage",
  unitGildedMaton: "scenario:unitGildedMaton",
  unitMamanBrigitte: "scenario:unitMamanBrigitte",
  unitPlacideVoodooSentinel: "scenario:unitPlacideVoodooSentinel",
  unitAdamSmasherMetalOverMeat: "scenario:unitAdamSmasherMetalOverMeat",
  unitElSombreronLaVenganzaLenta: "scenario:unitElSombreronLaVenganzaLenta",
  unitCaliberTotentanzSTopDog: "scenario:unitCaliberTotentanzSTopDog",
  unitMeredithStoutStoneColdCorpo: "scenario:unitMeredithStoutStoneColdCorpo",
  unitKerryEurodyneTheLastRockerboy: "scenario:unitKerryEurodyneTheLastRockerboy",
  unitRidingNomad: "scenario:unitRidingNomad",
  unitRoyceDonTCallMeSimonHighCred: "scenario:unitRoyceDonTCallMeSimonHighCred",
  unitRoyceDonTCallMeSimonLowCred: "scenario:unitRoyceDonTCallMeSimonLowCred",
  unitSandayuOdaHanakoSGuardian: "scenario:unitSandayuOdaHanakoSGuardian",
  unitAdamSmasherMetalOverMeatRetail: "scenario:unitAdamSmasherMetalOverMeatRetail",
  unitCaliberTotentanzSTopDogRetail: "scenario:unitCaliberTotentanzSTopDogRetail",
  unitElSombreronLaVenganzaLentaRetail: "scenario:unitElSombreronLaVenganzaLentaRetail",
  unitGildedMatonRetail: "scenario:unitGildedMatonRetail",
  unitHanakoArasakaInAGildedCageRetail: "scenario:unitHanakoArasakaInAGildedCageRetail",
  unitKerryEurodyneTheLastRockerboyRetail: "scenario:unitKerryEurodyneTheLastRockerboyRetail",
  unitMamanBrigitteRetail: "scenario:unitMamanBrigitteRetail",
  unitMeredithStoutStoneColdCorpoRetail: "scenario:unitMeredithStoutStoneColdCorpoRetail",
  unitModdedKusanagiRetail: "scenario:unitModdedKusanagiRetail",
  unitPlacideVoodooSentinelRetail: "scenario:unitPlacideVoodooSentinelRetail",
  unitRidingNomadRetail: "scenario:unitRidingNomadRetail",
  unitRoyceDonTCallMeSimonHighCredRetail: "scenario:unitRoyceDonTCallMeSimonHighCredRetail",
  unitRoyceDonTCallMeSimonLowCredRetail: "scenario:unitRoyceDonTCallMeSimonLowCredRetail",
  unitSandayuOdaHanakoSGuardianRetail: "scenario:unitSandayuOdaHanakoSGuardianRetail",
  unitWraithMaraudersRetail: "scenario:unitWraithMaraudersRetail",
  unitOctantRetail: "scenario:unitOctantRetail",
  legendVCorporateExileRetail: "scenario:legendVCorporateExileRetail",
  legendGoroTakemuraHandsUncleanRetail: "scenario:legendGoroTakemuraHandsUncleanRetail",
  legendJackieWellesPourOneOutForMeRetail: "scenario:legendJackieWellesPourOneOutForMeRetail",
  legendSaburoArasakaStubbornPatriachRetail: "scenario:legendSaburoArasakaStubbornPatriachRetail",
  legendYorinobuArasakaEmbracingDestructionRetail:
    "scenario:legendYorinobuArasakaEmbracingDestructionRetail",
  legendViktorVektorSitDownAndRelaxRetail: "scenario:legendViktorVektorSitDownAndRelaxRetail",
  legendRebeccaHavingAMomentPrm01: "scenario:legendRebeccaHavingAMomentPrm01",
  legendTheHeistVCorporateExile: "scenario:legendTheHeistVCorporateExile",
  legendTheHeistJackieWellesPourOneOutForMe: "scenario:legendTheHeistJackieWellesPourOneOutForMe",
  legendEmbracingGoroTakemuraHandsUnclean: "scenario:legendEmbracingGoroTakemuraHandsUnclean",
  legendEmbracingSaburoArasakaStubbornPatriarch:
    "scenario:legendEmbracingSaburoArasakaStubbornPatriarch",
  legendEmbracingYorinobuArasakaEmbracingDestruction:
    "scenario:legendEmbracingYorinobuArasakaEmbracingDestruction",
  unitTheHeistDexterDeshawnOneLastChance: "scenario:unitTheHeistDexterDeshawnOneLastChance",
  unitTheHeistMt0d12Flathead: "scenario:unitTheHeistMt0d12Flathead",
  unitEmbracingGoroTakemuraLosingHisWay: "scenario:unitEmbracingGoroTakemuraLosingHisWay",
  unitEmbracingMinotaur: "scenario:unitEmbracingMinotaur",
  progPeaceOffering: "scenario:progPeaceOffering",
  progCarnageAtTheColosseum: "scenario:progCarnageAtTheColosseum",
  progCarnageAtTheColosseumCostReduction: "scenario:progCarnageAtTheColosseumCostReduction",
  legendAdamSmasherEnderOfLegendsRetail: "scenario:legendAdamSmasherEnderOfLegendsRetail",
  legendKerryEurodyneAxeAttitudeAudienceRetail:
    "scenario:legendKerryEurodyneAxeAttitudeAudienceRetail",
  legendSashaYakovlevaWonTLetYouDownRetail: "scenario:legendSashaYakovlevaWonTLetYouDownRetail",
  legendQaPromosAndV: "scenario:legendQaPromosAndV",
  legendQaArasakaPressure: "scenario:legendQaArasakaPressure",
  legendQaBlueSetup: "scenario:legendQaBlueSetup",
  legendQaReactionTools: "scenario:legendQaReactionTools",
  legendQaGearTempo: "scenario:legendQaGearTempo",
  legendQaLateGameThreats: "scenario:legendQaLateGameThreats",
  legendQaVStreetkidAndPrintParity: "scenario:legendQaVStreetkidAndPrintParity",
  legendQaEmbracingPowerPrints: "scenario:legendQaEmbracingPowerPrints",
  unit6thStreetRecruitsRetail: "scenario:unit6thStreetRecruitsRetail",
  unitAugmentedNegotiatorsRetail: "scenario:unitAugmentedNegotiatorsRetail",
  unitJackedInVoodooBoyRetail: "scenario:unitJackedInVoodooBoyRetail",
  unitLaLloronaGhostOfThePastRetail: "scenario:unitLaLloronaGhostOfThePastRetail",
  unitLizzyWizzyDelicateWeaponRetail: "scenario:unitLizzyWizzyDelicateWeaponRetail",
  unitMistyOlszewskiMenderOfBrokenSpiritsRetail:
    "scenario:unitMistyOlszewskiMenderOfBrokenSpiritsRetail",
  unitNadiaFightingThroughGriefRetail: "scenario:unitNadiaFightingThroughGriefRetail",
  unitOffdutyMalfiniRetail: "scenario:unitOffdutyMalfiniRetail",
  unitSaulBrightStormriderRetail: "scenario:unitSaulBrightStormriderRetail",
  unitScrewLovelornFoolRetail: "scenario:unitScrewLovelornFoolRetail",
  unitSketchyRipperRetail: "scenario:unitSketchyRipperRetail",
  unitYorinobuArasakaSteelDragonRetail: "scenario:unitYorinobuArasakaSteelDragonRetail",
  gearOverwatchPanamsGiftRetail: "scenario:gearOverwatchPanamsGiftRetail",
  progAllIsLostRetail: "scenario:progAllIsLostRetail",
  progOverTheEdgeRetail: "scenario:progOverTheEdgeRetail",
  progTakeControlRetail: "scenario:progTakeControlRetail",
  unitFieldOperatorRetail: "scenario:unitFieldOperatorRetail",
  unitMoxIncitersRetail: "scenario:unitMoxIncitersRetail",
  unitPsychoSquadRetail: "scenario:unitPsychoSquadRetail",
  unitViktorVektorYouMightFeelALittlePinchRetail:
    "scenario:unitViktorVektorYouMightFeelALittlePinchRetail",
};

export function scenarioSeed(id: ScenarioId): string {
  return SCENARIO_SEEDS[id];
}

export function skipGainGig(engine: CyberpunkTestEngine): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (choice?.type === "gainGig" && choice.payload.allowedDieIds[0]) {
    engine.gainGig(choice.payload.allowedDieIds[0] as string, { as: choice.chooserId });
  }
}

export function setPlayerDeckToDefinitions(
  engine: CyberpunkTestEngine,
  playerId: typeof P1,
  cards: ReadonlyArray<{ id: string }>,
): void {
  const deckCards = cards.map((def) => {
    const card = engine.getCardsInZone("deck", playerId).find((c) => c.definitionId === def.id);
    if (!card) {
      throw new Error(`No deck card found for definition ${def.id}`);
    }
    return card;
  });
  engine.judgeStackDeck(deckCards, { as: playerId });
}
