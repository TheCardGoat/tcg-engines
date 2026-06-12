import type { CharacterCard } from "@tcg/lorcana-types";
import { bashfulHopelessRomanticI18n } from "./001-bashful-hopeless-romantic.i18n";

export const bashfulHopelessRomantic: CharacterCard = {
  id: "0Tb",
  canonicalId: "ci_0Tb",
  reprints: ["set2-001"],
  cardType: "character",
  name: "Bashful",
  version: "Hopeless Romantic",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 1,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_ac175f73ee3c4cce86c8ffe6d32db73a",
    tcgPlayer: 526599,
  },
  text: [
    {
      title: "OH, GOSH!",
      description:
        "This character can't quest unless you have another Seven Dwarfs character in play.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      condition: {
        type: "not",
        condition: {
          type: "has-character-count",
          classification: "Seven Dwarfs",
          comparison: "greater-or-equal",
          controller: "you",
          count: 2,
        },
      },
      effect: {
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      id: "1ff-1",
      name: "OH, GOSH!",
      text: "OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.",
      type: "static",
    },
  ],
  i18n: bashfulHopelessRomanticI18n,
};
