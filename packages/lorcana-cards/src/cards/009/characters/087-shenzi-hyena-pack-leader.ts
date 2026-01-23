import type { CharacterCard } from "@tcg/lorcana-types";

export const shenziHyenaPackLeader: CharacterCard = {
  id: "qk2",
  cardType: "character",
  name: "Shenzi",
  version: "Hyena Pack Leader",
  fullName: "Shenzi - Hyena Pack Leader",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "009",
  text: "I'LL HANDLE THIS While this character is at a location, she gets +3 {S}.\nWHAT'S THE HURRY? While this character is at a location, whenever she challenges another character, you may draw a card.",
  cost: 4,
  strength: 0,
  willpower: 6,
  lore: 1,
  cardNumber: 87,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5fb748398e1696271b4a787f6c9bb1200b4a5b1e",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Hyena"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shenziHyenaPackLeader as shenziHyenaPackLeaderAsOrig } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const shenziHyenaPackLeader: LorcanitoCharacterCard = {
//   ...shenziHyenaPackLeaderAsOrig,
//   id: "bh1",
//   reprints: [shenziHyenaPackLeaderAsOrig.id],
//   number: 87,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650027,
//   },
// };
//
