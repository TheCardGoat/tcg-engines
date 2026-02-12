import type { LocationCard } from "@tcg/lorcana-types";

export const zootopiaPoliceHeadquarters: LocationCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      id: "98y-1",
      name: "NEW INFORMATION",
      text: "NEW INFORMATION Once per turn, when you play a character here, you may draw a card.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
        },
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 203,
  cardType: "location",
  cost: 1,
  externalIds: {
    ravensburger: "2155a20775327ef31c200c31abc6084494a2cc46",
  },
  franchise: "Zootropolis",
  fullName: "Zootopia - Police Headquarters",
  id: "98y",
  inkType: ["steel"],
  inkable: true,
  lore: 0,
  moveCost: 1,
  name: "Zootopia",
  set: "010",
  text: "NEW INFORMATION Once per turn, when you play a character here, you may draw a card.",
  version: "Police Headquarters",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// Import { whenYouMoveACharacterHere } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const zootopiaPoliceHeadquarters: LorcanitoLocationCard = {
//   Id: "moe",
//   Name: "Zootopia",
//   Title: "Police Headquarters",
//   Characteristics: ["location"],
//   Text: "NEW INFORMATION Once during your turn, whenever you move a character here, you may draw a card, then choose and discard a card.",
//   Type: "location",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 1,
//   Willpower: 4,
//   Illustrator: "",
//   Number: 203,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659415,
//   },
//   Rarity: "super_rare",
//   MoveCost: 1,
//   Lore: 1,
//   Abilities: [
//     WhenYouMoveACharacterHere({
//       Name: "NEW INFORMATION",
//       Text: "Once during your turn, whenever you move a character here, you may draw a card, then choose and discard a card.",
//       Optional: true,
//       OncePerTurn: true,
//       Conditions: [
//         { type: "first-time-move-to-location" },
//         {
//           Type: "during-turn",
//           Value: "self",
//         },
//       ],
//       ResolveEffectsIndividually:
//         YouMayDrawThenChooseAndDiscard.resolveEffectsIndividually,
//       Effects: youMayDrawThenChooseAndDiscard.effects,
//     }),
//   ],
// };
//
