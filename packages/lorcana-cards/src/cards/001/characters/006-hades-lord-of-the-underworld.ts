import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesLordOfTheUnderworld: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "return-from-discard",
        cardType: "character",
        target: "CONTROLLER",
      },
      id: "1yp-1",
      name: "WELL OF SOULS",
      text: "WELL OF SOULS When you play this character, return a character card from your discard to your hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 6,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Deity"],
  cost: 4,
  externalIds: {
    ravensburger: "fee01a363b4de2d6f92c340520d2adaea461f380",
  },
  franchise: "Hercules",
  fullName: "Hades - Lord of the Underworld",
  id: "1yp",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  name: "Hades",
  set: "001",
  strength: 3,
  text: "WELL OF SOULS When you play this character, return a character card from your discard to your hand.",
  version: "Lord of the Underworld",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const hadesLordOfUnderworld: LorcanitoCharacterCard = {
//   Id: "kaz",
//   Name: "Hades",
//   Title: "Lord of the Underworld",
//   Characteristics: ["storyborn", "villain", "deity"],
//   Text: "**WELL OF SOULS** When you play this character, return a character card from your discard to your hand.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "WELL OF SOULS",
//       Text: "When you play this character, return a character card from your discard to your hand.",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Exerted: false,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     '"Production is up, costs are down, the rivers are full. Time to talk expansion."',
//   Colors: ["amber"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Randy Bishop",
//   Number: 6,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493480,
//   },
//   Rarity: "rare",
// };
//
