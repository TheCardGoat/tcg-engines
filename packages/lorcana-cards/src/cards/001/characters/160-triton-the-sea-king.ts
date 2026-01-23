import type { CharacterCard } from "@tcg/lorcana-types";

export const tritonTheSeaKing: CharacterCard = {
  id: "1cv",
  cardType: "character",
  name: "Triton",
  version: "The Sea King",
  fullName: "Triton - The Sea King",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "001",
  cost: 7,
  strength: 5,
  willpower: 9,
  lore: 2,
  cardNumber: 160,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "b02a117d318568eba0e9424b437a3c859e60618a",
  },
  classifications: ["Storyborn", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const tritonTheSeaKing: LorcanitoCharacterCard = {
//   id: "boi",
//
//   name: "Triton",
//   title: "The Sea King",
//   characteristics: ["storyborn", "king"],
//   type: "character",
//   flavour: "Isn't ‘Because I said so’ enough of a reason?",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 7,
//   strength: 5,
//   willpower: 9,
//   lore: 2,
//   illustrator: "Cristian Romero",
//   number: 160,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506023,
//   },
//   rarity: "uncommon",
// };
//
