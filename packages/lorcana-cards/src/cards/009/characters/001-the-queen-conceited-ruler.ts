import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenConceitedRuler: CharacterCard = {
  id: "3l5",
  cardType: "character",
  name: "The Queen",
  version: "Conceited Ruler",
  fullName: "The Queen - Conceited Ruler",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "009",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 1,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0cede355df598a9f697223c219d919e3acdeee38",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const theQueenConceitedRuler: LorcanitoCharacterCard = {
//   id: "xvm",
//   name: "The Queen",
//   title: "Conceited Ruler",
//   characteristics: ["storyborn", "villain", "queen", "sorcerer"],
//   text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Eri Welli",
//   number: 1,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649950,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [
//     supportAbility,
//     atTheStartOfYourTurn({
//       name: "ROYAL SUMMONS",
//       text: "At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand",
//       optional: true,
//       effects: [
//         {
//           type: "discard",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "characteristics",
//                 value: ["princess", "queen"],
//                 conjunction: "or",
//               },
//             ],
//           },
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: thisCharacter,
//               effects: [
//                 {
//                   type: "move",
//                   to: "hand",
//                   target: {
//                     type: "card",
//                     value: 1,
//                     filters: [
//                       { filter: "owner", value: "self" },
//                       { filter: "type", value: "character" },
//                       { filter: "zone", value: "discard" },
//                     ],
//                   },
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     }),
//   ],
// };
//
