/**
 * Hyperia City (set 014) items: parsed card data vs. printed source data.
 *
 * Expected values are derived from the downloaded source inputs
 * (data/inputs/ravensburger-input.json + data/inputs/lorcast-input.json),
 * so these tests fail when generation, parser normalization, or upstream
 * source data drift away from the printed cards.
 */

import { describe, expect, it } from "bun:test";
import { ancestralGuitar } from "./031-ancestral-guitar";
import { speakerStack } from "./032-speaker-stack";
import { mamImeldasBlessing } from "./033-mama-imeldas-blessing";
import { merlinsWand } from "./066-merlins-wand";
import { inkcasterSkates } from "./067-inkcaster-skates";
import { bellesCityGuide } from "./100-belles-city-guide";
import { leaningTowerOfCheesea } from "./101-leaning-tower-of-cheese-a";
import { riveraFamilyPhoto } from "./132-rivera-family-photo";
import { theTornCorner } from "./133-the-torn-corner";
import { jukebox } from "./134-jukebox";
import { blindingChemBall } from "./166-blinding-chem-ball";
import { prototypeChemBall } from "./167-prototype-chem-ball";
import { spyglassHat } from "./168-spyglass-hat";
import { upgradedChemPurse } from "./169-upgraded-chem-purse";
import { hyperiaCityExpress } from "./201-hyperia-city-express";
import { piratePlane } from "./202-pirate-plane";

interface ExpectedCard {
  card: unknown;
  name: string;
  version?: string;
  cost: number;
  inkTypes: string[];
  inkable: boolean;
  strength?: number;
  willpower?: number;
  lore?: number;
  rarity: string;
  sourceRarity: string;
  classifications: string[];
  franchise?: string;
  set: string;
  collectorNumber: string;
  vanilla: boolean;
  hasSourceText: boolean;
  externalIdKeys: string[];
  keywords: string[];
}

function cardText(card: unknown): string {
  const text = (card as { text?: string | Array<{ title?: string; description?: string }> }).text;
  if (!text) return "";
  if (typeof text === "string") return text;
  return text.map((entry) => [entry.title, entry.description].filter(Boolean).join(" ")).join("\n");
}

function expectCardMatchesSource(entry: ExpectedCard): void {
  const card = entry.card as {
    name: string;
    version?: string;
    cardType: string;
    cost: number;
    inkType: string[];
    inkable: boolean;
    strength?: number;
    willpower?: number;
    lore?: number;
    rarity: string;
    classifications?: string[];
    franchise?: string;
    set: string;
    cardNumber: number;
    vanilla?: boolean;
    externalIds?: Record<string, string>;
    printings: Array<{ setCode: string; collectorNumber: string }>;
  };

  // Identity
  expect(card.name).toBe(entry.name);
  expect(card.version).toBe(entry.version);
  expect(card.set).toBe(entry.set);
  expect(card.cardNumber).toBe(Number(entry.collectorNumber));
  expect(card.printings[0].setCode).toBe("set14");
  expect(card.printings[0].collectorNumber).toBe(entry.collectorNumber);

  // Ink & cost
  expect(card.cost).toBe(entry.cost);
  expect([...card.inkType].sort()).toEqual([...entry.inkTypes].sort());
  expect(card.inkable).toBe(entry.inkable);

  // Stats (characters/locations only carry the printed values)
  expect(card.strength).toBe(entry.strength);
  expect(card.willpower).toBe(entry.willpower);
  expect(card.lore).toBe(entry.lore);

  // Rarity & classifications
  expect(card.rarity).toBe(entry.rarity);
  expect(card.rarity).toBe(entry.sourceRarity);
  expect(card.classifications ?? []).toEqual(entry.classifications);
  expect(card.franchise).toBe(entry.franchise);

  // Printed text: vanilla cards have no printed ability, all others do
  expect(card.vanilla ?? false).toBe(entry.vanilla);
  expect(Boolean(cardText(card).trim())).toBe(entry.hasSourceText);
  for (const keyword of entry.keywords) {
    expect(cardText(card).toLowerCase()).toContain(keyword.toLowerCase());
  }

  // Source reference ids survived the parse
  expect(Object.keys(card.externalIds ?? {}).sort()).toEqual([...entry.externalIdKeys].sort());
}

const expectedCards: ExpectedCard[] = [
  {
    card: ancestralGuitar,
    name: "Ancestral Guitar",
    version: undefined,
    cost: 2,
    inkTypes: ["amber"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Coco",
    set: "014",
    collectorNumber: "31",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: speakerStack,
    name: "Speaker Stack",
    version: undefined,
    cost: 2,
    inkTypes: ["amber"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Goofy Movie",
    set: "014",
    collectorNumber: "32",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: mamImeldasBlessing,
    name: "Mamá Imelda's Blessing",
    version: undefined,
    cost: 1,
    inkTypes: ["amber"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Coco",
    set: "014",
    collectorNumber: "33",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: merlinsWand,
    name: "Merlin's Wand",
    version: undefined,
    cost: 2,
    inkTypes: ["amethyst"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Sword in the Stone",
    set: "014",
    collectorNumber: "66",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: inkcasterSkates,
    name: "Inkcaster Skates",
    version: undefined,
    cost: 3,
    inkTypes: ["amethyst"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Lorcana",
    set: "014",
    collectorNumber: "67",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: bellesCityGuide,
    name: "Belle's City Guide",
    version: undefined,
    cost: 2,
    inkTypes: ["emerald"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Beauty and the Beast",
    set: "014",
    collectorNumber: "100",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: leaningTowerOfCheesea,
    name: "Leaning Tower of Cheese-a",
    version: undefined,
    cost: 1,
    inkTypes: ["emerald"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Goofy Movie",
    set: "014",
    collectorNumber: "101",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: ["Ward"],
  },
  {
    card: riveraFamilyPhoto,
    name: "Rivera Family Photo",
    version: undefined,
    cost: 1,
    inkTypes: ["ruby"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Coco",
    set: "014",
    collectorNumber: "132",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: theTornCorner,
    name: "The Torn Corner",
    version: undefined,
    cost: 3,
    inkTypes: ["ruby"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Coco",
    set: "014",
    collectorNumber: "133",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: jukebox,
    name: "Jukebox",
    version: undefined,
    cost: 2,
    inkTypes: ["ruby"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Lorcana",
    set: "014",
    collectorNumber: "134",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: blindingChemBall,
    name: "Blinding Chem Ball",
    version: undefined,
    cost: 1,
    inkTypes: ["sapphire"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Big Hero 6",
    set: "014",
    collectorNumber: "166",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: prototypeChemBall,
    name: "Prototype Chem Ball",
    version: undefined,
    cost: 1,
    inkTypes: ["sapphire"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Big Hero 6",
    set: "014",
    collectorNumber: "167",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: spyglassHat,
    name: "Spyglass Hat",
    version: undefined,
    cost: 3,
    inkTypes: ["sapphire"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Little Mermaid",
    set: "014",
    collectorNumber: "168",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: upgradedChemPurse,
    name: "Upgraded Chem Purse",
    version: undefined,
    cost: 2,
    inkTypes: ["sapphire"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Big Hero 6",
    set: "014",
    collectorNumber: "169",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: hyperiaCityExpress,
    name: "Hyperia City Express",
    version: undefined,
    cost: 1,
    inkTypes: ["steel"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Lorcana",
    set: "014",
    collectorNumber: "201",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: piratePlane,
    name: "Pirate Plane",
    version: undefined,
    cost: 3,
    inkTypes: ["steel"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Talespin",
    set: "014",
    collectorNumber: "202",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: ["Evasive"],
  },
];

describe("Hyperia City items - card data vs. printed source", () => {
  it.each(expectedCards)(
    "$name - $version matches the printed card data",
    (entry: ExpectedCard) => {
      expectCardMatchesSource(entry);
    },
  );
});
