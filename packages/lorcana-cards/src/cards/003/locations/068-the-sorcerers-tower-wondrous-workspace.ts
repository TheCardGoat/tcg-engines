import type { LocationCard } from "@tcg/lorcana-types";

export const theSorcerersTowerWondrousWorkspace: LocationCard = {
  id: "1ne",
  cardType: "location",
  name: "The Sorcerer's Tower",
  version: "Wondrous Workspace",
  fullName: "The Sorcerer's Tower - Wondrous Workspace",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  text: "BROOM CLOSET Your characters named Magic Broom may move here for free.\nMAGICAL POWER Characters get +1 {L} while here.",
  cost: 3,
  moveCost: 2,
  lore: 0,
  cardNumber: 68,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d54dd1bcc51723c954c04a6587a405b569bcc0c9",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const theSorcerersTowerWondrousWorkspace: LorcanitoLocationCard = {
//   id: "sen",
//   type: "location",
//   missingTestCase: true,
//   name: "The Sorcerer's Tower",
//   title: "Wondrous Workspace",
//   characteristics: ["location"],
//   text: "**BROOM CLOSET** Your characters named Magic Broom may move here for free.\n\n\n**MAGICAL POWER** Characters get +1 {L} while here.",
//   abilities: [
//     // {
//     //   name: "**BROOM CLOSET** Your characters named Magic Broom may move here for free.\n\n\n",
//     // },
//     gainAbilityWhileHere({
//       name: "Magical Power",
//       text: "Characters get +1 {L} while here.",
//       ability: {
//         type: "static",
//         ability: "effects",
//         effects: [
//           {
//             type: "attribute",
//             attribute: "lore",
//             amount: 1,
//             modifier: "add",
//             duration: "static",
//             target: {
//               type: "card",
//               value: "all",
//               filters: [{ filter: "source", value: "self" }],
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   flavour: "Everything you need to make some magic.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   willpower: 7,
//   lore: 0,
//   moveCost: 2,
//   movementDiscounts: [
//     {
//       filters: [
//         {
//           filter: "attribute",
//           value: "name",
//           comparison: { operator: "eq", value: "Magic Broom" },
//         },
//       ],
//       amount: 0,
//     },
//   ],
//   illustrator: "Wietse Treurniet",
//   number: 68,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 535148,
//   },
//   rarity: "uncommon",
// };
//
