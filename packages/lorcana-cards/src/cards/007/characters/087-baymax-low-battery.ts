import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxLowBattery: CharacterCard = {
  id: "10p",
  cardType: "character",
  name: "Baymax",
  version: "Low Battery",
  fullName: "Baymax - Low Battery",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "007",
  text: "SHHHHH This character enters play exerted.",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 87,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8443d471af8ebbfb5a81734a59bca908a12fa53e",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Robot"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const baymaxLowBattery: LorcanitoCharacterCard = {
//   id: "cm2",
//   name: "Baymax",
//   title: "Low Battery",
//   characteristics: ["storyborn", "hero", "robot"],
//   text: "SHHHHH This character enters play exerted.",
//   type: "character",
//   abilities: [
//     entersPlayExerted({
//       name: "SHHHHH",
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   illustrator: "McKay Anderson",
//   number: 87,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619453,
//   },
//   rarity: "common",
//   lore: 2,
// };
//
