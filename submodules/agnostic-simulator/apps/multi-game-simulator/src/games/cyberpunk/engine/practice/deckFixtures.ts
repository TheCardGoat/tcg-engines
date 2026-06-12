import { createCardCatalog, structuredCards } from "@tcg/cyberpunk-cards";
import { validateDeck } from "@tcg/cyberpunk-utils";
import type { DeckList } from "@tcg/cyberpunk-engine";

export interface PracticeDeckFixture {
  id: string;
  label: string;
  description: string;
  deck: DeckList;
  skipValidation?: boolean;
}

const catalog = createCardCatalog();
const cardsBySlug = new Map(structuredCards.map((card) => [card.slug, card]));

function cardBySlug(slug: string) {
  const card = cardsBySlug.get(slug);
  if (!card) {
    throw new Error(`Practice deck references unknown card slug: ${slug}`);
  }
  return card;
}

function idsForSlugs(slugs: readonly string[]): string[] {
  return slugs.map((slug) => cardBySlug(slug).id);
}

function repeatedMainDeck(slugs: readonly string[], extraSlugs: readonly string[]): string[] {
  return idsForSlugs([...slugs, ...slugs, ...extraSlugs]);
}

function makeFixture(input: {
  id: string;
  label: string;
  description: string;
  playerName: string;
  legends: readonly string[];
  mainDeckBase: readonly string[];
  mainDeckExtra: readonly string[];
  skipValidation?: boolean;
}): PracticeDeckFixture {
  const deck: DeckList = {
    playerId: input.id,
    playerName: input.playerName,
    legends: idsForSlugs(input.legends),
    mainDeck: repeatedMainDeck(input.mainDeckBase, input.mainDeckExtra),
  };

  if (!input.skipValidation) {
    const legendCards = input.legends.map(cardBySlug);
    const mainCards = deck.mainDeck.map((id) => {
      const card = catalog.get(id);
      if (!card) {
        throw new Error(`Practice deck references unknown card id: ${id}`);
      }
      return card;
    });
    const errors = validateDeck(legendCards, mainCards);
    if (errors.length > 0) {
      throw new Error(
        `Invalid practice deck "${input.id}": ${errors.map((err) => err.message).join("; ")}`,
      );
    }
  }

  return {
    id: input.id,
    label: input.label,
    description: input.description,
    deck,
    skipValidation: input.skipValidation,
  };
}

const redYellowBase = [
  "jackie-welles-ride-or-die-choom",
  "secondhand-bombus",
  "swordwise-huscle",
  "t-bug-amateur-philosopher",
  "kiroshi-optics",
  "mandibular-upgrade",
  "mantis-blades",
  "satori-sword-of-saburo",
  "industrial-assembly",
  "reboot-optics",
  "caliber-totentanz-s-top-dog",
  "hanako-arasaka-in-a-gilded-cage",
  "kerry-eurodyne-the-last-rockerboy",
  "meredith-stout-stone-cold-corpo",
  "gorilla-arms",
  "afterparty-at-lizzie-s",
  "ruthless-lowlife",
  "cyberpsychosis",
] as const;

const mixedOpsBase = [
  "corpo-security",
  "ruthless-lowlife",
  "secondhand-bombus",
  "swordwise-huscle",
  "t-bug-amateur-philosopher",
  "kiroshi-optics",
  "mandibular-upgrade",
  "mantis-blades",
  "satori-sword-of-saburo",
  "corporate-surveillance",
  "industrial-assembly",
  "reboot-optics",
  "hanako-arasaka-in-a-gilded-cage",
  "kerry-eurodyne-the-last-rockerboy",
  "meredith-stout-stone-cold-corpo",
  "afterparty-at-lizzie-s",
] as const;

export const PRACTICE_DECK_FIXTURES: readonly PracticeDeckFixture[] = [
  makeFixture({
    id: "street-heat",
    label: "Street Heat",
    description: "Fast red and yellow pressure with efficient Units, Gear, and tempo Programs.",
    playerName: "Street Heat",
    legends: [
      "viktor-vektor-sit-down-and-relax",
      "yorinobu-arasaka-embracing-destruction",
      "river-ward-detective-on-the-hunt",
    ],
    mainDeckBase: redYellowBase,
    mainDeckExtra: redYellowBase.slice(0, 4),
  }),
  makeFixture({
    id: "corpo-ops",
    label: "Corpo Ops",
    description: "A balanced green, red, and yellow pile with blockers, removal, and Gig tricks.",
    playerName: "Corpo Ops",
    legends: [
      "goro-takemura-hands-unclean",
      "viktor-vektor-sit-down-and-relax",
      "yorinobu-arasaka-embracing-destruction",
    ],
    mainDeckBase: mixedOpsBase,
    mainDeckExtra: mixedOpsBase.slice(0, 8),
  }),
  makeFixture({
    id: "arasaka-print-n-play",
    label: "Arasaka (Print & Play)",
    description:
      "Official Arasaka print-and-play deck. Green/red control with blockers, gear, and removal. Validation skipped: print-and-play decks use 27-card main decks (engine expects 40-50) and may exceed RAM budgets from the alpha card pool.",
    playerName: "Arasaka",
    skipValidation: true,
    legends: [
      "yorinobu-arasaka-embracing-destruction",
      "goro-takemura-hands-unclean",
      "saburo-arasaka-stubborn-patriach",
    ],
    mainDeckBase: [
      "mantis-blades",
      "satori-sword-of-saburo",
      "sandevistan",
      "corporate-surveillance",
      "industrial-assembly",
      "corpo-security",
      "ruthless-lowlife",
      "swordwise-huscle",
      "emergency-atlus",
      "goro-takemura-losing-his-way",
    ],
    mainDeckExtra: [
      "mantis-blades",
      "corporate-surveillance",
      "industrial-assembly",
      "corpo-security",
      "swordwise-huscle",
      "emergency-atlus",
      "armored-minotaur",
    ],
  }),
  makeFixture({
    id: "merc-print-n-play",
    label: "Merc (Print & Play)",
    description:
      "Official Merc print-and-play deck. Red/yellow aggro with gear, programs, and efficient units. Validation skipped: print-and-play decks use 27-card main decks (engine expects 40-50).",
    playerName: "Merc",
    skipValidation: true,
    legends: [
      "jackie-welles-pour-one-out-for-me",
      "v-corporate-exile",
      "viktor-vektor-sit-down-and-relax",
    ],
    mainDeckBase: [
      "kiroshi-optics",
      "mandibular-upgrade",
      "dying-night-v-s-pistol",
      "reboot-optics",
      "floor-it",
      "evelyn-parker-scheming-siren",
      "secondhand-bombus",
      "t-bug-amateur-philosopher",
      "delamain-cab",
      "mt0d12-flathead",
    ],
    mainDeckExtra: [
      "kiroshi-optics",
      "reboot-optics",
      "floor-it",
      "secondhand-bombus",
      "t-bug-amateur-philosopher",
      "delamain-cab",
      "jackie-welles-ride-or-die-choom",
    ],
  }),
];

export const DEFAULT_PLAYER_PRACTICE_DECK_ID = PRACTICE_DECK_FIXTURES[0]!.id;
export const DEFAULT_BOT_PRACTICE_DECK_ID = PRACTICE_DECK_FIXTURES[1]!.id;

export function getPracticeDeckFixture(id: string): PracticeDeckFixture | undefined {
  return PRACTICE_DECK_FIXTURES.find((fixture) => fixture.id === id);
}

export function getPracticeCardCatalog() {
  return catalog;
}
