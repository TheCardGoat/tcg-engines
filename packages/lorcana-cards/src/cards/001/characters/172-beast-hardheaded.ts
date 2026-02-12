import type { CharacterCard } from "@tcg/lorcana-types";

export const beastHardheaded: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      id: "m8v-1",
      name: "BREAK",
      text: "BREAK When you play this character, you may banish chosen item.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 172,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 5,
  externalIds: {
    ravensburger: "502da9f4533484bfe02fb51fd83498e2d63e3275",
  },
  franchise: "Beauty and the Beast",
  fullName: "Beast - Hardheaded",
  id: "m8v",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Beast",
  set: "001",
  strength: 4,
  text: "BREAK When you play this character, you may banish chosen item.",
  version: "Hardheaded",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const beastHardheaded: LorcanitoCharacterCard = {
//   Id: "sh5",
//   Name: "Beast",
//   Title: "Hardheaded",
//   Characteristics: ["hero", "storyborn", "prince"],
//   Text: "**BREAK** When you play this character, you may banish chosen item card.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Break",
//       Text: "When you play this character, you may banish chosen item card.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "banish",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: '"She will never se me as anything... but a monster"',
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Cookie",
//   Number: 172,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508900,
//   },
//   Rarity: "uncommon",
// };
//
