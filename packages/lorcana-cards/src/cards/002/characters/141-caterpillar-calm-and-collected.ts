import type { CharacterCard } from "@tcg/lorcana-types";

export const caterpillarCalmAndCollected: CharacterCard = {
  id: "1e4",
  cardType: "character",
  name: "Caterpillar",
  version: "Calm and Collected",
  fullName: "Caterpillar - Calm and Collected",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "002",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 3,
  cardNumber: 141,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "05117f1bf13d4fb9861daaa0459dfe4a2b7ed70e",
  },
  classifications: ["Dreamborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const caterpillarCalmAndCollected: LorcanitoCharacterCard = {
//   id: "uaw",
//
//   name: "Caterpillar",
//   title: "Calm and Collected",
//   characteristics: ["dreamborn"],
//   type: "character",
//   flavour: "Keep your tempo.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   lore: 3,
//   illustrator: "Cory Godbey",
//   number: 141,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527762,
//   },
//   rarity: "uncommon",
// };
//
