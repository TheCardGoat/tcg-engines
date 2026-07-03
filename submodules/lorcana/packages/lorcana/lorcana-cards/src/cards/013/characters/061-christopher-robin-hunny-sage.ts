import type { CharacterCard } from "@tcg/lorcana-types";
import { christopherRobinHunnySageI18n } from "./061-christopher-robin-hunny-sage.i18n";

export const christopherRobinHunnySage: CharacterCard = {
  id: "JX3",
  canonicalId: "ci_JX3",
  slug: "lorcana-ci_JX3",
  printings: [
    {
      id: "set13-061",
      artId: "set13-061",
      setCode: "set13",
      collectorNumber: "61",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set13-061"],
  cardType: "character",
  name: "Christopher Robin",
  version: "Hunny Sage",
  inkType: ["amethyst", "sapphire"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 61,
  rarity: "legendary",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_61b7042adadb4518b842173c39ffe07b",
  },
  text: [
    {
      title: "GATHER THE PARTY",
      description: "You can have other Hunny characters in your deck regardless of ink type.",
    },
    {
      title: "MAGICAL SUMMONS",
      description:
        "When you play this character, you may search your deck for a Hunny card, reveal it, and put it in your hand. If you do, shuffle your deck.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Hunny"],
  deckConstructionRules: [
    {
      type: "ignore-ink-types",
      filter: { cardType: "character", classification: "Hunny" },
      excludeSourceCard: true,
    },
  ],
  abilities: [
    {
      type: "triggered",
      name: "MAGICAL SUMMONS",
      text: "MAGICAL SUMMONS When you play this character, you may search your deck for a Hunny card, reveal it, and put it in your hand. If you do, shuffle your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "search-deck",
          classification: "Hunny",
          putInto: "hand",
          reveal: true,
          shuffle: true,
        },
      },
    },
  ],
  i18n: christopherRobinHunnySageI18n,
};
