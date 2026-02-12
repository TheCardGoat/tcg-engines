import type { CharacterCard } from "@tcg/lorcana-types";

export const tritonDiscerningKing: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 3,
        type: "gain-lore",
      },
      id: "rj9-1",
      text: "CONSIGN TO THE DEPTHS {E}, Banish one of your items — Gain 3 lore.",
      type: "activated",
    },
  ],
  cardNumber: 159,
  cardType: "character",
  classifications: ["Storyborn", "King"],
  cost: 3,
  externalIds: {
    ravensburger: "633d4a96c208e764155fc83b9f94d76fda5454b9",
  },
  franchise: "Little Mermaid",
  fullName: "Triton - Discerning King",
  id: "rj9",
  inkType: ["sapphire"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Triton",
  set: "004",
  strength: 3,
  text: "CONSIGN TO THE DEPTHS {E}, Banish one of your items — Gain 3 lore.",
  version: "Discerning King",
  willpower: 3,
};
