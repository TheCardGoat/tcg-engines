import type { CharacterCard } from "@tcg/lorcana-types";

export const bashfulHopelessRomantic: CharacterCard = {
  id: "1ff",
  cardType: "character",
  name: "Bashful",
  version: "Hopeless Romantic",
  fullName: "Bashful - Hopeless Romantic",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 3,
  cardNumber: 1,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b95e7b9108cbc2a1fc2700fda19b86520ee93c3e",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import type { RestrictionStaticAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// const newVar: RestrictionStaticAbility = {
//   type: "static",
//   ability: "restriction",
//   effect: {
//     type: "restriction",
//     restriction: "quest",
//     // TODO: Static should not have duration, they're valid as long as the source is in play
//     duration: "turn",
//     target: thisCharacter,
//   },
//   target: thisCharacter,
//   conditions: [
//     {
//       type: "filter",
//       comparison: {
//         operator: "lte",
//         value: 1,
//       },
//       filters: [
//         { filter: "characteristics", value: ["seven dwarfs"] },
//         { filter: "type", value: "character" },
//         { filter: "zone", value: "play" },
//         { filter: "owner", value: "self" },
//       ],
//     },
//   ],
// };
//
// export const bashfulHopelessRomantic: LorcanitoCharacterCard = {
//   id: "iu7",
//   name: "Bashful",
//   title: "Hopeless Romantic",
//   characteristics: ["storyborn", "ally", "seven dwarfs"],
//   text: "**OH, GOSH** This character can't quest unless you have another Seven Dwarfs character in play.",
//   type: "character",
//   abilities: [newVar],
//   flavour: "Life is sweeter with friends.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   lore: 3,
//   illustrator: "Kendall Hale",
//   number: 1,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526599,
//   },
//   rarity: "uncommon",
// };
//
