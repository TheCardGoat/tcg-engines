import type { Scenario } from "./types";
import { c, CyberpunkTestEngine, scenarioSeed } from "./shared";

/** Deterministic visual/interactions board for the final scraped retail cards. */
export const releaseSep2026QaScenarios: Scenario[] = [
  {
    id: "retailReleaseSep2026ScrapedCardsQa",
    group: "release-qa",
    label: "Sep 2026 · scraped cards QA",
    description:
      "Hand: Detonate, Memory Relapse, Three Mouths, Tyger's Whisper, and MaxTac Heavy. Westbrook is ready on the field. Detonate can choose the rival 2-power Gear; Memory Relapse can choose and spend a rival Unit; Three Mouths reveals three ordered cards; Tyger offers a free Legend Call; MaxTac's displayed cost falls by one per rival Unit. Refresh to reset each interaction.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [
            c.welcomeToNightCityRetailDetonate,
            c.welcomeToNightCityRetailMemoryRelapse,
            c.welcomeToNightCityRetailThreeMouthsOneDesire,
            c.welcomeToNightCityRetailTygerSWhisper,
            c.welcomeToNightCityRetailMaxtacHeavy,
          ],
          deck: [
            c.welcomeToNightCityRetailFloorIt,
            c.welcomeToNightCityRetailMoxInciters,
            c.welcomeToNightCityRetailTrustNoOne,
            c.welcomeToNightCityRetailPeaceOffering,
            c.welcomeToNightCityRetailFoolOnTheHill,
            c.welcomeToNightCityRetailSafetyOverride,
            c.welcomeToNightCityRetailRebootOptics,
          ],
          field: [
            { card: c.welcomeToNightCityRetailWestbrookNetrunner, spent: false, hasLag: false },
          ],
          legendArea: [{ card: c.welcomeToNightCityRetailVStreetkid, faceDown: true }],
          eddies: 18,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 1 },
          ],
        },
        {
          field: [
            {
              card: c.welcomeToNightCityRetailCorpoSecurity,
              spent: false,
              hasLag: false,
              attachedGears: [c.welcomeToNightCityRetailZetatechFaceplate],
            },
            { card: c.welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          ],
          legendArea: [c.theHeistRetailStarterDeckVCorporateExile],
          eddies: 4,
          gigArea: [{ dieType: "d8", faceValue: 3 }],
        },
        {
          seed: scenarioSeed("retailReleaseSep2026ScrapedCardsQa"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      ),
  },
];
