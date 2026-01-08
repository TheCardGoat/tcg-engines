// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const atlanticaConcertHall: LorcanitoLocationCard = {
//   id: "xt0",
//   reprints: ["wzf"],
//   name: "Atlantica",
//   title: "Concert Hall",
//   characteristics: ["location"],
//   text: "**UNDERWATER ACOUSTICS** Characters count as having +2 cost to sing songs while here.",
//   type: "location",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Underwater Acoustics",
//       text: "Characters count as having +2 cost to sing songs while here.",
//       ability: {
//         type: "static",
//         ability: "effects",
//         name: "Underwater Acoustics",
//         text: "Characters count as having +2 cost to sing songs while here.",
//         effects: [
//           {
//             type: "attribute",
//             attribute: "singCost",
//             amount: 2,
//             modifier: "add",
//             target: thisCharacter,
//           },
//         ],
//       },
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   moveCost: 2,
//   willpower: 6,
//   illustrator: "Alex Shin",
//   number: 33,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549441,
//   },
//   rarity: "common",
// };
//
