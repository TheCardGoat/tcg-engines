import type { CharacterCard } from "@tcg/lorcana-types";

export const honeyLemonChemistryWhiz: CharacterCard = {
  id: "1q1",
  cardType: "character",
  name: "Honey Lemon",
  version: "Chemistry Whiz",
  fullName: "Honey Lemon - Chemistry Whiz",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  text: "PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 169,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e1a975a55f05ee17bf5e1bfabc55037dc6a4e5d0",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverYouPlayAFloodBorn } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const honeyLemonChemistryWhiz: LorcanitoCharacterCard = {
//   id: "vk2",
//   name: "Honey Lemon",
//   title: "Chemistry Whiz",
//   characteristics: ["storyborn", "hero", "inventor"],
//   text: "PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayAFloodBorn({
//       name: "PRETTY GREAT, HUH?",
//       text: "Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
//       optional: true,
//       hasShifted: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Brianna Garcia",
//   number: 169,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619503,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
