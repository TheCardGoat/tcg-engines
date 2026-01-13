import type { CharacterCard } from "@tcg/lorcana-types";

export const lyleTiberiusRourkeCrystallizedMercenary: CharacterCard = {
  id: "1ug",
  cardType: "character",
  name: "Lyle Tiberius Rourke",
  version: "Crystallized Mercenary",
  fullName: "Lyle Tiberius Rourke - Crystallized Mercenary",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "007",
  text: "EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
  cost: 8,
  strength: 6,
  willpower: 4,
  lore: 3,
  cardNumber: 140,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ef808ef7c1703b959b0bcb033683307dd1b4aca2",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { eachCharacterInPlay } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const lyleTiberiusRourkeCrystallizedMercenary: LorcanitoCharacterCard = {
//   id: "vvm",
//   name: "Lyle Tiberius Rourke",
//   title: "Crystallized Mercenary",
//   characteristics: ["storyborn", "villain"],
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 8,
//   strength: 6,
//   willpower: 4,
//   illustrator: "Federico Maria Cugliari",
//   number: 140,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619485,
//   },
//   rarity: "rare",
//   lore: 3,
//   text: "EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Explosive",
//       text: "Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
//       effects: [dealDamageEffect(2, eachCharacterInPlay)],
//       oncePerTurn: true,
//       conditions: [duringYourTurn],
//     }),
//   ],
// };
//
