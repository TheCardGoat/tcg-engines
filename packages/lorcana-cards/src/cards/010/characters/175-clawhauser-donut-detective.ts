import type { CharacterCard } from "@tcg/lorcana-types";

export const clawhauserDonutDetective: CharacterCard = {
  id: "1ur",
  cardType: "character",
  name: "Clawhauser",
  version: "Donut Detective",
  fullName: "Clawhauser - Donut Detective",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 175,
  inkable: true,
  externalIds: {
    ravensburger: "f09761a7261a822638183f5db78126e9763e9313",
  },
  abilities: [
    {
      id: "1ur-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
  ],
  classifications: ["Dreamborn", "Ally", "Detective"],
};
