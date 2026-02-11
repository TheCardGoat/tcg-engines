import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoFriendlyPooch: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "16c-1",
      text: "GOOD DOG {E} — You pay 1 {I} less for the next character you play this turn.",
      type: "activated",
    },
  ],
  cardNumber: 21,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "98a41ededf0b9cfe8fa7096aaf97b6290be8f370",
  },
  fullName: "Pluto - Friendly Pooch",
  id: "16c",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Pluto",
  set: "009",
  strength: 0,
  text: "GOOD DOG {E} — You pay 1 {I} less for the next character you play this turn.",
  version: "Friendly Pooch",
  willpower: 2,
};
