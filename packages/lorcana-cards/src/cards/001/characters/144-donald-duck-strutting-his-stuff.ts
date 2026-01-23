import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckStruttingHisStuff: CharacterCard = {
  id: "10b",
  cardType: "character",
  name: "Donald Duck",
  version: "Strutting His Stuff",
  fullName: "Donald Duck - Strutting His Stuff",
  inkType: ["sapphire"],
  set: "001",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 144,
  inkable: true,
  externalIds: {
    ravensburger: "827efa2d86fedbf475bd6d3956aa3b8d96bb21fc",
  },
  abilities: [
    {
      id: "10b-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Inventor"],
};
