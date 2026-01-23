import type { ActionCard } from "@tcg/lorcana-types";

export const signTheScroll: ActionCard = {
  id: "ggh",
  cardType: "action",
  name: "Sign the Scroll",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Each opponent may choose and discard a card. For each opponent who doesn't, you gain 2 lore.",
  cost: 3,
  cardNumber: 30,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3b50bdfe85abebdd4bce7a6a74f0c24ee3a3d869",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoActionCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   opponent,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// const abilitySignTheScroll: ResolutionAbility = {
//   type: "resolution",
//   text: "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
//   responder: "opponent",
//   effects: [
//     {
//       type: "modal",
//       // TODO: Get rid of target
//       target: chosenCharacter,
//       modes: [
//         {
//           id: "1",
//           text: "Discard a card",
//           effects: [
//             {
//               type: "discard",
//               amount: 1,
//               target: {
//                 type: "card",
//                 value: 1,
//                 filters: [
//                   { filter: "zone", value: "hand" },
//                   { filter: "owner", value: "self" },
//                 ],
//               },
//             },
//           ],
//         },
//         {
//           id: "2",
//           text: "Opponent Gain 2 Lore",
//           effects: [
//             {
//               type: "lore",
//               amount: 2,
//               modifier: "add",
//               target: opponent,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
// export const signTheScroll: LorcanitoActionCard = {
//   id: "x7p",
//   missingTestCase: true,
//   name: "Sign The Scroll",
//   characteristics: ["action"],
//   text: "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
//   type: "action",
//   abilities: [abilitySignTheScroll],
//   colors: ["amber"],
//   cost: 3,
//   illustrator: "Mariana Moreno Ayala",
//   number: 30,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547681,
//   },
//   rarity: "uncommon",
// };
//
