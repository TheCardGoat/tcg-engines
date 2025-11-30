import type { CharacterCard } from "@tcg/lorcana";

export const herculesUnwaveringDemigod: CharacterCard = {
  id: "1n8",
  cardType: "character",
  name: "Hercules",
  version: "Unwavering Demigod",
  fullName: "Hercules - Unwavering Demigod",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "006",
  text: "Challenger +2 (While challenging, this character gets +2.)",
  cardNumber: "180",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "d57ba4914c87d36251c93894e3081d6552322ca0",
  },
  keywords: [
    {
      type: "Challenger",
      value: 2,
    },
  ],
  abilities: [
    {
      id: "1n8-ability-1",
      text: "Challenger +2 (While challenging, this character gets +2.)",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
