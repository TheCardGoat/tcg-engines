import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonSchemingSuitor: CharacterCard = {
  id: "1xf",
  cardType: "character",
  name: "Gaston",
  version: "Scheming Suitor",
  fullName: "Gaston - Scheming Suitor",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "YES, I'M INTIMIDATING While one or more opponents have no cards in their hands, this character gets +3 {S}.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 83,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fa46cb5d8c91e28cee54f0e6fc320dba20035c8e",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const gastonSchemingSuitor: LorcanitoCharacterCard = {
//   id: "eck",
//   name: "Gaston",
//   title: "Scheming Suitor",
//   characteristics: ["storyborn", "villain"],
//   text: "**YES, I'M INTIMIDATING** While one or more opponents have no cards in their hands, this character gets +3 {S}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "Yes, I'm Intimidating",
//       text: "While one or more opponents have no cards in their hands, this character gets +3 {S}.",
//       conditions: [{ type: "hand", amount: 0, player: "opponent" }],
//       attribute: "strength",
//       amount: 3,
//     }),
//   ],
//   flavour: '"Don\'t I deserve the best?"',
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Valerio Buonfantino",
//   number: 83,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527746,
//   },
//   rarity: "common",
// };
//
