import type { CharacterCard } from "@tcg/lorcana";

export const kronkUnlicensedInvestigator: CharacterCard = {
  id: "kit",
  cardType: "character",
  name: "Kronk",
  version: "Unlicensed Investigator",
  fullName: "Kronk - Unlicensed Investigator",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "Challenger +1 (While challenging, this character gets +1.)",
  cardNumber: "178",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "020df7caff144b7a745a51d6252d5a5861fb6489",
  },
  keywords: [
    {
      type: "Challenger",
      value: 1,
    },
  ],
  abilities: [
    {
      id: "kit-ability-1",
      text: "Challenger +1 (While challenging, this character gets +1.)",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
