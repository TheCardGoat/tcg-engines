import type { CharacterCard } from "@tcg/lorcana-types";

export const gopherShipsCarpenter: CharacterCard = {
  id: "1ap",
  cardType: "character",
  name: "Gopher",
  version: "Ship's Carpenter",
  fullName: "Gopher - Ship's Carpenter",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 2,
  cardNumber: 4,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "a851a9e4b4f261f7072e46f7820adc3c20f1c6bc",
  },
  classifications: ["Storyborn", "Ally", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const gopherShipsCarpenter: LorcanitoCharacterCard = {
//   id: "jxg",
//   name: "Gopher",
//   title: "Ship's Carpenter",
//   characteristics: ["storyborn", "ally", "pirate"],
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 1,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Wouter Bruneel",
//   number: 4,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591986,
//   },
//   rarity: "uncommon",
// };
//
