import type { CharacterCard } from "@tcg/lorcana-types";

export const julietaMadrigalExcellentCook: CharacterCard = {
  id: "10k",
  cardType: "character",
  name: "Julieta Madrigal",
  version: "Excellent Cook",
  fullName: "Julieta Madrigal - Excellent Cook",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "009",
  text: "SIGNATURE RECIPE When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 18,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "83c1850fb595a638632eaf8ed7f131f16558051a",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { julietaMadrigalExcellentCook as ogJulietaMadrigalExcellentCook } from "@lorcanito/lorcana-engine/cards/004/characters/13-julieta-madrigal-excellent-cook";
//
// export const julietaMadrigalExcellentCook: LorcanitoCharacterCard = {
//   ...ogJulietaMadrigalExcellentCook,
//   id: "gxo",
//   reprints: [ogJulietaMadrigalExcellentCook.id],
//   number: 18,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649966,
//   },
// };
//
