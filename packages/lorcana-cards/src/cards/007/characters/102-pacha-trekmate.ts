import type { CharacterCard } from "@tcg/lorcana-types";

export const pachaTrekmate: CharacterCard = {
  id: "19c",
  cardType: "character",
  name: "Pacha",
  version: "Trekmate",
  fullName: "Pacha - Trekmate",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "FULL PACK While you have more cards in your hand than each opponent, this character gets +2 {L}.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 102,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a375827e674b232f0d824d876ebddaaa0e37b54c",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { haveMoreCardsThanOpponent } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { AttributeEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const newVar: AttributeEffect = {
//   type: "attribute",
//   attribute: "lore",
//   amount: 2,
//   modifier: "add",
//   target: {
//     type: "card",
//     value: "all",
//     filters: [{ filter: "source", value: "self" }],
//   },
// };
//
// export const pachaTrekmate: LorcanitoCharacterCard = {
//   id: "nu8",
//   name: "Pacha",
//   title: "Trekmate",
//   characteristics: ["storyborn", "hero"],
//   text: "FULL PACK While you have more cards in hand than each opponent, this character gets +2 {L}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "FULL PACK",
//       text: "While you have more cards in hand than each opponent, this character gets +2 {L}.",
//       conditions: [haveMoreCardsThanOpponent],
//       effects: [newVar],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Luca Pirelli",
//   number: 102,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619460,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
