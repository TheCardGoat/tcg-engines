import type { CharacterCard } from "@tcg/lorcana-types";

export const princeEricDashingAndBrave: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "omx-1",
      text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_",
      type: "action",
    },
  ],
  cardNumber: 187,
  cardType: "character",
  classifications: ["Hero", "Storyborn", "Prince"],
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Prince Eric - Dashing and Brave",
  id: "omx",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Prince Eric",
  set: "001",
  strength: 1,
  text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_",
  version: "Dashing and Brave",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ChallengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const priceEricDashingAndBrave: LorcanitoCharacterCard = {
//   Id: "omx",
//   Reprints: ["rfl"],
//
//   Name: "Prince Eric",
//   Title: "Dashing and Brave",
//   Characteristics: ["hero", "storyborn", "prince"],
//   Text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "challenger",
//       Value: 2,
//       Text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
//     } as ChallengerAbility,
//   ],
//   Flavour: "I lost her once! I'm not gonna lose her again!",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Cristian Romero",
//   Number: 187,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508933,
//   },
//   Rarity: "common",
// };
//
