import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckFirstMateI18n } from "./080-donald-duck-first-mate.i18n";

export const donaldDuckFirstMate: CharacterCard = {
  id: "LAI",
  canonicalId: "ci_LAI",
  reprints: ["set6-080"],
  cardType: "character",
  name: "Donald Duck",
  version: "First Mate",
  inkType: ["emerald"],
  set: "006",
  cardNumber: 80,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_466a67ed11c64db5962523365e633f0d",
    tcgPlayer: 593002,
  },
  text: [
    {
      title: "CAPTAIN ON DECK",
      description: "While you have a Captain character in play, this character gets +2 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate"],
  abilities: [
    {
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "or-more",
        count: 1,
        classification: "Captain",
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1rl-1",
      name: "CAPTAIN ON DECK",
      text: "CAPTAIN ON DECK While you have a Captain character in play, this character gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: donaldDuckFirstMateI18n,
};
