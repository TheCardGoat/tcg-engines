import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellGenerousFairy: CharacterCard = {
  id: "e6y",
  cardType: "character",
  name: "Tinker Bell",
  version: "Generous Fairy",
  fullName: "Tinker Bell - Generous Fairy",
  inkType: ["amber"],
  franchise: "Peter Pan",
  set: "009",
  text: "MAKE A NEW FRIEND When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 12,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3327481e6f129bd0a97e63a5c7d2bff9190b7ffd",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { tinkerBellGenerousFairy as ogTinkerBellGenerousFairy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const tinkerBellGenerousFairy: LorcanitoCharacterCard = {
//   ...ogTinkerBellGenerousFairy,
//   id: "grh",
//   reprints: [ogTinkerBellGenerousFairy.id],
//   number: 12,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649961,
//   },
// };
//
