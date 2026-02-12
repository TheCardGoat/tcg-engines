import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraBriarRose: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "v54-1",
      name: "DISARMING BEAUTY",
      text: "DISARMING BEAUTY When you play this character, chosen character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 138,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "703d2d0c9e63fb69fed427dac99aa1f1f589898f",
  },
  franchise: "Sleeping Beauty",
  fullName: "Aurora - Briar Rose",
  id: "v54",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Aurora",
  set: "001",
  strength: 2,
  text: "DISARMING BEAUTY When you play this character, chosen character gets -2 {S} this turn.",
  version: "Briar Rose",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const auroraBriarRose: LorcanitoCharacterCard = {
//   Id: "du8",
//
//   Name: "Aurora",
//   Title: "Briar Rose",
//   Characteristics: ["hero", "storyborn", "princess"],
//   Text: "**DISTURBING BEAUTY** When you play this character, chosen character gets -2 {S} this turn.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "DISTURBING BEAUTY",
//       Text: "When you play this character, chosen character gets -2 {S} this turn.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 2,
//           Modifier: "subtract",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "There was something strange about that voice. Too beautiful to be real . . .",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Rosalia Radosti",
//   Number: 138,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508809,
//   },
//   Rarity: "common",
// };
//
