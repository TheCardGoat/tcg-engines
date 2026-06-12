import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { expect, test } from "vite-plus/test";
import {
  generateStructuredCardFiles,
  loadGeneratedCards,
  parseAlphaCards,
  parseBoxToppersRetailCards,
  parsePromoCards,
  parseSpoilerCards,
  parseStructuredCards,
  parseTheHeistRetailStarterDeckCards,
  parseWelcomeToNightCityRetailCards,
} from "../src/index.ts";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../../..");
const generatedFilePath = resolve(repoRoot, "packages/cards/src/generated.ts");

test("parser builds structured cards from generated source", async () => {
  const generatedCards = await loadGeneratedCards(generatedFilePath);
  const alphaCards = parseAlphaCards(generatedCards);
  const spoilerCards = parseSpoilerCards(generatedCards);
  const promoCards = parsePromoCards(generatedCards);
  const boxToppersRetailCards = parseBoxToppersRetailCards(generatedCards);
  const theHeistRetailStarterDeckCards = parseTheHeistRetailStarterDeckCards(generatedCards);
  const welcomeToNightCityRetailCards = parseWelcomeToNightCityRetailCards(generatedCards);
  const cards = parseStructuredCards(generatedCards);

  expect(alphaCards).toHaveLength(28);
  expect(spoilerCards).toHaveLength(27);
  expect(promoCards).toHaveLength(1);
  expect(boxToppersRetailCards).toHaveLength(5);
  expect(theHeistRetailStarterDeckCards).toHaveLength(1);
  expect(welcomeToNightCityRetailCards).toHaveLength(28);
  expect(cards).toHaveLength(90);

  const armoredMinotaur = alphaCards.find((card) => card.slug === "armored-minotaur");
  expect(armoredMinotaur?.abilities).toHaveLength(1);
  expect(armoredMinotaur?.abilities[0]?.trigger).toEqual({ trigger: "play" });
  expect(armoredMinotaur?.abilities[0]?.effects[0]).toMatchObject({
    effect: "defeat",
    conditions: [
      {
        condition: "streetCred",
        comparison: "gte",
        value: 12,
      },
    ],
  });

  const viktor = alphaCards.find((card) => card.slug === "viktor-vektor-sit-down-and-relax");
  expect(viktor?.abilities[0]?.trigger).toEqual({ trigger: "flip" });
  expect(viktor?.abilities[0]?.effects[0]).toMatchObject({
    effect: "searchDeck",
    lookCount: 5,
    select: {
      max: 2,
    },
  });

  const spoilerGoro = spoilerCards.find((card) => card.slug === "goro-takemura-vengeful-bodyguard");
  expect(spoilerGoro?.keywords).toEqual([]);
  expect(
    spoilerGoro?.abilities.some((ability) =>
      ability.effects.some((effect) => effect.effect === "grantRule" && effect.rule === "blocker"),
    ),
  ).toBe(true);

  const lucyna = promoCards.find((card) => card.slug === "lucyna-kushinada");
  expect(lucyna?.abilities).toEqual([]);

  const chromeReverie = spoilerCards.find((card) => card.slug === "chrome-reverie");
  expect(chromeReverie?.abilities[0]?.effects).toMatchObject([
    {
      effect: "grantRule",
      rule: "cantAttack",
      duration: "untilSourceNextTurn",
      optional: true,
    },
    {
      effect: "callLegend",
      free: true,
      optional: true,
      conditions: [{ condition: "hasMinGig", controller: "friendly" }],
    },
  ]);

  const zetatechFaceplate = spoilerCards.find((card) => card.slug === "zetatech-faceplate");
  expect(zetatechFaceplate?.attachment?.target).toMatchObject({
    controller: "friendly",
    zones: ["field", "legendArea"],
    cardTypes: ["unit", "legend"],
    face: "faceUp",
  });
  expect(zetatechFaceplate?.abilities[0]?.trigger).toMatchObject({
    trigger: "event",
    event: {
      event: "cardSpent",
      target: { selector: "host" },
    },
  });
  expect(zetatechFaceplate?.abilities[0]?.effects[1]).toMatchObject({
    effect: "draw",
    amount: 1,
    conditions: [{ condition: "hasDistinctGigValues", controller: "friendly", minCount: 3 }],
  });

  const gildedMaton = spoilerCards.find((card) => card.slug === "gilded-maton");
  expect(gildedMaton?.abilities[0]?.effects[0]).toMatchObject({
    effect: "ifYouDo",
    doEffect: {
      effect: "defeat",
      target: {
        controller: "friendly",
        cardTypes: ["gear"],
      },
      optional: true,
    },
    ifEffects: [
      {
        effect: "defeat",
        target: {
          controller: "rival",
          zones: ["field"],
          cardTypes: ["unit"],
          maxCost: 3,
        },
      },
    ],
  });

  const mamanBrigitte = spoilerCards.find((card) => card.slug === "maman-brigitte");
  expect(mamanBrigitte?.classifications).toEqual(["Mystic", "Netrunner", "Voodoo Boys"]);
  expect(mamanBrigitte?.abilities[0]?.effects[0]).toMatchObject({
    effect: "ifYouDo",
    doEffect: {
      effect: "discardFromHand",
      player: "friendly",
      amount: 2,
      target: {
        zones: ["hand"],
        cardTypes: ["program"],
      },
      optional: true,
    },
    ifEffects: [
      {
        effect: "moveCard",
        target: {
          controller: "rival",
          zones: ["field"],
          cardTypes: ["unit"],
          hasAttachedCards: false,
        },
        destination: "deckBottom",
      },
    ],
  });

  const alternateArtCards = [
    alphaCards.find((card) => card.slug === "yorinobu-arasaka-embracing-destruction"),
    alphaCards.find((card) => card.slug === "goro-takemura-hands-unclean"),
    alphaCards.find((card) => card.slug === "saburo-arasaka-stubborn-patriach"),
    spoilerCards.find((card) => card.slug === "v-streetkid"),
  ];

  for (const card of alternateArtCards) {
    expect(card).toBeDefined();
    expect(card?.printings.length).toBeGreaterThan(1);
    expect(card?.printings.map((printing) => printing.id)).toContain(card?.selectedPrintingId);
  }

  const yorinobu = alphaCards.find(
    (card) => card.slug === "yorinobu-arasaka-embracing-destruction",
  );
  expect(yorinobu).toMatchObject({
    id: "23fc1451-7374-4c21-87ae-bb05d49f2836",
    externalId: "cyberpunk:yorinobu-arasaka-embracing-destruction",
    printings: [
      {
        id: "eb37f60f-a376-4412-a4cd-7ce5c1b088f6",
        collectorNumber: "α001",
        finish: "standard",
      },
      {
        id: "0df78ba5-116a-4794-b975-7bbf85b95d3b",
        collectorNumber: "α031",
        finish: "foil",
      },
    ],
    selectedPrintingId: "eb37f60f-a376-4412-a4cd-7ce5c1b088f6",
  });
});

test("generator writes set card files and root indexes", async () => {
  const outputDir = await mkdtemp(resolve(tmpdir(), "cyberpunk-alpha-"));
  await mkdir(resolve(outputDir, "alpha/legends"), { recursive: true });
  await writeFile(
    resolve(outputDir, "alpha/legends/yorinobu-arasaka-embracing-destruction.ts"),
    [
      `export const oldYorinobu = {`,
      `  id: "stable-existing-yori-id",`,
      `  slug: "yorinobu-arasaka-embracing-destruction",`,
      `  name: "Yorinobu Arasaka",`,
      `  displayName: "Yorinobu Arasaka - Embracing Destruction",`,
      `  set: { code: "alpha" },`,
      `  type: "legend",`,
      `  printings: [],`,
      `  selectedPrintingId: null,`,
      `  abilities: [AbilityBuilder.triggered().build()],`,
      `};`,
      "",
    ].join("\n"),
  );
  const result = await generateStructuredCardFiles({
    generatedFilePath,
    outputDir,
  });

  expect(result.alphaCards).toHaveLength(28);
  expect(result.spoilerCards).toHaveLength(27);
  expect(result.promoCards).toHaveLength(1);
  expect(result.boxToppersRetailCards).toHaveLength(5);
  expect(result.theHeistRetailStarterDeckCards).toHaveLength(1);
  expect(result.welcomeToNightCityRetailCards).toHaveLength(28);
  expect(result.retailCards).toHaveLength(34);
  expect(
    result.alphaCards.find((card) => card.slug === "yorinobu-arasaka-embracing-destruction")?.id,
  ).toBe("stable-existing-yori-id");

  const alphaIndex = await readFile(resolve(outputDir, "alpha/index.ts"), "utf8");
  const spoilerIndex = await readFile(resolve(outputDir, "spoiler/index.ts"), "utf8");
  const promoIndex = await readFile(resolve(outputDir, "promo/index.ts"), "utf8");
  const boxToppersRetailIndex = await readFile(
    resolve(outputDir, "boxtoppersretail/index.ts"),
    "utf8",
  );
  const theHeistRetailStarterDeckIndex = await readFile(
    resolve(outputDir, "theheistretailstarterdeck/index.ts"),
    "utf8",
  );
  const welcomeToNightCityRetailIndex = await readFile(
    resolve(outputDir, "welcometonightcityretail/index.ts"),
    "utf8",
  );
  const spoilerGoroFile = await readFile(
    resolve(outputDir, "spoiler/legends/goro-takemura-vengeful-bodyguard.ts"),
    "utf8",
  );
  const promoLucynaFile = await readFile(
    resolve(outputDir, "promo/legends/lucyna-kushinada.ts"),
    "utf8",
  );
  const yorinobuFile = await readFile(
    resolve(outputDir, "alpha/legends/yorinobu-arasaka-embracing-destruction.ts"),
    "utf8",
  );

  expect(alphaIndex).toContain("export const alphaCards = [");
  expect(alphaIndex).toContain("...alphaUnits");
  expect(spoilerIndex).toContain("export const spoilerCards = [");
  expect(spoilerIndex).toContain("...spoilerPrograms");
  expect(promoIndex).toContain("export const promoCards = [");
  expect(boxToppersRetailIndex).toContain("import type { BoxToppersRetailCardDefinition } from");
  expect(boxToppersRetailIndex).toContain("export const boxToppersRetailCards = [");
  expect(theHeistRetailStarterDeckIndex).toContain(
    "import type { TheHeistRetailStarterDeckCardDefinition } from",
  );
  expect(theHeistRetailStarterDeckIndex).toContain(
    "export const theHeistRetailStarterDeckCards = [",
  );
  expect(welcomeToNightCityRetailIndex).toContain(
    "import type { WelcomeToNightCityRetailCardDefinition } from",
  );
  expect(welcomeToNightCityRetailIndex).toContain("export const welcomeToNightCityRetailCards = [");
  expect(yorinobuFile).toContain('id: "stable-existing-yori-id"');
  expect(yorinobuFile).toContain("AbilityBuilder.triggered().build()");
  expect(yorinobuFile).toContain('collectorNumber: "α001"');
  expect(yorinobuFile).toContain('selectedPrintingId: "eb37f60f-a376-4412-a4cd-7ce5c1b088f6"');
  expect(spoilerGoroFile).toContain('rule: "blocker"');
  expect(promoLucynaFile).toContain("abilities: []");
});
