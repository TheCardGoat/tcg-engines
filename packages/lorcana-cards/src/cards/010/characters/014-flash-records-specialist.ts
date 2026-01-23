import type { CharacterCard } from "@tcg/lorcana-types";

export const flashRecordsSpecialist: CharacterCard = {
  id: "1ds",
  cardType: "character",
  name: "Flash",
  version: "Records Specialist",
  fullName: "Flash - Records Specialist",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "010",
  text: "HOLD... YOUR HORSES This character enters play exerted.\nDEEP RESEARCH Whenever this character quests, you may give chosen Detective character +2 {S} this turn.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 14,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b370498df5e21a7fdb83d831c668be4e04b3bb95",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const flashRecordsSpecialist: LorcanitoCharacterCard = {
//   id: "gbc",
//   name: "Flash",
//   title: "Records Specialist",
//   characteristics: ["dreamborn", "ally"],
//   text: "HOLD... YOUR HORSES This character enters play exerted.\nDEEP RESEARCH Whenever this character quests, you may give chosen Detective character +2 {S} this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Sergio Mancinelli",
//   number: 14,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659461,
//   },
//   rarity: "common",
//   abilities: [
//     entersPlayExerted({
//       name: "HOLD... YOUR HORSES",
//     }),
//     wheneverThisCharacterQuests({
//       name: "DEEP RESEARCH",
//       text: "Whenever this character quests, you may give chosen Detective character +2 {S} this turn.",
//       optional: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["detective"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
