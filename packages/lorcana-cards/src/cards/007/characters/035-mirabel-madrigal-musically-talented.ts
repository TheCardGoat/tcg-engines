import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalMusicallyTalented: CharacterCard = {
  id: "1ri",
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Musically Talented",
  fullName: "Mirabel Madrigal - Musically Talented",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "007",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mirabel Madrigal.)\nHER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 35,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e4e34e724a44eb13af101f51552399722b885dba",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mirabelMadrigalMusicallyTalented: LorcanitoCharacterCard = {
//   id: "gpn",
//   name: "Mirabel Madrigal",
//   title: "Musically Talented",
//   characteristics: ["floodborn", "hero", "madrigal"],
//   text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mirabel Madrigal.)\nHER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Mirabel Madrigal"),
//     wheneverQuests({
//       name: "HER OWN SPECIAL GIFT",
//       text: "Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "action" },
//               { filter: "characteristics", value: ["song"] },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//
//   colors: ["amber", "amethyst"],
//   cost: 6,
//   strength: 2,
//   willpower: 6,
//   illustrator: "Eri Welli",
//   number: 35,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619426,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
