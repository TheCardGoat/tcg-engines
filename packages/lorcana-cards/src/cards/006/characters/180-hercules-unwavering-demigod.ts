import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesUnwaveringDemigod: CharacterCard = {
  abilities: [
    {
      id: "1n8-1",
      keyword: "Challenger",
      text: "Challenger +2.",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 180,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "d57ba4914c87d36251c93894e3081d6552322ca0",
  },
  franchise: "Hercules",
  fullName: "Hercules - Unwavering Demigod",
  id: "1n8",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Hercules",
  set: "006",
  strength: 2,
  text: "Challenger +2 (While challenging, this character gets +2 {S}).",
  version: "Unwavering Demigod",
  willpower: 4,
};
