import type { Scenario } from "./types";
import { c, CyberpunkTestEngine, P1, scenarioSeed } from "./shared";

function requireDeckSearchPrompt(
  engine: CyberpunkTestEngine,
  sourceName: string,
): CyberpunkTestEngine {
  const choice = engine.getPrompt(P1).choice;
  if (choice?.type !== "scry" || choice.payload.source?.displayName !== sourceName) {
    throw new Error(`${sourceName} visual fixture must stop at its deck-search prompt.`);
  }
  return engine;
}

export const deckSearchPromptScenarios: Scenario[] = [
  {
    id: "deckSearchThreeMouthsPrompt",
    group: "release-qa",
    label: "Deck search prompt · Three Mouths, One Desire",
    description:
      "Stops with three revealed cards and two friendly min Gigs, proving a required base pick plus a state-derived optional allowance.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailThreeMouthsOneDesire],
          deck: [
            c.welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
            c.welcomeToNightCityRetailTetratronicRippler,
            c.welcomeToNightCityRetailMoxInciters,
          ],
          eddies: 2,
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 1 },
          ],
        },
        undefined,
        {
          seed: scenarioSeed("deckSearchThreeMouthsPrompt"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      );
      engine.playCard(c.welcomeToNightCityRetailThreeMouthsOneDesire, { as: P1 });
      return requireDeckSearchPrompt(engine, "Three Mouths, One Desire");
    },
  },
  {
    id: "deckSearchHanakoPrompt",
    group: "release-qa",
    label: "Deck search prompt · Hanako Arasaka",
    description:
      "Stops with four revealed cards, two eligible costs, and friendly Gig values 2, 4, 5, and 6.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailHanakoArasakaInAGildedCage],
          deck: [
            c.welcomeToNightCityRetailAdamSmasherMetalOverMeat,
            c.welcomeToNightCityRetailTheRelicExperimentalBiochip,
            c.welcomeToNightCityRetailKiroshiOptics,
            c.welcomeToNightCityRetailSafetyOverride,
          ],
          eddies: 4,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 5 },
            { dieType: "d8", faceValue: 6 },
            { dieType: "d10", faceValue: 4 },
          ],
        },
        undefined,
        {
          seed: scenarioSeed("deckSearchHanakoPrompt"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      );
      engine.playCard(c.welcomeToNightCityRetailHanakoArasakaInAGildedCage, { as: P1 });
      return requireDeckSearchPrompt(engine, "Hanako Arasaka: In a Gilded Cage");
    },
  },
  {
    id: "deckSearchSketchyRipperPrompt",
    group: "release-qa",
    label: "Deck search prompt · Sketchy Ripper",
    description:
      "Stops after Sketchy Ripper attacks, with one eligible Gear among three revealed cards.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            {
              card: c.welcomeToNightCityRetailSketchyRipper,
              spent: false,
              hasLag: false,
            },
          ],
          deck: [
            c.welcomeToNightCityRetailMoxInciters,
            c.welcomeToNightCityRetailKiroshiOptics,
            c.welcomeToNightCityRetailFloorIt,
          ],
        },
        { gigArea: [{ dieType: "d4", faceValue: 1 }] },
        {
          seed: scenarioSeed("deckSearchSketchyRipperPrompt"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      );
      engine.attackRival(c.welcomeToNightCityRetailSketchyRipper, { as: P1 });
      return requireDeckSearchPrompt(engine, "Sketchy Ripper");
    },
  },
  {
    id: "deckSearchViktorPrompt",
    group: "release-qa",
    label: "Deck search prompt · Viktor Vektor",
    description:
      "Stops after calling Viktor, with low-cost Gear eligibility and a two-card optional maximum.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          deck: [
            c.welcomeToNightCityRetailKiroshiOptics,
            c.welcomeToNightCityRetailMantisBlades,
            c.welcomeToNightCityRetailSandevistan,
            c.welcomeToNightCityRetailFloorIt,
            c.welcomeToNightCityRetailDyingNightVSPistol,
          ],
          legendArea: [
            {
              card: c.theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
              faceDown: true,
            },
          ],
          eddies: 1,
        },
        undefined,
        {
          seed: scenarioSeed("deckSearchViktorPrompt"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      );
      engine.callLegend(c.theHeistRetailStarterDeckViktorVektorSitDownAndRelax, { as: P1 });
      return requireDeckSearchPrompt(engine, "Viktor Vektor: Sit Down and Relax");
    },
  },
  {
    id: "deckSearchRiverWardPrompt",
    group: "release-qa",
    label: "Deck search prompt · River Ward",
    description:
      "Stops after an equipped friendly Unit is defeated, requiring exactly one of two cards to be trashed.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          deck: [c.welcomeToNightCityRetailDelamainCab, c.welcomeToNightCityRetailFieldOperator],
          field: [
            {
              card: c.welcomeToNightCityRetailSwordwiseHuscle,
              spent: false,
              hasLag: false,
              attachedGears: [c.welcomeToNightCityRetailMantisBlades],
            },
          ],
          legendArea: [
            {
              card: c.welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
              faceDown: false,
              spent: false,
            },
          ],
        },
        {
          field: [
            {
              card: c.welcomeToNightCityRetailCorpoSecurity,
              spent: true,
              hasLag: false,
              powerModifier: 5,
            },
          ],
        },
        {
          seed: scenarioSeed("deckSearchRiverWardPrompt"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      );
      engine.attackUnit(
        c.welcomeToNightCityRetailSwordwiseHuscle,
        c.welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      );
      engine.resolveFullFight({ as: P1 });
      return requireDeckSearchPrompt(engine, "River Ward: Detective on the Hunt");
    },
  },
  {
    id: "deckSearchTetratronicPrompt",
    group: "release-qa",
    label: "Deck search prompt · Tetratronic Rippler",
    description:
      "Stops after the equipped host is spent, offering one card to trash or keep on top of the deck.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            {
              card: c.welcomeToNightCityRetailFieldOperator,
              spent: false,
              hasLag: false,
              attachedGears: [c.welcomeToNightCityRetailTetratronicRippler],
            },
          ],
          deck: [c.welcomeToNightCityRetailCorpoSecurity],
        },
        undefined,
        {
          seed: scenarioSeed("deckSearchTetratronicPrompt"),
          autoGainGig: false,
          preserveDeckOrder: true,
        },
      );
      engine.attackRival(c.welcomeToNightCityRetailFieldOperator, { as: P1 });
      return requireDeckSearchPrompt(engine, "Tetratronic Rippler");
    },
  },
];
