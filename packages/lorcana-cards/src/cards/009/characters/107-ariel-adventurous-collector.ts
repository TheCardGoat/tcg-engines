import type { CharacterCard } from "@tcg/lorcana-types";

export const arielAdventurousCollector: CharacterCard = {
  id: "1ws",
  cardType: "character",
  name: "Ariel",
  version: "Adventurous Collector",
  fullName: "Ariel - Adventurous Collector",
  inkType: ["ruby"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.) INSPIRING VOICE Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 107,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f7e66d8c4fd5a5802bb6f4e68dce23b54d59353b",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// import { arielAdventurousCollector as arielAdventurousCollectorAsOrig } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const arielAdventurousCollector: LorcanitoCharacterCard = {
//   ...arielAdventurousCollectorAsOrig,
//   id: "uny",
//   reprints: [arielAdventurousCollectorAsOrig.id],
//   number: 107,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650045,
//   },
// };
//
