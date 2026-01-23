import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteFairestInTheLand: CharacterCard = {
  id: "1wd",
  cardType: "character",
  name: "Snow White",
  version: "Fairest in the Land",
  fullName: "Snow White - Fairest in the Land",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "007",
  text: "HIDDEN AWAY This character can't be challenged.",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 33,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f66e2e1e500d2d759c8dcd4fdeafbf1831613d78",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { hiddenAwayAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const snowWhiteFairestInTheLand: LorcanitoCharacterCard = {
//   id: "ue8",
//   name: "Snow White",
//   title: "Fairest in the Land",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "HIDDEN AWAY This character can't be challenged.",
//   type: "character",
//   abilities: [hiddenAwayAbility],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Mario Manzanares",
//   number: 33,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619425,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
