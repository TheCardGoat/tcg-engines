import type { LocationCard } from "@tcg/lorcana-types";

export const ratigansPartySeedyBackRoom: LocationCard = {
  id: "1nd",
  cardType: "location",
  name: "Ratigan's Party",
  version: "Seedy Back Room",
  fullName: "Ratigan's Party - Seedy Back Room",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "MISFITS' REVELRY While you have a damaged character here, this location gets +2 {L}.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 136,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d7c49b894c3a37882bbb3d7e033724e8e84eb280",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const ratigansPartySeedyBackRoom: LorcanitoLocationCard = {
//   id: "dq2",
//   missingTestCase: true,
//   name: "Ratigan's Party",
//   title: "Seedy Back Room",
//   characteristics: ["location"],
//   text: "**MISFITS’ REVELRY** While you have a damaged character here, this location gets +2 {L}.",
//   type: "location",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "Misfits’ Revelry",
//       text: "While you have a damaged character here, this location gets +2 {L}.",
//       attribute: "lore",
//       amount: 2,
//       conditions: [
//         {
//           type: "chars-at-location",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             {
//               filter: "status",
//               value: "damage",
//               comparison: { operator: "gte", value: 1 },
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   willpower: 7,
//   illustrator: "Jeremy Adams",
//   number: 136,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561470,
//   },
//   rarity: "uncommon",
//   moveCost: 1,
// };
//
