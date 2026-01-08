import type { LocationCard } from "@tcg/lorcana-types";

export const rapunzelsTowerSecludedPrison: LocationCard = {
  id: "vng",
  cardType: "location",
  name: "Rapunzel's Tower",
  version: "Secluded Prison",
  fullName: "Rapunzel's Tower - Secluded Prison",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "005",
  text: "SAFE AND SOUND Characters get +3 {W} while here.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 33,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "721302a46297cf79785076ab9ef5df9ac536389d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const rapunzelsTowerSecludedPrison: LorcanitoLocationCard = {
//   id: "nva",
//   missingTestCase: true,
//   name: "Rapunzel's Tower",
//   title: "Secluded Prison",
//   characteristics: ["location"],
//   text: "**SAFE AND SOUND** Characters get +3 {W} while here.",
//   type: "location",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Safe and Sound",
//       text: "Characters get +3 {W} while here.",
//       ability: {
//         type: "static",
//         ability: "effects",
//         effects: [
//           {
//             type: "attribute",
//             attribute: "willpower",
//             amount: 3,
//             modifier: "add",
//             duration: "static",
//             target: thisCharacter,
//           },
//         ],
//       },
//     }),
//   ],
//   flavour: "It's a scary world out there.\n—Mother Gothel",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   willpower: 8,
//   lore: 0,
//   illustrator: "Jeremy Adams",
//   number: 33,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560916,
//   },
//   rarity: "uncommon",
//   moveCost: 1,
// };
//
