import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesDoubleDealer: CharacterCard = {
  id: "i41",
  cardType: "character",
  name: "Hades",
  version: "Double Dealer",
  fullName: "Hades - Double Dealer",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "HERE'S THE TRADE-OFF {E}, Banish one of your other characters — Play a character with the same name as the banished character for free.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 74,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "41475c2d6dbdfd43222184e0da43f5c1a3f810ab",
  },
  abilities: [
    {
      id: "i41-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "play-card",
        from: "hand",
        cardType: "character",
        cost: "free",
      },
      text: "HERE'S THE TRADE-OFF {E}, Banish one of your other characters — Play a character with the same name as the banished character for free.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
};
