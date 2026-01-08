import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnSirReginald: CharacterCard = {
  id: "1mt",
  cardType: "character",
  name: "Little John",
  version: "Sir Reginald",
  fullName: "Little John - Sir Reginald",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "009",
  text: "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:\n- Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\n- Deal 2 damage to chosen Villain character.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 176,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d409daa7c57554709734ba935a4ef64ae6db2b51",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { targetCardGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const littleJohnSirReginald: LorcanitoCharacterCard = {
//   id: "kkx",
//   name: "Little John",
//   title: "Sir Reginald",
//   characteristics: ["storyborn", "ally"],
//   text: "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:\n- Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\n- Deal 2 damage to chosen Villain character.",
//   type: "character",
//   inkwell: false,
//   colors: ["steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Cristian Romero",
//   number: 176,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650109,
//   },
//   rarity: "uncommon",
//   abilities: [
//     whenYouPlayThisCharacter({
//       effects: [
//         {
//           type: "modal",
//           // TODO: Get rid of target
//           target: chosenCharacter,
//           modes: [
//             {
//               id: "1",
//               text: "Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
//               effects: [
//                 targetCardGainsResist({
//                   target: {
//                     type: "card",
//                     value: 1,
//                     filters: [
//                       { filter: "zone", value: "play" },
//                       { filter: "characteristics", value: ["hero"] },
//                     ],
//                   },
//                   amount: 2,
//                   duration: "turn",
//                 }),
//               ],
//             },
//             {
//               id: "2",
//               text: "Deal 2 damage to chosen Villain character.",
//               effects: [
//                 {
//                   type: "damage",
//                   amount: 2,
//                   target: {
//                     type: "card",
//                     value: 1,
//                     filters: [
//                       { filter: "zone", value: "play" },
//                       { filter: "characteristics", value: ["villain"] },
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
//   lore: 1,
// };
//
