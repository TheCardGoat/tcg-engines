import type { Scenario } from "./types";
import { c, CyberpunkTestEngine, scenarioSeed } from "./shared";

export const pendingEffectOrderScenarios: Scenario[] = [
  {
    id: "pendingEffectsRiverRelicAdamSmasher",
    group: "release-qa",
    label: "Pending effects · River Ward, The Relic, and Adam Smasher",
    description:
      "Play Live with the Aftermath from hand and choose the Relic-equipped Field Operator. After both players defeat a Unit, order the Unit and The Relic in trash, choose between River Ward and The Relic, use The Relic to play Adam Smasher from trash, then choose whether Adam's PLAY board wipe or River's deck search resolves next.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailLiveWithTheAftermath],
          deck: [c.welcomeToNightCityRetailKiroshiOptics, c.welcomeToNightCityRetailMantisBlades],
          field: [
            {
              card: c.welcomeToNightCityRetailFieldOperator,
              spent: false,
              hasLag: false,
              attachedGears: [c.welcomeToNightCityRetailTheRelicExperimentalBiochip],
            },
            {
              card: c.welcomeToNightCityRetailSwordwiseHuscle,
              spent: false,
              hasLag: false,
            },
          ],
          legendArea: [
            {
              card: c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
              faceDown: false,
              spent: false,
            },
          ],
          trash: [c.welcomeToNightCityRetailAdamSmasherMetalOverMeat],
          eddies: 3,
        },
        {
          field: [
            {
              card: c.welcomeToNightCityRetailDelamainCab,
              spent: true,
              hasLag: false,
              powerModifier: 5,
            },
            {
              card: c.welcomeToNightCityRetailCorpoSecurity,
              spent: false,
              hasLag: false,
            },
          ],
        },
        {
          seed: scenarioSeed("pendingEffectsRiverRelicAdamSmasher"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      ),
  },
];
