import type { ScenarioId } from "../types/e2e";

export interface CyberpunkE2EFixture {
  readonly scenarioId: ScenarioId;
}

function fixture(scenarioId: ScenarioId): CyberpunkE2EFixture {
  return { scenarioId };
}

/* ── Core / Setup ───────────────────────────────────────────────────────── */
export const gameStart = fixture("gameStart");
export const retailCardCatalog = fixture("retailCardCatalog");
export const openingMain = fixture("openingMain");
export const attackStep = fixture("attackStep");
export const stealGigTest = fixture("stealGigTest");
export const defensiveStep = fixture("defensiveStep");
export const chooseCardTarget = fixture("chooseCardTarget");
export const opponentTurn = fixture("opponentTurn");
export const endGame = fixture("endGame");

/* ── Programs ───────────────────────────────────────────────────────────── */
export const progCorporateSurveillance = fixture("progCorporateSurveillance");
export const progCorporateSurveillanceNoTargets = fixture("progCorporateSurveillanceNoTargets");
export const progFloorIt = fixture("progFloorIt");
export const progFloorItNoTargets = fixture("progFloorItNoTargets");
export const progIndustrialAssembly = fixture("progIndustrialAssembly");
export const progIndustrialAssemblyHighCred = fixture("progIndustrialAssemblyHighCred");
export const progRebootOptics = fixture("progRebootOptics");
export const progRebootOpticsEmptyField = fixture("progRebootOpticsEmptyField");
export const progAfterpartyAtLizzies = fixture("progAfterpartyAtLizzies");
export const progCyberpsychosis = fixture("progCyberpsychosis");
export const progChromeReverie = fixture("progChromeReverie");
export const progPeaceOffering = fixture("progPeaceOffering");
export const progCarnageAtTheColosseum = fixture("progCarnageAtTheColosseum");
export const progCarnageAtTheColosseumRetail = fixture("progCarnageAtTheColosseumRetail");
export const progChromeReverieRetail = fixture("progChromeReverieRetail");
export const progCyberpsychosisRetail = fixture("progCyberpsychosisRetail");
export const progPeaceOfferingRetail = fixture("progPeaceOfferingRetail");

/* ── Gear ───────────────────────────────────────────────────────────────── */
export const gearDyingNightHighCred = fixture("gearDyingNightHighCred");
export const gearDyingNightLowCred = fixture("gearDyingNightLowCred");
export const gearKiroshiOptics = fixture("gearKiroshiOptics");
export const gearKiroshiOpticsNoFaceDown = fixture("gearKiroshiOpticsNoFaceDown");
export const gearMandibularUpgrade = fixture("gearMandibularUpgrade");
export const gearMantisBlades = fixture("gearMantisBlades");
export const gearSandevistan = fixture("gearSandevistan");
export const gearSatoriSwordOfSaburo = fixture("gearSatoriSwordOfSaburo");
export const gearGorillaArms = fixture("gearGorillaArms");
export const gearGorillaArmsRetail = fixture("gearGorillaArmsRetail");
export const gearZetatechFaceplate = fixture("gearZetatechFaceplate");
export const gearZetatechFaceplateRetail = fixture("gearZetatechFaceplateRetail");
export const gearAttachToGoSoloLegend = fixture("gearAttachToGoSoloLegend");

/* ── Legends ────────────────────────────────────────────────────────────── */
export const legendVCorporateExile = fixture("legendVCorporateExile");
export const legendGoroTakemuraHandsUnclean = fixture("legendGoroTakemuraHandsUnclean");
export const legendVStreetkid = fixture("legendVStreetkid");
export const legendRoycePsychoOnTheEdge = fixture("legendRoycePsychoOnTheEdge");
export const legendAltCunninghamSoulkillerArchitect = fixture(
  "legendAltCunninghamSoulkillerArchitect",
);
export const legendSaburoArasakaStubbornPatriach = fixture("legendSaburoArasakaStubbornPatriach");
export const legendYorinobuArasakaEmbracingDestruction = fixture(
  "legendYorinobuArasakaEmbracingDestruction",
);
export const legendJackieWellesPourOneOutForMe = fixture("legendJackieWellesPourOneOutForMe");
export const legendViktorVektorSitDownAndRelax = fixture("legendViktorVektorSitDownAndRelax");
export const legendViktorOpponentPrivateSearch = fixture("legendViktorOpponentPrivateSearch");
export const legendEvelynParkerBeautifulEnigma = fixture("legendEvelynParkerBeautifulEnigma");
export const legendRiverWardDetectiveOnTheHunt = fixture("legendRiverWardDetectiveOnTheHunt");
export const legendDumDumMaelstromTriggerman = fixture("legendDumDumMaelstromTriggerman");
export const legendPanamPalmerNomadCavalry = fixture("legendPanamPalmerNomadCavalry");
export const legendGoroTakemuraVengefulBodyguard = fixture("legendGoroTakemuraVengefulBodyguard");
export const legendLucynaKushinada = fixture("legendLucynaKushinada");

/* ── Legends (Retail) ───────────────────────────────────────────────────── */
export const legendVStreetkidRetail = fixture("legendVStreetkidRetail");
export const legendAltCunninghamSoulkillerArchitectRetail = fixture(
  "legendAltCunninghamSoulkillerArchitectRetail",
);
export const legendRoycePsychoOnTheEdgeRetail = fixture("legendRoycePsychoOnTheEdgeRetail");
export const legendDumDumMaelstromTriggermanRetail = fixture(
  "legendDumDumMaelstromTriggermanRetail",
);
export const legendEvelynParkerBeautifulEnigmaRetail = fixture(
  "legendEvelynParkerBeautifulEnigmaRetail",
);
export const legendGoroTakemuraVengefulBodyguardRetail = fixture(
  "legendGoroTakemuraVengefulBodyguardRetail",
);
export const legendPanamPalmerNomadCavalryRetail = fixture("legendPanamPalmerNomadCavalryRetail");
export const legendRiverWardDetectiveOnTheHuntRetail = fixture(
  "legendRiverWardDetectiveOnTheHuntRetail",
);
export const legendVCorporateExileRetail = fixture("legendVCorporateExileRetail");
export const legendGoroTakemuraHandsUncleanRetail = fixture("legendGoroTakemuraHandsUncleanRetail");
export const legendJackieWellesPourOneOutForMeRetail = fixture(
  "legendJackieWellesPourOneOutForMeRetail",
);
export const legendSaburoArasakaStubbornPatriachRetail = fixture(
  "legendSaburoArasakaStubbornPatriachRetail",
);
export const legendYorinobuArasakaEmbracingDestructionRetail = fixture(
  "legendYorinobuArasakaEmbracingDestructionRetail",
);
export const legendViktorVektorSitDownAndRelaxRetail = fixture(
  "legendViktorVektorSitDownAndRelaxRetail",
);

/* ── Units ──────────────────────────────────────────────────────────────── */
export const unitSecondhandBombus = fixture("unitSecondhandBombus");
export const unitCorpoSecurity = fixture("unitCorpoSecurity");
export const unitDelamainCab = fixture("unitDelamainCab");
export const unitEmergencyAtlus = fixture("unitEmergencyAtlus");
export const unitSwordwiseHuscle = fixture("unitSwordwiseHuscle");
export const unitTBugAmateurPhilosopher = fixture("unitTBugAmateurPhilosopher");
export const unitRuthlessLowlife = fixture("unitRuthlessLowlife");
export const unitEvelynParkerSchemingSiren = fixture("unitEvelynParkerSchemingSiren");
export const unitJackieWellesRideOrDieChoom = fixture("unitJackieWellesRideOrDieChoom");
export const unitGoroTakemuraLosingHisWay = fixture("unitGoroTakemuraLosingHisWay");
export const unitMt0d12Flathead = fixture("unitMt0d12Flathead");
export const unitArmoredMinotaur = fixture("unitArmoredMinotaur");
export const unitHanakoArasakaInAGildedCage = fixture("unitHanakoArasakaInAGildedCage");
export const unitGildedMaton = fixture("unitGildedMaton");
export const unitMamanBrigitte = fixture("unitMamanBrigitte");
export const unitPlacideVoodooSentinel = fixture("unitPlacideVoodooSentinel");
export const unitAdamSmasherMetalOverMeat = fixture("unitAdamSmasherMetalOverMeat");
export const unitElSombreronLaVenganzaLenta = fixture("unitElSombreronLaVenganzaLenta");
export const unitCaliberTotentanzSTopDog = fixture("unitCaliberTotentanzSTopDog");
export const unitMeredithStoutStoneColdCorpo = fixture("unitMeredithStoutStoneColdCorpo");
export const unitKerryEurodyneTheLastRockerboy = fixture("unitKerryEurodyneTheLastRockerboy");
export const unitRidingNomad = fixture("unitRidingNomad");
export const unitRoyceDonTCallMeSimonHighCred = fixture("unitRoyceDonTCallMeSimonHighCred");
export const unitRoyceDonTCallMeSimonLowCred = fixture("unitRoyceDonTCallMeSimonLowCred");
export const unitSandayuOdaHanakoSGuardian = fixture("unitSandayuOdaHanakoSGuardian");

/* ── Units (Retail) ─────────────────────────────────────────────────────── */
export const unitAdamSmasherMetalOverMeatRetail = fixture("unitAdamSmasherMetalOverMeatRetail");
export const unitCaliberTotentanzSTopDogRetail = fixture("unitCaliberTotentanzSTopDogRetail");
export const unitElSombreronLaVenganzaLentaRetail = fixture("unitElSombreronLaVenganzaLentaRetail");
export const unitGildedMatonRetail = fixture("unitGildedMatonRetail");
export const unitHanakoArasakaInAGildedCageRetail = fixture("unitHanakoArasakaInAGildedCageRetail");
export const unitKerryEurodyneTheLastRockerboyRetail = fixture(
  "unitKerryEurodyneTheLastRockerboyRetail",
);
export const unitMamanBrigitteRetail = fixture("unitMamanBrigitteRetail");
export const unitMeredithStoutStoneColdCorpoRetail = fixture(
  "unitMeredithStoutStoneColdCorpoRetail",
);
export const unitModdedKusanagiRetail = fixture("unitModdedKusanagiRetail");
export const unitPlacideVoodooSentinelRetail = fixture("unitPlacideVoodooSentinelRetail");
export const unitRidingNomadRetail = fixture("unitRidingNomadRetail");
export const unitRoyceDonTCallMeSimonHighCredRetail = fixture(
  "unitRoyceDonTCallMeSimonHighCredRetail",
);
export const unitRoyceDonTCallMeSimonLowCredRetail = fixture(
  "unitRoyceDonTCallMeSimonLowCredRetail",
);
export const unitSandayuOdaHanakoSGuardianRetail = fixture("unitSandayuOdaHanakoSGuardianRetail");
export const unitWraithMaraudersRetail = fixture("unitWraithMaraudersRetail");
