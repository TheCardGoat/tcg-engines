import type { CharacterCard } from "@tcg/lorcana-types";

export const captainColonelsLieutenant: CharacterCard = {
  id: "1td",
  cardType: "character",
  name: "Captain",
  version: "Colonel’s Lieutenant",
  fullName: "Captain - Colonel’s Lieutenant",
  inkType: ["ruby"],
  franchise: "101 Dalmatians",
  set: "001",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  cardNumber: 106,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "eafca24c7fb2c28dda69901ad895c27fc0183bfc",
  },
  classifications: ["Storyborn", "Ally", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const captainColonelsLieutenant: LorcanitoCharacterCard = {
//   id: "t2f",
//   name: "Captain",
//   title: "Colonel's Lieutenant",
//   characteristics: ["storyborn", "captain", "ally"],
//   type: "character",
//   flavour: "Barking signal. It's an alert. Report to the Colonel at once!",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 6,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Brian Weisz",
//   number: 106,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508779,
//   },
//   rarity: "uncommon",
// };
//
