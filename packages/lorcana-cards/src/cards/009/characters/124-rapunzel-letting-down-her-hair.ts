import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelLettingDownHerHair: CharacterCard = {
  id: "w6r",
  cardType: "character",
  name: "Rapunzel",
  version: "Letting Down Her Hair",
  fullName: "Rapunzel - Letting Down Her Hair",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "009",
  text: "TANGLE When you play this character, each opponent loses 1 lore.",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 124,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "74021e80777ac22b8eccc6e3c94d0662b00fcf9c",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rapunzelLettingHerHairDown as rapunzelLettingDownHerHairAsOrig } from "@lorcanito/lorcana-engine/cards/001/characters/121-rapunzel-letting-down-her-hair";
//
// export const rapunzelLettingDownHerHair: LorcanitoCharacterCard = {
//   ...rapunzelLettingDownHerHairAsOrig,
//   id: "aq6",
//   reprints: [rapunzelLettingDownHerHairAsOrig.id],
//   number: 124,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650059,
//   },
// };
//
