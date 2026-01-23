import type { CharacterCard } from "@tcg/lorcana-types";

export const hansNobleScoundrel: CharacterCard = {
  id: "1wq",
  cardType: "character",
  name: "Hans",
  version: "Noble Scoundrel",
  fullName: "Hans - Noble Scoundrel",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "009",
  text: "ROYAL SCHEMES When you play this character, if a Princess or Queen character is in play, gain 1 lore.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 148,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f7ae3c4a9105e86a37c801caf8ee53341d140429",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { hansNobleScoundrel as hansNobleScoundrelAsOrig } from "@lorcanito/lorcana-engine/cards/004/characters/146-hans-noble-scoundrel";
//
// export const hansNobleScoundrel: LorcanitoCharacterCard = {
//   ...hansNobleScoundrelAsOrig,
//   id: "e93",
//   reprints: [hansNobleScoundrelAsOrig.id],
//   number: 148,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650083,
//   },
// };
//
