import type { LocationCard } from "@tcg/lorcana-types";

export const theGreatIlluminaryRadiantBallroom: LocationCard = {
  id: "bsq",
  cardType: "location",
  name: "The Great Illuminary",
  version: "Radiant Ballroom",
  fullName: "The Great Illuminary - Radiant Ballroom",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "005",
  text: "WARM WELCOME Characters with Support get +1 {L} and +2 {W} while here.",
  cost: 3,
  moveCost: 2,
  lore: 0,
  cardNumber: 169,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2a85c33d948660b7c2e070d5eec49a5d5b4e5f30",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const theGreatIlluminaryRadiantBallroom: LorcanitoLocationCard = {
//   id: "wys",
//   name: "The Great Illuminary",
//   title: "Radiant Ballroom",
//   characteristics: ["location"],
//   text: "**WARM WELCOME** Characters with **Support** get +1 {L} and +2 {W} while here.",
//   type: "location",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Warm Welcome",
//       text: "Characters with **Support** get +1 {L} and +2 {W} while here.",
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           {
//             filter: "location",
//             value: "source",
//           },
//           { filter: "ability", value: "support" },
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//         ],
//       },
//       ability: {
//         type: "static",
//         ability: "effects",
//         effects: [
//           {
//             type: "attribute",
//             attribute: "willpower",
//             amount: 2,
//             modifier: "add",
//             duration: "static",
//             target: thisCharacter,
//           },
//           {
//             type: "attribute",
//             attribute: "lore",
//             amount: 1,
//             modifier: "add",
//             duration: "static",
//             target: thisCharacter,
//           },
//         ],
//       },
//     }),
//   ],
//   flavour: "Every surface glows with the joy of celebration.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   willpower: 9,
//   illustrator: "Carlos Ruiz",
//   number: 169,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555275,
//   },
//   rarity: "rare",
//   moveCost: 2,
// };
//
