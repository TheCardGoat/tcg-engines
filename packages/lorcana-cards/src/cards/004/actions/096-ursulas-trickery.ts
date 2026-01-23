import type { ActionCard } from "@tcg/lorcana-types";

export const ursulasTrickery: ActionCard = {
  id: "1sb",
  cardType: "action",
  name: "Ursula’s Trickery",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
  cost: 1,
  cardNumber: 96,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e8e8b6146e68fc314030023117c7ad8ef501a416",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   opponent,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   discardACard,
//   drawXCards,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ursulasTrickery: LorcanitoActionCard = {
//   id: "fr4",
//   missingTestCase: true,
//   name: "Ursula's Trickery",
//   characteristics: ["action"],
//   text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       responder: "opponent",
//       effects: [
//         {
//           type: "modal",
//           // TODO: Get rid of target
//           target: chosenCharacter,
//           modes: [
//             {
//               id: "1",
//               text: "Discard a Card.",
//               responder: "opponent",
//               effects: [discardACard],
//             },
//             {
//               id: "2",
//               text: "Opponent Draws a Card.",
//               responder: "opponent",
//               effects: [drawXCards(1, opponent)],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   flavour:
//     "How dare you double-cross me! Ursula shouted, lunging at the other glimmer.",
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Matthew Robert Davies",
//   number: 96,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550586,
//   },
//   rarity: "uncommon",
// };
//
