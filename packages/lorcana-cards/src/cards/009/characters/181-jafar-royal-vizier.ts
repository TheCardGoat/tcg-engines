import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarRoyalVizier: CharacterCard = {
  id: "1gq",
  cardType: "character",
  name: "Jafar",
  version: "Royal Vizier",
  fullName: "Jafar - Royal Vizier",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "009",
  text: "I DON'T TRUST HIM, SIRE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "be0604ebb303eab26c710c79ed684067cfb6873f",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { jafarRoyalVizier as jafarRoyalVizierAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/184-jafar-royal-vizier";
//
// export const jafarRoyalVizier: LorcanitoCharacterCard = {
//   ...jafarRoyalVizierAsOrig,
//   id: "xva",
//   reprints: [jafarRoyalVizierAsOrig.id],
//   number: 181,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650114,
//   },
// };
//
