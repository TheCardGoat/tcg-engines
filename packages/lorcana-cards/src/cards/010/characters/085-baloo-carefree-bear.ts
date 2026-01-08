import type { CharacterCard } from "@tcg/lorcana-types";

export const balooCarefreeBear: CharacterCard = {
  id: "1vf",
  cardType: "character",
  name: "Baloo",
  version: "Carefree Bear",
  fullName: "Baloo - Carefree Bear",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Baloo.)\nROLL WITH IT When you play this character, choose one:\n- Each player draws a card.\n- Each player chooses and discards a card.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 85,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f304562c399fc869cd5b049872d5cbb222aac97d",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import {
//   discardACard,
//   drawXCards,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const balooCarefreeBear: LorcanitoCharacterCard = {
//   id: "aoe",
//   name: "Baloo",
//   title: "Carefree Bear",
//   characteristics: ["floodborn", "ally"],
//   text: "Shift 3\n\nROLL WITH IT When you play this character, choose one: • Each player draws a card. • Each player chooses and discards a card.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   illustrator: "Luis Huerta",
//   number: 85,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658345,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     shiftAbility(3, "Baloo"),
//     whenYouPlayThisCharacter({
//       name: "ROLL WITH IT",
//       text: "When you play this character, choose one: • Each player draws a card. • Each player chooses and discards a card.",
//       effects: [
//         {
//           type: "modal",
//           // TODO: Get rid of target
//           target: chosenCharacter,
//           modes: [
//             {
//               id: "1",
//               text: "Each player draws a card.",
//               effects: [drawXCards(1, self), drawXCards(1, opponent)],
//             },
//             {
//               id: "2",
//               text: "Each player chooses and discards a card.",
//               effects: [
//                 {
//                   type: "create-layer-for-player",
//                   target: opponent,
//                   layer: {
//                     type: "resolution",
//                     responder: "opponent",
//                     name: "ROLL WITH IT",
//                     text: "Each player chooses and discards a card.",
//                     effects: [discardACard],
//                   },
//                 },
//                 {
//                   type: "create-layer-for-player",
//                   target: self,
//                   layer: {
//                     type: "resolution",
//                     name: "ROLL WITH IT",
//                     text: "Each player chooses and discards a card.",
//                     effects: [discardACard],
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
