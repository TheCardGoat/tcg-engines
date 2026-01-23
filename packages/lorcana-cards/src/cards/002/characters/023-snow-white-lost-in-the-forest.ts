import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteLostInTheForest: CharacterCard = {
  id: "muw",
  cardType: "character",
  name: "Snow White",
  version: "Lost in the Forest",
  fullName: "Snow White - Lost in the Forest",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "I WON'T HURT YOU When you play this character, you may remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 23,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "52625a3814824139f2171b5ae5029653a9b48d92",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const snowWhiteLostInTheForest: LorcanitoCharacterCard = {
//   id: "h4k",
//   name: "Snow White",
//   title: "Lost in the Forest",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**I WON'T HURT YOU** When you play this character, you may remove up to 2 damage from chosen character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "I WON'T HURT YOU",
//       text: "When you play this character, you may remove up to 2 damage from chosen character.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Why, you're all alone, just like me.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "LadyShalirin",
//   number: 23,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527721,
//   },
//   rarity: "common",
// };
//
