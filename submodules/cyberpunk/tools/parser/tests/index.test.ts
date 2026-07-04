import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { expect, test } from "vite-plus/test";
import {
  generateStructuredCardFiles,
  loadGeneratedCards,
  parseAlphaCards,
  parseEmbracingPowerRetailStarterDeckCards,
  parsePromoCards,
  parsePrm01Cards,
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
  const prm01Cards = parsePrm01Cards(generatedCards);
  const theHeistRetailStarterDeckCards = parseTheHeistRetailStarterDeckCards(generatedCards);
  const embracingPowerRetailStarterDeckCards =
    parseEmbracingPowerRetailStarterDeckCards(generatedCards);
  const welcomeToNightCityRetailCards = parseWelcomeToNightCityRetailCards(generatedCards);
  const cards = parseStructuredCards(generatedCards);

  expect(alphaCards).toHaveLength(28);
  expect(spoilerCards).toHaveLength(27);
  expect(promoCards).toHaveLength(1);
  expect(prm01Cards).toHaveLength(1);
  expect(theHeistRetailStarterDeckCards).toHaveLength(5);
  expect(embracingPowerRetailStarterDeckCards).toHaveLength(5);
  expect(welcomeToNightCityRetailCards).toHaveLength(69);
  expect(cards).toHaveLength(136);

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
    slug: "yorinobu-arasaka-embracing-destruction",
    canonicalId: "yorinobu-arasaka-embracing-destruction",
    printings: [
      {
        id: "eb37f60f-a376-4412-a4cd-7ce5c1b088f6",
        artId: "eb37f60f-a376-4412-a4cd-7ce5c1b088f6",
        collectorNumber: "α001",
        setCode: "alpha",
        rarity: "",
      },
      {
        id: "0df78ba5-116a-4794-b975-7bbf85b95d3b",
        artId: "0df78ba5-116a-4794-b975-7bbf85b95d3b",
        collectorNumber: "α031",
        setCode: "alpha",
        rarity: "",
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
      `import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";`,
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
      `} satisfies AlphaCardDefinition;`,
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
  expect(result.prm01Cards).toHaveLength(1);
  expect(result.theHeistRetailStarterDeckCards).toHaveLength(5);
  expect(result.embracingPowerRetailStarterDeckCards).toHaveLength(5);
  expect(result.welcomeToNightCityRetailCards).toHaveLength(69);
  expect(result.retailCards).toHaveLength(79);
  expect(
    result.alphaCards.find((card) => card.slug === "yorinobu-arasaka-embracing-destruction")?.id,
  ).toBe("stable-existing-yori-id");

  const alphaIndex = await readFile(resolve(outputDir, "alpha/index.ts"), "utf8");
  const spoilerIndex = await readFile(resolve(outputDir, "spoiler/index.ts"), "utf8");
  const promoIndex = await readFile(resolve(outputDir, "promo/index.ts"), "utf8");
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
  const metadataFile = await readFile(resolve(outputDir, "card-metadata.ts"), "utf8");
  const yorinobuFile = await readFile(
    resolve(outputDir, "alpha/legends/yorinobu-arasaka-embracing-destruction.ts"),
    "utf8",
  );

  expect(alphaIndex).toContain("import type { StructuredCardDefinition } from");
  expect(alphaIndex).toContain("export const alphaCards: StructuredCardDefinition[] = [");
  expect(alphaIndex).toContain("...alphaUnits");
  expect(spoilerIndex).toContain("import type { StructuredCardDefinition } from");
  expect(spoilerIndex).toContain("export const spoilerCards: StructuredCardDefinition[] = [");
  expect(spoilerIndex).toContain("...spoilerPrograms");
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
  expect(yorinobuFile).toContain('id: "stable-existing-yori-id"');
  expect(yorinobuFile).toContain("AbilityBuilder.triggered().build()");
  expect(yorinobuFile).not.toContain("printings:");
  expect(yorinobuFile).not.toContain("selectedPrintingId:");
  expect(yorinobuFile).toContain("defineCyberpunkCard({");
  expect(yorinobuFile).toContain("import type { LegendCardDefinition } from");
  expect(yorinobuFile).toContain("satisfies LegendCardDefinition;");
  expect(metadataFile).toContain('"alpha:yorinobu-arasaka-embracing-destruction"');
  expect(metadataFile).toContain('collectorNumber: "α001"');
  expect(metadataFile).toContain('selectedPrintingId: "eb37f60f-a376-4412-a4cd-7ce5c1b088f6"');
  expect(spoilerGoroFile).toContain('rule: "blocker"');
  expect(promoLucynaFile).not.toContain("abilities: []");
});
