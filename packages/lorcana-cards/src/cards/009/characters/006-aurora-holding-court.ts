import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraHoldingCourt: CharacterCard = {
  id: "1dm",
  cardType: "character",
  name: "Aurora",
  version: "Holding Court",
  fullName: "Aurora - Holding Court",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 6,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b2e4454088493f11ad6048c6b396d2c646a96a35",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const auroraHoldingCourt: LorcanitoCharacterCard = {
//   id: "ahc",
//   name: "Aurora",
//   title: "Holding Court",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "",
//   number: 6,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649955,
//   },
//   rarity: "common",
//   lore: 1,
//   abilities: [
//     wheneverQuests({
//       name: "ROYAL WELCOME",
//       text: "Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "next",
//           amount: 1,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "type", value: "character" },
//               {
//                 filter: "characteristics",
//                 value: ["princess", "queen"],
//                 conjunction: "or",
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
