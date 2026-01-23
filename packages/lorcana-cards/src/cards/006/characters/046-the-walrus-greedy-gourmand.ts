import type { CharacterCard } from "@tcg/lorcana-types";

export const theWalrusGreedyGourmand: CharacterCard = {
  id: "1f1",
  cardType: "character",
  name: "The Walrus",
  version: "Greedy Gourmand",
  fullName: "The Walrus - Greedy Gourmand",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  cardNumber: 46,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "ba9ac6e859a51a7ec08b3842d1149e26439c52b5",
  },
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const theWalrusGreedyGourmand: LorcanitoCharacterCard = {
//   id: "dh1",
//   name: "The Walrus",
//   title: "Greedy Gourmand",
//   characteristics: ["storyborn"],
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Carlos Luzzi",
//   number: 46,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588074,
//   },
//   rarity: "uncommon",
// };
//
