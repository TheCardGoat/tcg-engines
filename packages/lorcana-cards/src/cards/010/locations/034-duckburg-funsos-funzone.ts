import type { LocationCard } from "@tcg/lorcana-types";

export const duckburgFunsosFunzone: LocationCard = {
  id: "bzp",
  cardType: "location",
  name: "Duckburg",
  version: "Funso’s Funzone",
  fullName: "Duckburg - Funso’s Funzone",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "WHERE FUN IS IN THE ZONE Whenever a character quests while here, you pay 2 less for the next character you play this turn.",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 34,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2b3838583e2e8871ac10dd14e13f3835d7057408",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { wheneverACharacterQuestsWhileHere } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const duckburgFunsosFunzone: LorcanitoLocationCard = {
//   id: "r8g",
//   name: "Duckburg",
//   title: "Funsos Funzone",
//   characteristics: ["location"],
//   text: "WHERE FUN IS IN THE ZONE Whenever a character quests while here, you pay 2 less for the next character you play this turn.",
//   type: "location",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   willpower: 6,
//   illustrator: "Nevena Nikolcheva",
//   number: 34,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660034,
//   },
//   rarity: "rare",
//   abilities: [
//     wheneverACharacterQuestsWhileHere({
//       name: "WHERE FUN IS IN THE ZONE",
//       text: "Whenever a character quests while here, you pay 2 less for the next character you play this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "cost",
//           amount: 2,
//           modifier: "subtract",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//           duration: "turn",
//         },
//       ],
//     }),
//   ],
//   moveCost: 2,
//   lore: 0,
// };
//
