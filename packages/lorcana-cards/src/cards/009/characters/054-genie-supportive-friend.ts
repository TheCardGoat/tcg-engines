import type { CharacterCard } from "@tcg/lorcana-types";

export const genieSupportiveFriend: CharacterCard = {
  id: "146",
  cardType: "character",
  name: "Genie",
  version: "Supportive Friend",
  fullName: "Genie - Supportive Friend",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "009",
  text: "THREE WISHES Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 54,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "90d80de24ee17049d48985b4d1fdfe1c6f9af560",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { genieSupportiveFriend as genieSupportiveFriendAsOrig } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const genieSupportiveFriend: LorcanitoCharacterCard = {
//   ...genieSupportiveFriendAsOrig,
//   id: "gm5",
//   reprints: [genieSupportiveFriendAsOrig.id],
//   number: 54,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649998,
//   },
// };
//
