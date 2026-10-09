import type { Scenario } from "./types";
import { c, CyberpunkTestEngine, P1, scenarioSeed } from "./shared";

export const pendingEffectOrderScenarios: Scenario[] = [
  {
    id: "fightResultBeforeDefeats",
    group: "release-qa",
    label: "Fight result · effects before defeats",
    description:
      "Zealots lost the fight. Its effect defeated the equipped rival Unit first. Resolve River Ward's search, then confirm Zealots is defeated and the fight ends.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: c.welcomeToNightCityRetailMaelstromZealots, spent: false, hasLag: false },
          ],
          legendArea: [],
        },
        {
          field: [
            {
              card: c.welcomeToNightCityRetailFieldOperator,
              spent: true,
              hasLag: false,
              attachedGears: [c.welcomeToNightCityRetailMantisBlades],
            },
          ],
          legendArea: [
            {
              card: c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
              faceDown: false,
              spent: true,
            },
          ],
          deck: [c.welcomeToNightCityRetailCorpoSecurity, c.welcomeToNightCityRetailKiroshiOptics],
        },
        { seed: scenarioSeed("fightResultBeforeDefeats"), preserveDeckOrder: true },
      );
      engine.attackUnit(
        c.welcomeToNightCityRetailMaelstromZealots,
        c.welcomeToNightCityRetailFieldOperator,
        { as: P1 },
      );
      engine.resolveFullFight({ as: P1 });
      return engine;
    },
  },
  {
    id: "pendingFightEffectOrder",
    group: "release-qa",
    label: "Fight effects · choose card or delayed effect",
    description:
      "Safety Override and Maelstrom Zealots trigger on the same fight loss. Choose their order, resolve River Ward's search when the equipped rival is defeated, and finish the fight.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailSafetyOverride],
          eddies: 2,
          field: [
            { card: c.welcomeToNightCityRetailMaelstromZealots, spent: false, hasLag: false },
          ],
          legendArea: [],
        },
        {
          field: [
            {
              card: c.welcomeToNightCityRetailFieldOperator,
              spent: true,
              attachedGears: [c.welcomeToNightCityRetailMantisBlades],
            },
          ],
          legendArea: [
            {
              card: c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
              faceDown: false,
              spent: true,
            },
          ],
          deck: [c.welcomeToNightCityRetailCorpoSecurity, c.welcomeToNightCityRetailKiroshiOptics],
        },
        { seed: scenarioSeed("pendingFightEffectOrder"), preserveDeckOrder: true },
      );
      engine.playCard(c.welcomeToNightCityRetailSafetyOverride, { as: P1 });
      engine.attackUnit(
        c.welcomeToNightCityRetailMaelstromZealots,
        c.welcomeToNightCityRetailFieldOperator,
        { as: P1 },
      );
      engine.resolveFullFight({ as: P1 });
      return engine;
    },
  },
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
