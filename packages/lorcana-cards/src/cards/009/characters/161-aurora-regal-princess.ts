import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraRegalPrincess: CharacterCard = {
  id: "1hb",
  cardType: "character",
  name: "Aurora",
  version: "Regal Princess",
  fullName: "Aurora - Regal Princess",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "009",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 161,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "c027ddc916cbad713b592183ff0d19138efe8b46",
  },
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { auroraRegalPrincess as auroraRegalPrincessAsOrig } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
//
// export const auroraRegalPrincess: LorcanitoCharacterCard = {
//   ...auroraRegalPrincessAsOrig,
//   id: "gc3",
//   reprints: [auroraRegalPrincessAsOrig.id],
//   number: 161,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650095,
//   },
// };
//
