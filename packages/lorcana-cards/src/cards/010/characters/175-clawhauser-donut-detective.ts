import type { CharacterCard } from "@tcg/lorcana";

export const clawhauserDonutDetective: CharacterCard = {
  id: "1ur",
  cardType: "character",
  name: "Clawhauser",
  version: "Donut Detective",
  fullName: "Clawhauser - Donut Detective",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "Challenger +2 (When he challenges, this character gets +2 {S}.)",
  cardNumber: "175",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "f09761a7261a822638183f5db78126e9763e9313",
  },
  keywords: [
    {
      type: "Challenger",
      value: 2,
    },
  ],
  abilities: [
    {
      id: "1ura1",
      text: "Challenger +2",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
  ],
  classifications: ["Dreamborn", "Ally", "Detective"],
};
