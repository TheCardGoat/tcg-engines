import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellTinyTactician: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
      id: "s44-1",
      text: "**Battle plans** {E} - Draw a card, then choose and discard a card.",
      type: "action",
    },
  ],
  cardNumber: 194,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Fairy"],
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Tinker Bell - Tiny Tactician",
  id: "s44",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Tinker Bell",
  set: "001",
  strength: 2,
  text: "**Battle plans** {E} - Draw a card, then choose and discard a card.",
  version: "Tiny Tactician",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const tinkerBellTinyTactician: LorcanitoCharacterCard = {
//   Id: "s44",
//   Reprints: ["ahg"],
//
//   Name: "Tinker Bell",
//   Title: "Tiny Tactician",
//   Characteristics: ["dreamborn", "ally", "fairy"],
//   Text: "**Battle plans** {E} - Draw a card, then choose and discard a card.",
//   Type: "character",
//   Abilities: [
//     {
//       ...youMayDrawThenChooseAndDiscard,
//       Type: "activated",
//       Costs: [{ type: "exert" }],
//       Optional: false,
//       Name: "Battle plans",
//       Text: "Draw a card, then choose and discard a card.",
//     },
//   ],
//   Flavour: "Sometimes all you need is a little tactical genius.",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Grace Tran",
//   Number: 194,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 488544,
//   },
//   Rarity: "common",
// };
//
