import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaIceSurfer: CharacterCard = {
  abilities: [],
  cardNumber: 109,
  cardType: "character",
  classifications: ["Hero", "Dreamborn", "Queen", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Elsa - Ice Surfer",
  id: "a9h",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  name: "Elsa",
  set: "001",
  strength: 3,
  text: "**THAT",
  version: "Ice Surfer",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const elsaIceSurfer: LorcanitoCharacterCard = {
//   Id: "a9h",
//   Name: "Elsa",
//   Title: "Ice Surfer",
//   Characteristics: ["hero", "dreamborn", "queen", "sorcerer"],
//   Text: "**THAT'S NO BLIZZARD** Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.",
//   Type: "character",
//   Abilities: [
//     WheneverPlays({
//       Name: "THAT'S NO BLIZZARD",
//       Text: "Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.",
//       TriggerTarget: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "owner", value: "self" },
//           {
//             Filter: "attribute",
//             Value: "name",
//             Comparison: { operator: "eq", value: "Anna" },
//           },
//         ],
//       },
//       Effects: readyAndCantQuest({
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//           {
//             Filter: "attribute",
//             Value: "name",
//             Comparison: { operator: "eq", value: "Elsa" },
//           },
//         ],
//       }),
//     }),
//   ],
//   Flavour:
//     "My sister has always been there for me. I need to be there for her.",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Alice Pisoni",
//   Number: 109,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507482,
//   },
//   Rarity: "common",
// };
//
