import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellMostHelpful: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "xkn-1",
      text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.",
      type: "action",
    },
  ],
  cardNumber: 93,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Fairy"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Tinker Bell - Most Helpful",
  id: "xkn",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  name: "Tinker Bell",
  set: "001",
  strength: 2,
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.",
  version: "Most Helpful",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const tinkerBellMostHelpful: LorcanitoCharacterCard = {
//   Id: "xkn",
//   Reprints: ["rxt"],
//   Name: "Tinker Bell",
//   Title: "Most Helpful",
//   Characteristics: ["storyborn", "ally", "fairy"],
//   Text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Pixie Dust",
//       Text: "When you play this character, chosen character gains **Evasive** this turn.",
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "evasive",
//           Modifier: "add",
//           Duration: "turn",
//           Target: chosenCharacter,
//         },
//       ],
//     }),
//     EvasiveAbility,
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Caner Soylu",
//   Number: 93,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508775,
//   },
//   Rarity: "common",
// };
//
