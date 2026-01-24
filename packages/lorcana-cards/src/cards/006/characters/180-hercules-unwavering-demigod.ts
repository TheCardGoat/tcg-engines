import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesUnwaveringDemigod: CharacterCard = {
  id: "1n8",
  cardType: "character",
  name: "Hercules",
  version: "Unwavering Demigod",
  fullName: "Hercules - Unwavering Demigod",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "006",
  text: "Challenger +2 (While challenging, this character gets +2 {S}).",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 180,
  inkable: true,
  externalIds: {
    ravensburger: "d57ba4914c87d36251c93894e3081d6552322ca0",
  },
  abilities: [
    {
      id: "1n8-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      condition: ".",
      text: "Challenger +2.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
