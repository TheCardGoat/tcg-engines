import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounBattletested: CharacterCard = {
  id: "1sj",
  cardType: "character",
  name: "Calhoun",
  version: "Battle-Tested",
  fullName: "Calhoun - Battle-Tested",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "TACTICAL ADVANTAGE When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 36,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e89d02771a72229278fa2e4100374bf2c2eb63e0",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   chosenOpposingCharacter,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const calhounBattletested: LorcanitoCharacterCard = {
//   id: "j0e",
//   name: "Calhoun",
//   title: "Battle-Tested",
//   characteristics: ["dreamborn", "hero", "racer"],
//   text: "TACTICAL ADVANTAGE When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThis({
//       name: "TACTICAL ADVANTAGE",
//       text: "When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.",
//       optional: true,
//       effects: [
//         {
//           type: "discard",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//             ],
//           },
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: thisCharacter,
//               effects: [
//                 {
//                   type: "attribute",
//                   attribute: "strength",
//                   amount: 3,
//                   modifier: "subtract",
//                   duration: "next_turn",
//                   until: true,
//                   target: chosenOpposingCharacter,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Alice Pisoni",
//   number: 36,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619427,
//   },
//   rarity: "super_rare",
//   lore: 1,
// };
//
