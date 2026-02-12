import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinPrinceAli: CharacterCard = {
  abilities: [],
  cardNumber: 69,
  cardType: "character",
  classifications: ["Hero", "Storyborn", "Prince"],
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Aladdin - Prince Ali",
  id: "j5x",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  name: "Aladdin",
  set: "001",
  strength: 2,
  text: "**Ward** _(Opponents can",
  version: "Prince Ali",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const aladdinPrinceAli: LorcanitoCharacterCard = {
//   Id: "j5x",
//   Reprints: ["n78"],
//
//   Name: "Aladdin",
//   Title: "Prince Ali",
//   Characteristics: ["hero", "storyborn", "prince"],
//   Text: "**Ward** _(Opponents can't choose this character except to challenge.)_",
//   Type: "character",
//   Illustrator: "Lauren Walsh",
//   Abilities: [wardAbility],
//   Flavour:
//     "Fabulously wealthy. Practically untouchable. Genuinely inauthentic.",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 2,
//   Lore: 1,
//   Number: 69,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 485361,
//   },
//   Rarity: "common",
// };
//
