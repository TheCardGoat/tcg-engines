import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenWickedAndVain: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      id: "y32-1",
      text: "**I SUMMON THEE** {E} − Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 56,
  cardType: "character",
  classifications: ["Queen", "Storyborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "The Queen - Wicked and Vain",
  id: "y32",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "The Queen",
  set: "001",
  strength: 4,
  text: "**I SUMMON THEE** {E} − Draw a card.",
  version: "Wicked and Vain",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Export const theQueenWickedAndVain: LorcanitoCharacterCard = {
//   Id: "y32",
//   Reprints: ["k4l"],
//   Name: "The Queen",
//   Title: "Wicked and Vain",
//   Characteristics: ["queen", "storyborn", "villain"],
//   Text: "**I SUMMON THEE** {E} − Draw a card.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "activated",
//       Responder: "self",
//       Costs: [{ type: "exert" }],
//       Name: "I Summon Thee",
//       Text: "Draw a card.",
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour:
//     "Sublime beauty matched with peerless cunning. Is there any question who is fairest?",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Matthew Robert Davies",
//   Number: 56,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508751,
//   },
//   Rarity: "super_rare",
// };
//
