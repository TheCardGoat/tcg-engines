import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoRescueDog: CharacterCard = {
  id: "141",
  cardType: "character",
  name: "Pluto",
  version: "Rescue Dog",
  fullName: "Pluto - Rescue Dog",
  inkType: ["amber"],
  set: "009",
  text: "TO THE RESCUE When you play this character, you may remove up to 3 damage from chosen character of yours.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 16,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "90509aa765f200ec9ee3743bb833e8fd9c8dfbb2",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { plutoRescueDog as ogPlutoRescueDog } from "@lorcanito/lorcana-engine/cards/004/characters/20-pluto-rescue-dog";
//
// export const plutoRescueDog: LorcanitoCharacterCard = {
//   ...ogPlutoRescueDog,
//   id: "baa",
//   reprints: [ogPlutoRescueDog.id],
//   number: 16,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649964,
//   },
// };
//
