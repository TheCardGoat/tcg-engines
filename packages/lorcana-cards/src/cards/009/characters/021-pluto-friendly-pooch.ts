import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoFriendlyPooch: CharacterCard = {
  id: "16c",
  cardType: "character",
  name: "Pluto",
  version: "Friendly Pooch",
  fullName: "Pluto - Friendly Pooch",
  inkType: ["amber"],
  set: "009",
  text: "GOOD DOG {E} — You pay 1 {I} less for the next character you play this turn.",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  cardNumber: 21,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "98a41ededf0b9cfe8fa7096aaf97b6290be8f370",
  },
  abilities: [
    {
      id: "16c-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "GOOD DOG {E} — You pay 1 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
