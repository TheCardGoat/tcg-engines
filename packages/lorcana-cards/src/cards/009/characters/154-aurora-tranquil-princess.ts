import type { CharacterCard } from "@tcg/lorcana";

export const auroraTranquilPrincess: CharacterCard = {
  id: "1sr",
  cardType: "character",
  name: "Aurora",
  version: "Tranquil Princess",
  fullName: "Aurora - Tranquil Princess",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 154,
  inkable: true,
  externalIds: {
    ravensburger: "067bc768bc6b0221356cb0b7535f6bf9fced1949",
  },
  keywords: ["Ward"],
  abilities: [
    {
      id: "1sr-1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
