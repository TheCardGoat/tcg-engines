import type { CharacterCard } from "@tcg/lorcana-types";

export const cruellaDeVilFashionableCruiser: CharacterCard = {
  id: "g1s",
  cardType: "character",
  name: "Cruella De Vil",
  version: "Fashionable Cruiser",
  fullName: "Cruella De Vil - Fashionable Cruiser",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "009",
  text: "NOW GET GOING During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 145,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "39d81f72fb13e512ea913ac8dd9ab95f2688be81",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { cruellaDeVilFashionableCruiser as cruellaDeVilFashionableCruiserAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/144-cruella-de-vil-fashionable-cruiser";
//
// export const cruellaDeVilFashionableCruiser: LorcanitoCharacterCard = {
//   ...cruellaDeVilFashionableCruiserAsOrig,
//   id: "ej7",
//   reprints: [cruellaDeVilFashionableCruiserAsOrig.id],
//   number: 145,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650080,
//   },
// };
//
