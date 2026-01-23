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

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const donaldDuckStruttingHisStuff: LorcanitoCharacterCard = {
//   id: "dnp",
//
//   name: "Donald Duck",
//   title: "Strutting His Stuff",
//   characteristics: ["hero", "dreamborn", "inventor"],
//   text: "**Ward** (Opponents can't choose this character except to challenge.)",
//   type: "character",
//   abilities: [wardAbility],
//   flavour: "Walk smarter, not harder.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 4,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Cam Kendell",
//   number: 144,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 503358,
//   },
//   rarity: "common",
// };
//
