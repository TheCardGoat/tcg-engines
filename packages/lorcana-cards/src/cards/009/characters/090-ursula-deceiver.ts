import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaDeceiver: CharacterCard = {
  id: "d21",
  cardType: "character",
  name: "Ursula",
  version: "Deceiver",
  fullName: "Ursula - Deceiver",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "009",
  text: "YOU'LL NEVER EVEN MISS IT When you play this character, chosen opponent reveals their hand and discards a song card of your choice.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 90,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2f0ee159014b24c95f95963bdfa4b8ec79329fac",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { ursulaDeceiver as ogUrsulaDeceiver } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const ursulaDeceiver: LorcanitoCharacterCard = {
//   ...ogUrsulaDeceiver,
//   id: "r8u",
//   reprints: [ogUrsulaDeceiver.id],
//   number: 90,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650029,
//   },
// };
//
