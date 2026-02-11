import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenJealousBeauty: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "any Princess cards were moved this way",
        },
        then: {
          type: "gain-lore",
          amount: 4,
        },
      },
      id: "ce7-1",
      text: "NO ORDINARY APPLE {E} — Choose 3 cards from chosen opponent's discard and put them on the bottom of their deck to gain 3 lore. If any Princess cards were moved this way, gain 4 lore instead.",
      type: "activated",
    },
  ],
  cardNumber: 74,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "2caba9821f2a147d04377683850773c4a50e222d",
  },
  franchise: "Snow White",
  fullName: "The Queen - Jealous Beauty",
  id: "ce7",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Queen",
  set: "007",
  strength: 4,
  text: "NO ORDINARY APPLE {E} — Choose 3 cards from chosen opponent's discard and put them on the bottom of their deck to gain 3 lore. If any Princess cards were moved this way, gain 4 lore instead.",
  version: "Jealous Beauty",
  willpower: 3,
};
