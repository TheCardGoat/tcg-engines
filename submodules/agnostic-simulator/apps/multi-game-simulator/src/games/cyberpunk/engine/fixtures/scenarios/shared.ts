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
  hand: [c.alphaRuthlessLowlife, c.alphaSwordwiseHuscle, c.alphaFloorIt],
  field: [
    { card: c.alphaSecondhandBombus, spent: false },
    { card: c.alphaSwordwiseHuscle, spent: false },
  ],
  legendArea: [c.alphaVCorporateExile, c.spoilerVStreetkid],
  eddies: 5,
};

export const opponentBase: PlayerFixture = {
  hand: 4,
  field: [
    { card: c.alphaArmoredMinotaur, spent: false },
    { card: c.alphaJackieWellesRideOrDieChoom, spent: true },
  ],
  legendArea: [c.alphaJackieWellesRideOrDieChoom],
  eddies: 3,
};

const POWER_THREE_MOCK_UNIT_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20500%20700%22%3E%3Crect%20width=%22500%22%20height=%22700%22%20fill=%22%23070b12%22/%3E%3Crect%20x=%2222%22%20y=%2222%22%20width=%22456%22%20height=%22656%22%20rx=%2218%22%20fill=%22%23161122%22%20stroke=%22%23ff2d8f%22%20stroke-width=%228%22/%3E%3Crect%20x=%2244%22%20y=%22148%22%20width=%22412%22%20height=%22370%22%20fill=%22%230d1721%22%20stroke=%22%23f6ff00%22%20stroke-width=%225%22/%3E%3Ctext%20x=%2248%22%20y=%2284%22%20fill=%22%23f6ff00%22%20font-family=%22monospace%22%20font-size=%2236%22%20font-weight=%22700%22%3EPOWER-3%3C/text%3E%3Ctext%20x=%2248%22%20y=%22124%22%20fill=%22%23ffffff%22%20font-family=%22monospace%22%20font-size=%2228%22%20font-weight=%22700%22%3EMOCK%20UNIT%3C/text%3E%3Ccircle%20cx=%22418%22%20cy=%2284%22%20r=%2244%22%20fill=%22%23ff2d8f%22/%3E%3Ctext%20x=%22418%22%20y=%2299%22%20fill=%22%23070b12%22%20text-anchor=%22middle%22%20font-family=%22monospace%22%20font-size=%2246%22%20font-weight=%22700%22%3E3%3C/text%3E%3Cpath%20d=%22M110%20210h260l-64%20120h84L210%20494l40-126h-92z%22%20fill=%22%23f6ff00%22/%3E%3Ctext%20x=%22250%22%20y=%22582%22%20fill=%22%23ffffff%22%20text-anchor=%22middle%22%20font-family=%22monospace%22%20font-size=%2224%22%3ESCENARIO%20ONLY%3C/text%3E%3Ctext%20x=%2248%22%20y=%22644%22%20fill=%22%23ff2d8f%22%20font-family=%22monospace%22%20font-size=%2224%22%20font-weight=%22700%22%3EUNIT%3C/text%3E%3Ctext%20x=%22426%22%20y=%22644%22%20fill=%22%23f6ff00%22%20text-anchor=%22middle%22%20font-family=%22monospace%22%20font-size=%2230%22%20font-weight=%22700%22%3E03%3C/text%3E%3C/svg%3E";

export const powerThreeMockUnit = {
  ...c.alphaRuthlessLowlife,
  id: "scenario-royce-power-three-mock",
  externalId: "scenario:royce-power-three-mock",
  slug: "scenario-royce-power-three-mock",
  name: "Power-3 Mock Unit",
  displayName: "Power-3 Mock Unit",
  rulesText: "Scenario-only mock unit with 3 power.",
  power: 3,
  imageUrl: POWER_THREE_MOCK_UNIT_IMAGE,
  sourceImageUrl: POWER_THREE_MOCK_UNIT_IMAGE,
  abilities: [],
} satisfies FixtureCardEntry;

export const endGamePlayer: PlayerFixture = {
  hand: [c.alphaRuthlessLowlife, c.alphaSwordwiseHuscle, c.alphaFloorIt],
  field: [
    { card: c.alphaSecondhandBombus, spent: false },
    { card: c.alphaSwordwiseHuscle, spent: false },
    { card: c.alphaGoroTakemuraLosingHisWay, spent: true },
    {
      card: c.alphaTBugAmateurPhilosopher,
      spent: false,
      attachedGears: [c.alphaSatoriSwordOfSaburo, c.alphaKiroshiOptics, c.alphaDyingNightVSPistol],
    },
  ],
  legendArea: [
    { card: c.alphaVCorporateExile, faceDown: false },
    { card: c.alphaGoroTakemuraHandsUnclean, faceDown: true },
    { card: c.alphaYorinobuArasakaEmbracingDestruction, faceDown: false },
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
    { card: c.alphaArmoredMinotaur, spent: false },
    { card: c.alphaJackieWellesRideOrDieChoom, spent: true },
    { card: c.alphaCorpoSecurity, spent: false },
    { card: c.alphaSecondhandBombus, spent: true },
  ],
  legendArea: [
    { card: c.alphaJackieWellesPourOneOutForMe, faceDown: false },
    { card: c.alphaSaburoArasakaStubbornPatriach, faceDown: false },
    { card: c.alphaViktorVektorSitDownAndRelax, faceDown: false },
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
  openingMain: "scenario:openingMain",
  attackStep: "scenario:attackStep",
  defensiveStep: "scenario:defensiveStep",
  chooseCardTarget: "scenario:chooseCardTarget",
  opponentTurn: "scenario:opponentTurn",
  stealGigTest: "scenario:stealGigTest",
  endGame: "scenario:endGame",
  progCorporateSurveillance: "scenario:progCorporateSurveillance",
  progCorporateSurveillanceNoTargets: "scenario:progCorporateSurveillanceNoTargets",
  progFloorIt: "scenario:progFloorIt",
  progFloorItNoTargets: "scenario:progFloorItNoTargets",
  progIndustrialAssembly: "scenario:progIndustrialAssembly",
  progIndustrialAssemblyHighCred: "scenario:progIndustrialAssemblyHighCred",
  progRebootOptics: "scenario:progRebootOptics",
  progRebootOpticsEmptyField: "scenario:progRebootOpticsEmptyField",
  progAfterpartyAtLizzies: "scenario:progAfterpartyAtLizzies",
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
  gearZetatechFaceplate: "scenario:gearZetatechFaceplate",
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
  unitSecondhandBombus: "scenario:unitSecondhandBombus",
  unitCorpoSecurity: "scenario:unitCorpoSecurity",
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
  progPeaceOffering: "scenario:progPeaceOffering",
  progCarnageAtTheColosseum: "scenario:progCarnageAtTheColosseum",
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
