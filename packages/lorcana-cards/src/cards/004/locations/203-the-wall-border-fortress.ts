import type { LocationCard } from "@tcg/lorcana-types";

export const theWallBorderFortress: LocationCard = {
  id: "1rp",
  cardType: "location",
  name: "The Wall",
  version: "Border Fortress",
  fullName: "The Wall - Border Fortress",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "PROTECT THE REALM While you have an exerted character here, your other locations can't be challenged.",
  cost: 4,
  moveCost: 2,
  lore: 0,
  cardNumber: 203,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e5952f14f0c762b6186776b684752cbc36e40ac8",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { yourOtherLocations } from "@lorcanito/lorcana-engine/abilities/target";
// import { thisLocation } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const theWallBorderFortress: LorcanitoLocationCard = {
//   id: "w4d",
//   name: "The Wall",
//   title: "Border Fortress",
//   characteristics: ["location"],
//   text: "**PROTECT THE REALM** While you have an exerted character here, your other locations can't be challenged.",
//   type: "location",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Protect the Realm",
//       text: "While you have an exerted character here, your other locations can't be challenged.",
//       conditions: [
//         {
//           type: "chars-at-location",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             {
//               filter: "status",
//               value: "exerted",
//             },
//           ],
//         },
//       ],
//       target: yourOtherLocations,
//       gainedAbility: {
//         type: "static",
//         ability: "effects",
//         name: "Protect the Realm",
//         text: "While you have an exerted character here, your other locations can't be challenged.",
//         effects: [
//           {
//             type: "restriction",
//             restriction: "be-challenged",
//             target: thisLocation,
//           },
//         ],
//       },
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   moveCost: 2,
//   willpower: 8,
//   illustrator: "Jimmy Lo",
//   number: 203,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548192,
//   },
//   rarity: "rare",
// };
//
