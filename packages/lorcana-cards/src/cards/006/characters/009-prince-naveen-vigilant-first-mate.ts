import type { CharacterCard } from "@tcg/lorcana-types";

export const princeNaveenVigilantFirstMate: CharacterCard = {
  id: "1hg",
  cardType: "character",
  name: "Prince Naveen",
  version: "Vigilant First Mate",
  fullName: "Prince Naveen - Vigilant First Mate",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "006",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Prince Naveen.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 9,
  inkable: true,
  externalIds: {
    ravensburger: "c0abf4ad2073b023e3021c1547836aab812568ff",
  },
  abilities: [
    {
      id: "1hg-1",
      text: "Shift 3",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "1hg-2",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   bodyguardAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const princeNaveenVigilantFirstMate: LorcanitoCharacterCard = {
//   id: "o4d",
//   name: "Prince Naveen",
//   title: "Vigilant First Mate",
//   characteristics: ["floodborn", "hero", "prince"],
//   text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Prince Naveen.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
//   type: "character",
//   abilities: [shiftAbility(3, "Prince Naveen"), bodyguardAbility],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 2,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Francesco Colucci",
//   number: 9,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592016,
//   },
//   rarity: "uncommon",
// };
//
