import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouInstigator: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "dx9-1",
      text: "**FAN THE FLAMES** When you play this character, ready chosen character. They can",
      type: "action",
    },
  ],
  cardNumber: 112,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Lefou - Instigator",
  id: "dx9",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  name: "Lefou",
  set: "001",
  strength: 2,
  text: "**FAN THE FLAMES** When you play this character, ready chosen character. They can",
  version: "Instigator",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const lefouInstigator: LorcanitoCharacterCard = {
//   Id: "dx9",
//   Reprints: ["bmd"],
//   Name: "Lefou",
//   Title: "Instigator",
//   Characteristics: ["dreamborn", "ally"],
//   Text: "**FAN THE FLAMES** When you play this character, ready chosen character. They can't quest for the rest of this turn.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Fan the Flames",
//       Text: "When you play this character, ready chosen character. They can't quest for the rest of this turn.",
//       Effects: readyAndCantQuest({
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       }),
//     }),
//   ],
//   Flavour: "All a mob needs is a push in the wrong direction.",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Gaku Kumatori",
//   Number: 112,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508356,
//   },
//   Rarity: "rare",
// };
//
