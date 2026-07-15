import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookCaptainOfTheJollyRoger: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "c2l-1",
      text: "**CAPTAIN HOOK** You may return target character to their player's hand.",
      type: "action",
    },
  ],
  cardNumber: 173,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Captain Hook - Captain of the Jolly Roger",
  id: "z5q",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Captain Hook",
  set: "001",
  strength: 3,
  text: "**DOUBLE THE POWDER!** When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
  version: "Captain of the Jolly Roger",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const captainHookCaptainOfTheJollyRoger: LorcanitoCharacterCard = {
//   Id: "z5q",
//   Reprints: ["kc5"],
//
//   Name: "Captain Hook",
//   Title: "Captain of the Jolly Roger",
//   Characteristics: ["storyborn", "villain", "pirate", "captain"],
//   Text: "**DOUBLE THE POWDER!** When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Optional: true,
//       Name: "DOUBLE THE POWDER!",
//       Text: "When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Exerted: false,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               {
//                 Filter: "attribute",
//                 Value: "name",
//                 Comparison: { operator: "eq", value: "Fire the Cannons!" },
//               },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "A pretty sight, Mr. Smee. We’ll pot ’em like sitting \rducks.",
//   Colors: ["steel"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Adrianne Gumaya",
//   Number: 173,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493489,
//   },
//   Rarity: "rare",
// };
//
