import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaKumandranRider: CharacterCard = {
  id: "1dx",
  cardType: "character",
  name: "Raya",
  version: "Kumandran Rider",
  fullName: "Raya - Kumandran Rider",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "006",
  text: "COME ON, LET'S DO THIS Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 107,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b3e92dc9fec7a75e1e43f9771888ad399934f8f7",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { anotherChosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const rayaKumandranRider: LorcanitoCharacterCard = {
//   id: "cdg",
//   name: "Raya",
//   title: "Kumandran Rider",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "COME ON, LET'S DO THIS Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Come On, Let's Do This",
//       text: "Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.",
//       optional: true,
//       oncePerTurn: true,
//       conditions: [duringYourTurn],
//       effects: readyAndCantQuest(anotherChosenCharacterOfYours),
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Mariana Moreno / Peter Brockhammer",
//   number: 107,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588340,
//   },
//   rarity: "rare",
// };
//
