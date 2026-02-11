import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaSpiritOfWinter: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
        },
        chooser: "CONTROLLER",
      },
      id: "qc4-1",
      text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_\n\n**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can",
      type: "action",
    },
  ],
  cardNumber: 42,
  cardType: "character",
  classifications: ["Hero", "Floodborn", "Queen", "Sorcerer"],
  cost: 8,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Elsa - Spirit of Winter",
  id: "qc4",
  inkType: ["amethyst"],
  inkable: true,
  lore: 3,
  name: "Elsa",
  set: "001",
  strength: 4,
  text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_\n\n**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can",
  version: "Spirit of Winter",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { exertAndCantReadyAtTheeStartOfTheirTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const elsaSpiritOfWinter: LorcanitoCharacterCard = {
//   Id: "qc4",
//   Reprints: ["qun"],
//   Name: "Elsa",
//   Title: "Spirit of Winter",
//   Characteristics: ["hero", "floodborn", "queen", "sorcerer"],
//   Text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_\n\n**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(6, "Elsa"),
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Optional: true,
//       Name: "DEEP FREEZE",
//       Text: "When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.",
//       Effects: exertAndCantReadyAtTheeStartOfTheirTurn({
//         Type: "card",
//         Value: 2,
//         UpTo: true,
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       }),
//     }),
//   ],
//   Flavour: "Ice is stronger than you may think.",
//   Colors: ["amethyst"],
//   Cost: 8,
//   Strength: 4,
//   Willpower: 6,
//   Lore: 3,
//   Illustrator: "Matthew Robert Davies",
//   Number: 42,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507512,
//   },
//   Rarity: "legendary",
// };
//
