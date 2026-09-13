import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { expect, test } from "vite-plus/test";
import {
  generateStructuredCardFiles,
  loadGeneratedCards,
  parseEmbracingPowerRetailStarterDeckCards,
  parsePromoCards,
  parsePrm01Cards,
  parseStructuredCards,
  parseTheHeistRetailStarterDeckCards,
  parseWelcomeToNightCityRetailCards,
} from "../src/index.ts";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../../..");
const generatedFilePath = resolve(repoRoot, "packages/cards/src/generated.ts");

test("parser builds structured cards from generated source", async () => {
  const generatedCards = await loadGeneratedCards(generatedFilePath);
  const promoCards = parsePromoCards(generatedCards);
  const prm01Cards = parsePrm01Cards(generatedCards);
  const theHeistRetailStarterDeckCards = parseTheHeistRetailStarterDeckCards(generatedCards);
  const embracingPowerRetailStarterDeckCards =
    parseEmbracingPowerRetailStarterDeckCards(generatedCards);
  const welcomeToNightCityRetailCards = parseWelcomeToNightCityRetailCards(generatedCards);
  const cards = parseStructuredCards(generatedCards);

  expect(promoCards.length).toBeGreaterThan(0);
  expect(prm01Cards).toHaveLength(1);
  expect(theHeistRetailStarterDeckCards).toHaveLength(5);
  expect(embracingPowerRetailStarterDeckCards).toHaveLength(5);
  expect(welcomeToNightCityRetailCards).toHaveLength(140);
  expect(cards).toHaveLength(152);

  expect(
    welcomeToNightCityRetailCards
      .filter((card) =>
        [
          "animals-wrecker",
          "les-e-le-mens",
          "rockn-rockerboy",
          "unlikely-bond",
          "v-roamer-of-the-badlands",
          "wild-in-the-streets",
        ].includes(card.slug),
      )
      .map((card) => card.slug)
      .sort(),
  ).toEqual([
    "animals-wrecker",
    "les-e-le-mens",
    "rockn-rockerboy",
    "unlikely-bond",
    "v-roamer-of-the-badlands",
    "wild-in-the-streets",
  ]);

  expect(
    welcomeToNightCityRetailCards
      .filter((card) =>
        [
          "appetite-for-destruction",
          "hanako-arasaka-daughter-of-the-emperor",
          "pepe-najarro-working-doubles",
          "rita-wheeler-no-stupid-questions",
        ].includes(card.slug),
      )
      .map((card) => card.printNumber),
  ).toEqual(["028", "072", "086", "125"]);

  const appetiteForDestruction = welcomeToNightCityRetailCards.find(
    (card) => card.slug === "appetite-for-destruction",
  );
  expect(appetiteForDestruction?.abilities).toMatchObject([
    {
      trigger: { trigger: "play" },
      effects: [
        {
          effect: "grantNextFightWinGigSteal",
          minPowerMargin: 3,
          duration: "turn",
        },
      ],
    },
  ]);

  const hanako = welcomeToNightCityRetailCards.find(
    (card) => card.slug === "hanako-arasaka-daughter-of-the-emperor",
  );
  expect(hanako?.abilities).toMatchObject([
    {
      trigger: { trigger: "activated" },
      costs: [{ cost: "spend", target: { selector: "self" } }],
      effects: [{ effect: "swapGigs" }],
    },
    {
      trigger: {
        trigger: "event",
        event: { event: "turnStarted", player: "friendly" },
      },
      effects: [
        {
          effect: "forEachFriendlyGigPair",
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    },
  ]);

  const lucyna = promoCards.find((card) => card.slug === "lucyna-kushinada");
  expect(lucyna?.abilities).toEqual([]);

  const bootlegBlackSapphireShow = welcomeToNightCityRetailCards.find(
    (card) => card.slug === "bootleg-black-sapphire-show",
  );
  expect(bootlegBlackSapphireShow?.abilities[0]?.effects).toMatchObject([
    {
      effect: "sellFromDeck",
      player: "friendly",
      amount: 1,
    },
    {
      effect: "draw",
      player: "friendly",
      amount: 2,
      conditions: [{ condition: "hasEvenAndOddGigValues", controller: "friendly" }],
    },
  ]);

  const augmentedNegotiators = welcomeToNightCityRetailCards.find(
    (card) => card.slug === "augmented-negotiators",
  );
  expect(augmentedNegotiators?.abilities[1]).toMatchObject({
    trigger: {
      trigger: "event",
      event: {
        event: "blockerActivated",
      },
    },
    effects: [{ effect: "discardFromHand", player: "rival", amount: 1 }],
  });

  const jackedInVoodooBoy = welcomeToNightCityRetailCards.find(
    (card) => card.slug === "jacked-in-voodoo-boy",
  );
  expect(jackedInVoodooBoy?.abilities[0]?.effects[0]).toMatchObject({
    effect: "grantRule",
    rule: "requiresProgramPlayedThisTurn",
  });

  const newRetailSlugs = [
    "dexter-deshawn-off-the-grid",
    "chrome-fang",
    "arasaka-emergency-radioport",
    "deadman-transmitter",
    "gunpoint-diplomacy",
    "shattered-memories",
    "muamar-reyes-el-capita-n",
    "rogue-amendiares-preem-solo",
    "heywood-ripperdoc",
    "maelstrom-goons",
    "trauma-team-operatives",
    "viktor-vektor-drop-your-illusions",
    "adrenaline-converter",
    "padre-man-of-the-cross",
    "maxtac-av",
    "panam-palmer-strength-through-family",
    "zetatech-berserk",
    "don-t-fear-the-reaper",
    "wakako-okada-peace-and-harmony",
    "delamain-rideshare-ai",
    "modded-muramasa",
    "tetratronic-rippler",
  ];
  const newRetailCards = welcomeToNightCityRetailCards.filter((card) =>
    newRetailSlugs.includes(card.slug),
  );
  expect(newRetailCards.map((card) => card.slug).sort()).toEqual([...newRetailSlugs].sort());
  for (const card of newRetailCards) {
    const hasCostModifier = Boolean(card.costModifier);
    const hasEffects = card.abilities.some((ability) => ability.effects.length > 0);
    expect(hasCostModifier || hasEffects).toBe(true);
  }

  expect(
    welcomeToNightCityRetailCards.find((card) => card.slug === "dexter-deshawn-off-the-grid")
      ?.abilities[0]?.effects[0],
  ).toMatchObject({ effect: "chooseEffect" });
  expect(
    welcomeToNightCityRetailCards.find((card) => card.slug === "trauma-team-operatives")
      ?.costModifier,
  ).toMatchObject({ reducer: "perTargetCount", min: 1 });
  expect(
    welcomeToNightCityRetailCards.find((card) => card.slug === "rogue-amendiares-preem-solo")
      ?.keywords,
  ).toContain("goSolo");

  const remainingRuntimeSlugs = [
    "nocturne-op55-n1",
    "rogue-amendiares-queen-of-the-afterlife",
    "towerfall",
    "we-gotta-live-together",
    "animals-wrecker",
    "detonate",
    "maxtac-heavy",
    "memory-relapse",
    "rockn-rockerboy",
    "three-mouths-one-desire",
    "tyger-s-whisper",
    "westbrook-netrunner",
  ];
  const remainingRuntimeCards = remainingRuntimeSlugs.map((slug) => {
    const card = welcomeToNightCityRetailCards.find((candidate) => candidate.slug === slug);
    expect(card, slug).toBeDefined();
    return card!;
  });
  expect(remainingRuntimeCards.map((card) => card.slug).sort()).toEqual(
    [...remainingRuntimeSlugs].sort(),
  );

  const flavorOnlySlugs = new Set(["animals-wrecker", "rockn-rockerboy"]);
  for (const card of remainingRuntimeCards) {
    const emptyStatic = card.abilities.some(
      (ability) => ability.kind === "static" && ability.effects.length === 0,
    );
    expect(emptyStatic, card.slug).toBe(false);
    if (flavorOnlySlugs.has(card.slug)) {
      expect(card.abilities, card.slug).toEqual([]);
      continue;
    }
    const hasEffects = card.abilities.some((ability) => ability.effects.length > 0);
    expect(hasEffects || Boolean(card.costModifier), card.slug).toBe(true);
  }

  const nocturne = welcomeToNightCityRetailCards.find((card) => card.slug === "nocturne-op55-n1");
  expect(nocturne?.costModifier).toMatchObject({
    reducer: "replace",
    amount: 1,
    conditions: [{ condition: "fixerAreaCount", comparison: "eq", value: 0 }],
  });
  expect(nocturne?.abilities[0]?.effects[0]).toMatchObject({
    effect: "chooseEffect",
    options: [{ id: "draw" }, { id: "cant-attack" }, { id: "go-solo" }],
  });

  const rogueQueen = welcomeToNightCityRetailCards.find(
    (card) => card.slug === "rogue-amendiares-queen-of-the-afterlife",
  );
  expect(rogueQueen?.keywords).toContain("quick");
  expect(rogueQueen?.abilities.map((ability) => ability.effects[0]?.effect)).toEqual([
    undefined,
    "readyEddies",
    "modifyPower",
  ]);

  const towerfall = welcomeToNightCityRetailCards.find((card) => card.slug === "towerfall");
  expect(towerfall?.abilities[0]?.effects[0]).toMatchObject({
    effect: "chooseEffect",
    options: [{ id: "both" }, { id: "power-down" }, { id: "bottom-deck" }],
  });

  const weGotta = welcomeToNightCityRetailCards.find(
    (card) => card.slug === "we-gotta-live-together",
  );
  expect(weGotta?.costModifier).toMatchObject({
    reducer: "replace",
    amount: 3,
    conditions: [{ condition: "gigCountDifference", value: 2 }],
  });
  expect(weGotta?.abilities[0]?.effects.map((effect) => effect.effect)).toEqual([
    "playCard",
    "playCard",
  ]);

  expect(
    welcomeToNightCityRetailCards.find((card) => card.slug === "detonate")?.abilities[1]
      ?.effects[0],
  ).toMatchObject({ effect: "defeat", target: { cardTypes: ["gear"], maxPower: 2 } });
  expect(
    welcomeToNightCityRetailCards
      .find((card) => card.slug === "memory-relapse")
      ?.abilities[0]?.effects.map((effect) => effect.effect),
  ).toEqual(["spend", "grantRule", "draw"]);
  expect(
    welcomeToNightCityRetailCards.find((card) => card.slug === "three-mouths-one-desire")
      ?.abilities[0]?.effects[0],
  ).toMatchObject({ effect: "searchDeck", lookCount: 3, reveal: false });
  expect(
    welcomeToNightCityRetailCards.find((card) => card.slug === "tyger-s-whisper")?.abilities[0]
      ?.effects[0],
  ).toMatchObject({ effect: "callLegend", free: true, optional: true });
  expect(
    welcomeToNightCityRetailCards.find((card) => card.slug === "westbrook-netrunner")?.abilities[0]
      ?.effects[0],
  ).toMatchObject({ effect: "grantRule", rule: "cantStealGigBelowPower" });
  expect(
    welcomeToNightCityRetailCards.find((card) => card.slug === "maxtac-heavy")?.costModifier,
  ).toMatchObject({ reducer: "perTargetCount", min: 1 });
});

test("generator writes set card files and root indexes", async () => {
  const outputDir = await mkdtemp(resolve(tmpdir(), "cyberpunk-generate-"));
  const result = await generateStructuredCardFiles({
    generatedFilePath,
    outputDir,
  });

  expect(result.promoCards.length).toBeGreaterThan(0);
  expect(result.prm01Cards).toHaveLength(1);
  expect(result.theHeistRetailStarterDeckCards).toHaveLength(5);
  expect(result.embracingPowerRetailStarterDeckCards).toHaveLength(5);
  expect(result.welcomeToNightCityRetailCards.length).toBeGreaterThan(0);
  expect(result.retailCards.length).toBeGreaterThan(0);

  const promoIndex = await readFile(resolve(outputDir, "promo/index.ts"), "utf8");
  const theHeistRetailStarterDeckIndex = await readFile(
    resolve(outputDir, "theheistretailstarterdeck/index.ts"),
    "utf8",
  );
  const welcomeToNightCityRetailIndex = await readFile(
    resolve(outputDir, "welcometonightcityretail/index.ts"),
    "utf8",
  );
  const promoLucynaFile = await readFile(
    resolve(outputDir, "promo/legends/lucyna-kushinada.ts"),
    "utf8",
  );
  const metadataFile = await readFile(resolve(outputDir, "card-metadata.ts"), "utf8");

  expect(promoIndex).toContain("import type { StructuredCardDefinition } from");
  expect(promoIndex).toContain("export const promoCards: StructuredCardDefinition[] = [");
  expect(theHeistRetailStarterDeckIndex).toContain("import type { StructuredCardDefinition } from");
  expect(theHeistRetailStarterDeckIndex).toContain(
    "export const theHeistRetailStarterDeckCards: StructuredCardDefinition[] = [",
  );
  expect(welcomeToNightCityRetailIndex).toContain("import type { StructuredCardDefinition } from");
  expect(welcomeToNightCityRetailIndex).toContain(
    "export const welcomeToNightCityRetailCards: StructuredCardDefinition[] = [",
  );
  expect(promoLucynaFile).not.toContain("abilities: []");

  expect(metadataFile).toContain('collectorNumber: "001"');
});
