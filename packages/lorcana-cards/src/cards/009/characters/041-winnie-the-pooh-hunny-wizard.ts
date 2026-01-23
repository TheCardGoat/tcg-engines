import type { CharacterCard } from "@tcg/lorcana-types";

export const winnieThePoohHunnyWizard: CharacterCard = {
  id: "1e9",
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Hunny Wizard",
  fullName: "Winnie the Pooh - Hunny Wizard",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "009",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 41,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "b51da8f10ad67cc06d96eae8738907353ddd8a0e",
  },
  classifications: ["Dreamborn", "Hero", "Sorcerer", "Hunny"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { winnieThePoohHunnyWizard as ogWinnieThePoohHunnyWizard } from "@lorcanito/lorcana-engine/cards/002/characters/059-winnie-the-pooh-hunny-wizard";
//
// export const winnieThePoohHunnyWizard: LorcanitoCharacterCard = {
//   ...ogWinnieThePoohHunnyWizard,
//   id: "emh",
//   reprints: [ogWinnieThePoohHunnyWizard.id],
//   number: 41,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649988,
//   },
// };
//
