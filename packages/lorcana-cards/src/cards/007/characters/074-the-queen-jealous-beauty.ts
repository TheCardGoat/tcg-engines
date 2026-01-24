import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenJealousBeauty: CharacterCard = {
  id: "ce7",
  cardType: "character",
  name: "The Queen",
  version: "Jealous Beauty",
  fullName: "The Queen - Jealous Beauty",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "007",
  text: "NO ORDINARY APPLE {E} — Choose 3 cards from chosen opponent's discard and put them on the bottom of their deck to gain 3 lore. If any Princess cards were moved this way, gain 4 lore instead.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 74,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2caba9821f2a147d04377683850773c4a50e222d",
  },
  abilities: [
    {
      id: "ce7-1",
      type: "activated",
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
      text: "NO ORDINARY APPLE {E} — Choose 3 cards from chosen opponent's discard and put them on the bottom of their deck to gain 3 lore. If any Princess cards were moved this way, gain 4 lore instead.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
};
