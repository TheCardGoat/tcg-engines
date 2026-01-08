import type { CharacterCard } from "@tcg/lorcana-types";

export const camiloMadrigalFamilyCopycat: CharacterCard = {
  id: "1ra",
  cardType: "character",
  name: "Camilo Madrigal",
  version: "Family Copycat",
  fullName: "Camilo Madrigal - Family Copycat",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "005",
  text: "IMITATE Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
  cost: 6,
  strength: 3,
  willpower: 7,
  lore: 1,
  cardNumber: 58,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e4d5e8f774c50c619ff2d88974512f4e419a3b3c",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenOtherCharacterOfYours,
//   self,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const camiloMadrigalFamilyCopycat: LorcanitoCharacterCard = {
//   id: "oxz",
//   name: "Camilo Madrigal",
//   title: "Family Copycat",
//   characteristics: ["storyborn", "ally", "madrigal"],
//   text: "**IMITATE** Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "**IMITATE**",
//       text: "Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
//       optional: true,
//       dependentEffects: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           amount: 1,
//           target: chosenOtherCharacterOfYours,
//         },
//         {
//           type: "lore",
//           modifier: "add",
//           target: self,
//           amount: {
//             dynamic: true,
//             target: { attribute: "lore" },
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 3,
//   willpower: 7,
//   lore: 1,
//   illustrator: "Saulo Nate",
//   number: 58,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561300,
//   },
//   rarity: "legendary",
// };
//
