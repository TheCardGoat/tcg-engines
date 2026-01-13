import type { CharacterCard } from "@tcg/lorcana-types";

export const liShangNewlyPromoted: CharacterCard = {
  id: "1s1",
  cardType: "character",
  name: "Li Shang",
  version: "Newly Promoted",
  fullName: "Li Shang - Newly Promoted",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "007",
  text: "I WON'T LET YOU DOWN This character can challenge ready characters.\nBIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 133,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e8958ebe93bfe67555697e9e3d0477d5a9e145ad",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { challengeReadyCharacters } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileThisCharacterHasDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const liShangNewlyPromoted: LorcanitoCharacterCard = {
//   id: "scu",
//   name: "Li Shang",
//   title: "Newly Promoted",
//   characteristics: ["storyborn", "hero", "captain"],
//   text: "I WON'T LET YOU DOWN This character can challenge ready characters.\nBIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.",
//   type: "character",
//   abilities: [
//     {
//       ...challengeReadyCharacters,
//       name: "I WON'T LET YOU DOWN",
//       text: "This character can challenge ready characters.",
//     },
//     whileThisCharacterHasDamageGets({
//       name: "BIG RESPONSIBILITY",
//       text: "While this character is damaged, he gets +2 {S}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["ruby", "steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Ian MacDonald",
//   number: 133,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619479,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
