import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentMonstrousDragon: CharacterCard = {
  id: "19f",
  cardType: "character",
  name: "Maleficent",
  version: "Monstrous Dragon",
  fullName: "Maleficent - Monstrous Dragon",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "DRAGON FIRE When you play this character, you may banish chosen character.",
  cost: 9,
  strength: 7,
  willpower: 5,
  lore: 2,
  cardNumber: 108,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a3c5b9ffeb759ea92fe07213aadc27902cf0ddbf",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { maleficentMonstrousDragon as ogMaleficentMonstrousDragon } from "@lorcanito/lorcana-engine/cards/001/characters/113-maleficent-monstrous-dragon";
//
// export const maleficentMonstrousDragon: LorcanitoCharacterCard = {
//   ...ogMaleficentMonstrousDragon,
//   id: "c6o",
//   reprints: [ogMaleficentMonstrousDragon.id],
//   number: 108,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650046,
//   },
// };
//
