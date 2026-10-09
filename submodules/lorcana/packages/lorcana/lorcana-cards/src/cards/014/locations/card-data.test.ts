/**
 * Hyperia City (set 014) locations: parsed card data vs. printed source data.
 *
 * Expected values are derived from the downloaded source inputs
 * (data/inputs/ravensburger-input.json + data/inputs/lorcast-input.json),
 * so these tests fail when generation, parser normalization, or upstream
 * source data drift away from the printed cards.
 */

import { describe, expect, it } from "bun:test";
import { portAuthorityCenterHub } from "./034-port-authority-center-hub";
import { merlinsShopAndSmithyMagicalMarket } from "./068-merlins-shop-and-smithy-magical-market";
import { theBeanstalkOnwardAndUpward } from "./102-the-beanstalk-onward-and-upward";
import { landOfTheDeadMarigoldBridge } from "./135-land-of-the-dead-marigold-bridge";
import { khanStadiumStateOfTheArt } from "./136-khan-stadium-state-of-the-art";
import { instituteOfTechnologyHoneyLemonsLab } from "./170-institute-of-technology-honey-lemons-lab";
import { centralStationTransportationHub } from "./203-central-station-transportation-hub";
import { khanIndustriesGreenwayLandmark } from "./204-khan-industries-greenway-landmark";

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
    card: portAuthorityCenterHub,
    name: "Port Authority",
    version: "Center Hub",
    cost: 4,
    inkTypes: ["amber"],
    inkable: false,
    strength: undefined,
    willpower: 8,
    lore: 2,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: ["Hyperia City"],
    franchise: "Lorcana",
    set: "014",
    collectorNumber: "34",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: merlinsShopAndSmithyMagicalMarket,
    name: "Merlin's Shop and Smithy",
    version: "Magical Market",
    cost: 2,
    inkTypes: ["amethyst"],
    inkable: true,
    strength: undefined,
    willpower: 6,
    lore: 0,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: ["Hyperia City"],
    franchise: "Sword in the Stone",
    set: "014",
    collectorNumber: "68",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: theBeanstalkOnwardAndUpward,
    name: "The Beanstalk",
    version: "Onward and Upward",
    cost: 1,
    inkTypes: ["emerald"],
    inkable: true,
    strength: undefined,
    willpower: 6,
    lore: 0,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: undefined,
    set: "014",
    collectorNumber: "102",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: ["Evasive"],
  },
  {
    card: landOfTheDeadMarigoldBridge,
    name: "Land of the Dead",
    version: "Marigold Bridge",
    cost: 4,
    inkTypes: ["ruby"],
    inkable: true,
    strength: undefined,
    willpower: 8,
    lore: 1,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Coco",
    set: "014",
    collectorNumber: "135",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: khanStadiumStateOfTheArt,
    name: "Khan Stadium",
    version: "State of the Art",
    cost: 1,
    inkTypes: ["ruby"],
    inkable: true,
    strength: undefined,
    willpower: 4,
    lore: 1,
    rarity: "common",
    sourceRarity: "common",
    classifications: ["Hyperia City"],
    franchise: "Lorcana",
    set: "014",
    collectorNumber: "136",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: instituteOfTechnologyHoneyLemonsLab,
    name: "Institute of Technology",
    version: "Honey Lemon's Lab",
    cost: 2,
    inkTypes: ["sapphire"],
    inkable: true,
    strength: undefined,
    willpower: 5,
    lore: 1,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Big Hero 6",
    set: "014",
    collectorNumber: "170",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: centralStationTransportationHub,
    name: "Central Station",
    version: "Transportation Hub",
    cost: 1,
    inkTypes: ["steel"],
    inkable: true,
    strength: undefined,
    willpower: 2,
    lore: 0,
    rarity: "common",
    sourceRarity: "common",
    classifications: ["Hyperia City"],
    franchise: "Lorcana",
    set: "014",
    collectorNumber: "203",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: khanIndustriesGreenwayLandmark,
    name: "Khan Industries",
    version: "Greenway Landmark",
    cost: 5,
    inkTypes: ["steel"],
    inkable: true,
    strength: undefined,
    willpower: 8,
    lore: 2,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: ["Hyperia City"],
    franchise: "Talespin",
    set: "014",
    collectorNumber: "204",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
];

describe("Hyperia City locations - card data vs. printed source", () => {
  it.each(expectedCards)(
    "$name - $version matches the printed card data",
    (entry: ExpectedCard) => {
      expectCardMatchesSource(entry);
    },
  );
});
