import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthClimbingClock: CharacterCard = {
  id: "1th",
  cardType: "character",
  name: "Cogsworth",
  version: "Climbing Clock",
  fullName: "Cogsworth - Climbing Clock",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "STILL USEFUL While you have an item card in your discard, this character gets +2 {S}.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 130,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ebfcd72de83d8a6b13d8d56f7b949f97ff029f88",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { haveItemInDiscard } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { AttributeEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const newVar: AttributeEffect = {
//   type: "attribute",
//   attribute: "strength",
//   amount: 2,
//   modifier: "add",
//   target: thisCharacter,
// };
// export const cogsworthClimbingClock: LorcanitoCharacterCard = {
//   id: "lwo",
//   name: "Cogsworth",
//   title: "Climbing Clock",
//   characteristics: ["storyborn", "ally"],
//   text: "STILL USEFUL While you have an item card in your discard, this character gets +2 {S}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "STILL USEFUL",
//       text: "While you have an item card in your discard, this character gets +2 {S}.",
//       conditions: [haveItemInDiscard],
//       effects: [newVar],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Tony Bancroft / Lindsay Weyman",
//   number: 130,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619477,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
