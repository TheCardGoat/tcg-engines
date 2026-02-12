import type { CharacterCard } from "@tcg/lorcana-types";

export const kronkUnlicensedInvestigator: CharacterCard = {
  abilities: [
    {
      id: "kit-1",
      keyword: "Challenger",
      text: "Challenger +1",
      type: "keyword",
      value: 1,
    },
  ],
  cardNumber: 178,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "020df7caff144b7a745a51d6252d5a5861fb6489",
  },
  franchise: "Emperors New Groove",
  fullName: "Kronk - Unlicensed Investigator",
  id: "kit",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Kronk",
  set: "005",
  strength: 1,
  text: "Challenger +1 (While challenging, this character gets +1 {S}.)",
  version: "Unlicensed Investigator",
  willpower: 4,
};
