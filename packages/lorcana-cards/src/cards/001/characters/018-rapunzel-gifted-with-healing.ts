import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelGiftedWithHealing: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 3,
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "remove-damage",
            upTo: true,
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "kro-1",
      text: "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
      type: "action",
    },
  ],
  cardNumber: 18,
  cardType: "character",
  classifications: ["Hero", "Storyborn", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Rapunzel - Gifted with Healing",
  id: "kro",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Rapunzel",
  set: "001",
  strength: 1,
  text: "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
  version: "Gifted with Healing",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Export const rapunzelGiftedWithHealing: LorcanitoCharacterCard = {
//   Id: "kro",
//   Name: "Rapunzel",
//   Title: "Gifted with Healing",
//   Characteristics: ["hero", "storyborn", "princess"],
//   Text: "**GLEAM AND GLOW** When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Name: "GLEAM AND GLOW",
//       Text: "When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.",
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 3,
//           UpTo: true,
//           // THIS IS HACKY AS A TEMPORARY WORKAROUND. -1 REPRESENTS DYNAMIC HEAL BASED VALUE
//           SubEffect: {
//             Type: "draw",
//             Amount: -1,
//             Target: self,
//           },
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 4,
//   Strength: 1,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Jochem Van Gool",
//   Number: 18,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506836,
//   },
//   Rarity: "legendary",
// };
//
