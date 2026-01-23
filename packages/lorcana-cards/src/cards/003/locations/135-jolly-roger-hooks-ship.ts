import type { LocationCard } from "@tcg/lorcana-types";

export const jollyRogerHooksShip: LocationCard = {
  id: "f7n",
  cardType: "location",
  name: "Jolly Roger",
  version: "Hook's Ship",
  fullName: "Jolly Roger - Hook's Ship",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  text: "LOOK ALIVE, YOU SWABS! Characters gain Rush while here. (They can challenge the turn they're played.)\nALL HANDS ON DECK! Your Pirate characters may move here for free.",
  cost: 1,
  moveCost: 2,
  lore: 0,
  cardNumber: 135,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "36d37324c4f3d29d9f0101c7ee1a08bf9b00908e",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import {
//   gainAbilityWhileHere,
//   rushAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const jollyRogerHooksShip: LorcanitoLocationCard = {
//   id: "g68",
//   type: "location",
//   name: "Jolly Roger",
//   title: "Hook's Ship",
//   characteristics: ["location"],
//   text: "**LOOK ALIVE, YOU SWABS!** Characters gain **Rush** while here. _(They can challenge the turn they're played.)_\n\n\n**ALL HANDS ON DECK!** Your Pirate characters may move here for free.",
//   movementDiscounts: [
//     {
//       filters: [{ filter: "characteristics", value: ["pirate"] }],
//       amount: 0,
//     },
//   ],
//   abilities: [
//     gainAbilityWhileHere({
//       name: "LOOK ALIVE, YOU SWABS!",
//       text: "Characters gain **Rush** while here. _(They can challenge the turn they're played.)_",
//       ability: rushAbility,
//     }),
//     gainAbilityWhileHere({
//       name: "ALL HANDS ON DECK!",
//       text: "Your Pirate characters may move here for free.",
//       ability: {
//         type: "static",
//         ability: "effects",
//         effects: [
//           {
//             type: "attribute",
//             attribute: "moveCost",
//             amount: 0,
//             modifier: "add",
//             target: {
//               type: "card",
//               value: "all",
//               filters: [
//                 { filter: "source", value: "self" },
//                 { filter: "characteristics", value: ["pirate"] },
//               ],
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   colors: ["ruby"],
//   cost: 1,
//   willpower: 5,
//   lore: 0,
//   moveCost: 2,
//   illustrator: "Nicolas Ky",
//   number: 135,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538280,
//   },
//   rarity: "uncommon",
// };
//
