/**
 * Hyperia City (set 014) actions: parsed card data vs. printed source data.
 *
 * Expected values are derived from the downloaded source inputs
 * (data/inputs/ravensburger-input.json + data/inputs/lorcast-input.json),
 * so these tests fail when generation, parser normalization, or upstream
 * source data drift away from the printed cards.
 */

import { describe, expect, it } from "bun:test";
import { shedYourWearyLoad } from "./027-shed-your-weary-load";
import { neverTooFarApart } from "./028-never-too-far-apart";
import { rememberMe } from "./029-remember-me";
import { neverGonnaLetYouCry } from "./030-never-gonna-let-you-cry";
import { everyoneKnowsJuanita } from "./060-everyone-knows-juanita";
import { mimsMalice } from "./061-mims-malice";
import { higitusFigitus } from "./062-higitus-figitus";
import { unPocoLoco } from "./063-un-poco-loco";
import { magnificentMarvelous } from "./064-magnificent-marvelous";
import { creativeInspiration } from "./065-creative-inspiration";
import { airDrop } from "./094-air-drop";
import { aboveTheCrowd } from "./095-above-the-crowd";
import { anotherTaleToSpin } from "./096-another-tale-to-spin";
import { thisIsBusiness } from "./097-this-is-business";
import { flippantTaunt } from "./098-flippant-taunt";
import { chemicalReaction } from "./099-chemical-reaction";
import { intimidationTactics } from "./128-intimidation-tactics";
import { pushingBoundaries } from "./129-pushing-boundaries";
import { ifSheDoesntScareYou } from "./130-if-she-doesnt-scare-you";
import { thoughIHaveToSayGoodbye } from "./131-though-i-have-to-say-goodbye";
import { aDarkAgeNoMore } from "./162-a-dark-age-no-more";
import { everythingElseIsObsolete } from "./163-everything-else-is-obsolete";
import { intenseResearch } from "./164-intense-research";
import { scram } from "./165-scram";
import { joustingMatch } from "./197-jousting-match";
import { inkExplosion } from "./198-ink-explosion";
import { khanTransportDelivery } from "./199-khan-transport-delivery";
import { peopleGonnaComeHere } from "./200-people-gonna-come-here";

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
    card: shedYourWearyLoad,
    name: "Shed Your Weary Load",
    version: undefined,
    cost: 5,
    inkTypes: ["amber"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Goofy Movie",
    set: "014",
    collectorNumber: "27",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: neverTooFarApart,
    name: "Never Too Far Apart",
    version: undefined,
    cost: 9,
    inkTypes: ["amber"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Goofy Movie",
    set: "014",
    collectorNumber: "28",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: ["Sing Together 9"],
  },
  {
    card: rememberMe,
    name: "Remember Me",
    version: undefined,
    cost: 6,
    inkTypes: ["amber"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "super_rare",
    sourceRarity: "super_rare",
    classifications: [],
    franchise: "Coco",
    set: "014",
    collectorNumber: "29",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: ["Sing Together 6"],
  },
  {
    card: neverGonnaLetYouCry,
    name: "Never Gonna Let You Cry",
    version: undefined,
    cost: 5,
    inkTypes: ["amber"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Turning Red",
    set: "014",
    collectorNumber: "30",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: ["Sing Together 5"],
  },
  {
    card: everyoneKnowsJuanita,
    name: "Everyone Knows Juanita",
    version: undefined,
    cost: 5,
    inkTypes: ["amethyst"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Coco",
    set: "014",
    collectorNumber: "60",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: mimsMalice,
    name: "Mim's Malice",
    version: undefined,
    cost: 2,
    inkTypes: ["amethyst"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Sword in the Stone",
    set: "014",
    collectorNumber: "61",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: higitusFigitus,
    name: "Higitus Figitus",
    version: undefined,
    cost: 6,
    inkTypes: ["amethyst"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Sword in the Stone",
    set: "014",
    collectorNumber: "62",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: unPocoLoco,
    name: "Un Poco Loco",
    version: undefined,
    cost: 3,
    inkTypes: ["amethyst"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Coco",
    set: "014",
    collectorNumber: "63",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: ["Sing Together 3"],
  },
  {
    card: magnificentMarvelous,
    name: "Magnificent, Marvelous",
    version: undefined,
    cost: 4,
    inkTypes: ["amethyst"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Sword in the Stone",
    set: "014",
    collectorNumber: "64",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: creativeInspiration,
    name: "Creative Inspiration",
    version: undefined,
    cost: 7,
    inkTypes: ["amethyst"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Lorcana",
    set: "014",
    collectorNumber: "65",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: airDrop,
    name: "Air Drop",
    version: undefined,
    cost: 4,
    inkTypes: ["emerald"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Talespin",
    set: "014",
    collectorNumber: "94",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: aboveTheCrowd,
    name: "Above the Crowd",
    version: undefined,
    cost: 5,
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
    collectorNumber: "95",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: anotherTaleToSpin,
    name: "Another Tale to Spin",
    version: undefined,
    cost: 2,
    inkTypes: ["emerald"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Talespin",
    set: "014",
    collectorNumber: "96",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: thisIsBusiness,
    name: "This Is Business",
    version: undefined,
    cost: 3,
    inkTypes: ["emerald"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Talespin",
    set: "014",
    collectorNumber: "97",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: flippantTaunt,
    name: "Flippant Taunt",
    version: undefined,
    cost: 1,
    inkTypes: ["emerald"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Talespin",
    set: "014",
    collectorNumber: "98",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: chemicalReaction,
    name: "Chemical Reaction",
    version: undefined,
    cost: 2,
    inkTypes: ["emerald"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Big Hero 6",
    set: "014",
    collectorNumber: "99",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: intimidationTactics,
    name: "Intimidation Tactics",
    version: undefined,
    cost: 2,
    inkTypes: ["ruby"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Gargoyles",
    set: "014",
    collectorNumber: "128",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: pushingBoundaries,
    name: "Pushing Boundaries",
    version: undefined,
    cost: 2,
    inkTypes: ["ruby"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "Big Hero 6",
    set: "014",
    collectorNumber: "129",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: ifSheDoesntScareYou,
    name: "If She Doesn't Scare You",
    version: undefined,
    cost: 4,
    inkTypes: ["ruby"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "uncommon",
    sourceRarity: "uncommon",
    classifications: [],
    franchise: "101 Dalmatians",
    set: "014",
    collectorNumber: "130",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: thoughIHaveToSayGoodbye,
    name: "Though I Have to Say Goodbye",
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
    franchise: "Coco",
    set: "014",
    collectorNumber: "131",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: aDarkAgeNoMore,
    name: "A Dark Age No More",
    version: undefined,
    cost: 3,
    inkTypes: ["sapphire"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Sword in the Stone",
    set: "014",
    collectorNumber: "162",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: everythingElseIsObsolete,
    name: "Everything Else Is Obsolete",
    version: undefined,
    cost: 3,
    inkTypes: ["sapphire"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Aristocats",
    set: "014",
    collectorNumber: "163",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: intenseResearch,
    name: "Intense Research",
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
    collectorNumber: "164",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: scram,
    name: "Scram!",
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
    franchise: "Sword in the Stone",
    set: "014",
    collectorNumber: "165",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: joustingMatch,
    name: "Jousting Match",
    version: undefined,
    cost: 3,
    inkTypes: ["steel"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Sword in the Stone",
    set: "014",
    collectorNumber: "197",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: inkExplosion,
    name: "Ink Explosion",
    version: undefined,
    cost: 4,
    inkTypes: ["steel"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Lorcana",
    set: "014",
    collectorNumber: "198",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
  {
    card: khanTransportDelivery,
    name: "Khan Transport Delivery",
    version: undefined,
    cost: 2,
    inkTypes: ["steel"],
    inkable: false,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "common",
    sourceRarity: "common",
    classifications: [],
    franchise: "Talespin",
    set: "014",
    collectorNumber: "199",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: ["lorcast"],
    keywords: [],
  },
  {
    card: peopleGonnaComeHere,
    name: "People Gonna Come Here",
    version: undefined,
    cost: 7,
    inkTypes: ["steel"],
    inkable: true,
    strength: undefined,
    willpower: undefined,
    lore: undefined,
    rarity: "rare",
    sourceRarity: "rare",
    classifications: [],
    franchise: "Princess and the Frog",
    set: "014",
    collectorNumber: "200",
    vanilla: false,
    hasSourceText: true,
    externalIdKeys: [],
    keywords: [],
  },
];

describe("Hyperia City actions - card data vs. printed source", () => {
  it.each(expectedCards)(
    "$name - $version matches the printed card data",
    (entry: ExpectedCard) => {
      expectCardMatchesSource(entry);
    },
  );
});
