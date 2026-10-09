import type { Scenario } from "./types";
import { c, CyberpunkTestEngine, opponentBase, playerBase, scenarioSeed } from "./shared";

export const emptyFieldScenarios: Scenario[] = [
  {
    id: "emptyFieldPlayTargets",
    group: "core",
    label: "Empty field · Play targets",
    description:
      "An empty friendly field with a playable Unit, Program, and Gear in hand, plus a face-up Legend for Gear attachment.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          ...playerBase,
          hand: [
            c.welcomeToNightCityRetailSwordwiseHuscle,
            c.welcomeToNightCityRetailFloorIt,
            c.welcomeToNightCityRetailGorillaArms,
          ],
          field: [],
          legendArea: [
            { card: c.welcomeToNightCityRetailVStreetkid, faceDown: false },
            { card: c.theHeistRetailStarterDeckVCorporateExile, faceDown: true },
          ],
          eddies: 10,
        },
        opponentBase,
        { seed: scenarioSeed("emptyFieldPlayTargets"), autoGainGig: false },
      ),
  },
];
