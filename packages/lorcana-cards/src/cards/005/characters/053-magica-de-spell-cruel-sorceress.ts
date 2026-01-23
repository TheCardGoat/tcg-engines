import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellCruelSorceress: CharacterCard = {
  id: "z76",
  cardType: "character",
  name: "Magica De Spell",
  version: "Cruel Sorceress",
  fullName: "Magica De Spell - Cruel Sorceress",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "005",
  text: "PLAYING WITH POWER During opponents' turns, if an effect would cause you to discard one or more cards from your hand, you don't discard.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 53,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7edcac0597ed1f8c60c37804180011de044631fa",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const magicaDeSpellCruelSorceress: LorcanitoCharacterCard = {
//   id: "how",
//   name: "Magica De Spell",
//   title: "Cruel Sorceress",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**PLAYING WITH POWER** During opponents’ turns, if an effect would cause you to discard one or more cards from your hand, you don’t discard.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "meta",
//       name: "PLAYING WITH POWER",
//       text: "During opponents’ turns, if an effect would cause you to discard one or more cards from your hand, you don’t discard.",
//       conditions: [
//         {
//           type: "during-turn",
//           value: "opponent",
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Stefano Spagnuolo",
//   number: 53,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560549,
//   },
//   rarity: "rare",
// };
//
