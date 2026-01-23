import type { CharacterCard } from "@tcg/lorcana-types";

export const mrLitwakArcadeOwner: CharacterCard = {
  id: "byt",
  cardType: "character",
  name: "Mr. Litwak",
  version: "Arcade Owner",
  fullName: "Mr. Litwak - Arcade Owner",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 24,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2b218e9fef97146992d8ada33a9b4abcc9bc1c1b",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   thisCard,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayAnotherCharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mrLitwakArcadeOwner: LorcanitoCharacterCard = {
//   id: "e53",
//   name: "Mr. Litwak",
//   title: "Arcade Owner",
//   characteristics: ["storyborn"],
//   text: "THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayAnotherCharacter({
//       name: "THE GANG'S ALL HERE",
//       text: "Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.",
//       optional: true,
//       oncePerTurn: true,
//       effects: [...readyAndCantQuest(thisCharacter)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Amanda Duarte / Julio Cesar",
//   number: 24,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593030,
//   },
//   rarity: "common",
// };
//
