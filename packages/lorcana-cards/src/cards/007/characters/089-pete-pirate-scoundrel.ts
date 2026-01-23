import type { CharacterCard } from "@tcg/lorcana-types";

export const petePirateScoundrel: CharacterCard = {
  id: "1o3",
  cardType: "character",
  name: "Pete",
  version: "Pirate Scoundrel",
  fullName: "Pete - Pirate Scoundrel",
  inkType: ["emerald"],
  set: "007",
  text: "PILFER AND PLUNDER Whenever you play an action that isn't a song, you may banish chosen item.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 89,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d89b25a8952e36576cfdd04557b3a45e0ca9dc07",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { pilferAndPlunderAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const petePirateScoundrel: LorcanitoCharacterCard = {
//   id: "h8f",
//   name: "Pete",
//   title: "Pirate Scoundrel",
//   characteristics: ["storyborn", "villain", "pirate"],
//   text: "PILFER AND PLUNDER Whenever you play an action that isn’t a song, you may banish chosen item.",
//   type: "character",
//   abilities: [pilferAndPlunderAbility],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Serena Malyon",
//   number: 89,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618703,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
