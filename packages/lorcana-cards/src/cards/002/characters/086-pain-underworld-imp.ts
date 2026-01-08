import type { CharacterCard } from "@tcg/lorcana-types";

export const painUnderworldImp: CharacterCard = {
  id: "8up",
  cardType: "character",
  name: "Pain",
  version: "Underworld Imp",
  fullName: "Pain - Underworld Imp",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "002",
  text: "COMING, YOUR MOST LUGUBRIOUSNESS While this character has 5 {S} or more, he gets +2 {L}.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 86,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1fe8193faae4a3e917c75b66570a89630455f0c7",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const painUnderworldImp: LorcanitoCharacterCard = {
//   id: "hrt",
//   name: "Pain",
//   title: "Underworld Imp",
//   characteristics: ["storyborn", "ally"],
//   text: "**COMING, YOUR MOST LUGUBRIOUSNESS** While this character has 5 {S} or more, he gets + 2 {L}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "Coming, Your Most Lugubriousness",
//       text: "While this character has 5 {S} or more, he gets + 2 {L}.",
//       attribute: "lore",
//       amount: 2,
//       conditions: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           comparison: { operator: "gte", value: 5 },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     '"Get a move on! I\'m a busy god, lots to do−meetings, curses, a little light scheming." \\n−Hades',
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Kristina Chouri / Mariana Moreno",
//   number: 86,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527748,
//   },
//   rarity: "uncommon",
// };
//
