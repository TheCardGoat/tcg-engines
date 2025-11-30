import type { CharacterCard } from "@tcg/lorcana";

export const donaldDuckStruttingHisStuff: CharacterCard = {
  id: "10b",
  cardType: "character",
  name: "Donald Duck",
  version: "Strutting His Stuff",
  fullName: "Donald Duck - Strutting His Stuff",
  inkType: ["sapphire"],
  set: "001",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cardNumber: "144",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "827efa2d86fedbf475bd6d3956aa3b8d96bb21fc",
  },
  keywords: ["Ward"],
  abilities: [
    {
      id: "10b-ability-1",
      text: "Ward (Opponents can't choose this character except to challenge.)",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Inventor"],
};
