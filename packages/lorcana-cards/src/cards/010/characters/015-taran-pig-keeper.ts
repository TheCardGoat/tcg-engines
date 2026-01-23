import type { CharacterCard } from "@tcg/lorcana-types";

export const taranPigKeeper: CharacterCard = {
  id: "5f5",
  cardType: "character",
  name: "Taran",
  version: "Pig Keeper",
  fullName: "Taran - Pig Keeper",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nFOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 15,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1389ac1326730a0e6706415162ccb1913fd6478d",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const taranPigKeeper: LorcanitoCharacterCard = {
//   id: "ara",
//   name: "Taran",
//   title: "Pig Keeper",
//   characteristics: ["storyborn", "hero"],
//   text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nFOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Alejandro Hernandez",
//   number: 15,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658291,
//   },
//   rarity: "uncommon",
//   abilities: [
//     supportAbility,
//     wheneverThisCharacterQuests({
//       name: "FOLLOW THE PIG",
//       text: "Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "Hen Wen" },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
