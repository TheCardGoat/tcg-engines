import type { CharacterCard } from "@tcg/lorcana-types";

export const miloThatchUndauntedScholar: CharacterCard = {
  id: "1ah",
  cardType: "character",
  name: "Milo Thatch",
  version: "Undaunted Scholar",
  fullName: "Milo Thatch - Undaunted Scholar",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "007",
  text: "I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 145,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a781b1576f0db15a070fa749c5764a5d0fb543d0",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayAnAction } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const miloThatchUndauntedScholar: LorcanitoCharacterCard = {
//   id: "j1p",
//   name: "Milo Thatch",
//   title: "Undaunted Scholar",
//   characteristics: ["storyborn", "hero"],
//   text: "I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Stefano Zanchi",
//   number: 145,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619489,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [
//     wheneverYouPlayAnAction({
//       name: "I'M YOUR GUY",
//       text: "Whenever you play an action, you may give chosen character +2 {S} this turn.",
//       optional: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           duration: "turn",
//           modifier: "add",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
// };
//
