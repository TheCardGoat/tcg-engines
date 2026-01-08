import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzSugarRushPrincess: CharacterCard = {
  id: "s65",
  cardType: "character",
  name: "Vanellope von Schweetz",
  version: "Sugar Rush Princess",
  fullName: "Vanellope von Schweetz - Sugar Rush Princess",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Vanellope von Schweetz.)\nI HEREBY DECREE Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 19,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6587479529519fdd93c24cecd1d0c2d05d2524b1",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// import { wheneverYouPlayAnotherPrincess } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// import { opponentCharactersLoseStrengthUntilNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const vanellopeVonSchweetzSugarRushPrincess: LorcanitoCharacterCard = {
//   id: "tiv",
//   name: "Vanellope von Schweetz",
//   title: "Sugar Rush Princess",
//   characteristics: ["hero", "floodborn", "princess", "racer"],
//   text: "**Shift** 2 _You may pay 2 {I} to play this on top of one of your characters named Vanellope von Schweetz.)_\n \n**I HEREBY DECREE** Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(2, "Vanellope von Schweetz"),
//     wheneverYouPlayAnotherPrincess({
//       name: "I HEREBY DECREE",
//       text: "Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
//       effects: [opponentCharactersLoseStrengthUntilNextTurn(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Vanessa Morales",
//   number: 19,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561473,
//   },
//   rarity: "rare",
// };
//
