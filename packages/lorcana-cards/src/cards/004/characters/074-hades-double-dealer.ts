import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesDoubleDealer: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "play-card",
        from: "hand",
        cardType: "character",
        cost: "free",
      },
      id: "i41-1",
      text: "HERE'S THE TRADE-OFF {E}, Banish one of your other characters — Play a character with the same name as the banished character for free.",
      type: "activated",
    },
  ],
  cardNumber: 74,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Deity"],
  cost: 4,
  externalIds: {
    ravensburger: "41475c2d6dbdfd43222184e0da43f5c1a3f810ab",
  },
  franchise: "Hercules",
  fullName: "Hades - Double Dealer",
  id: "i41",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Hades",
  set: "004",
  strength: 3,
  text: "HERE'S THE TRADE-OFF {E}, Banish one of your other characters — Play a character with the same name as the banished character for free.",
  version: "Double Dealer",
  willpower: 3,
};
