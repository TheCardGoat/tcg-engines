import type { CharacterCard } from "@tcg/lorcana-types";

export const chipNDaleRecoveryRangers: CharacterCard = {
  id: "1bs",
  cardType: "character",
  name: "Chip 'n' Dale",
  version: "Recovery Rangers",
  fullName: "Chip 'n' Dale - Recovery Rangers",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Chip or Dale.)\n(This character counts as being named both Chip and Dale.)\nSEARCH AND RESCUE During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 3,
  cardNumber: 14,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "04c91810f3fc39ddc8a72d65dbdc698847565330",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { returnCharacterFromDiscardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const chipNDaleRecoveryRangers: LorcanitoCharacterCard = {
//   id: "o68",
//   name: "Chip 'n' Dale",
//   additionalNames: ["Chip", "Dale"],
//   title: "Recovery Rangers",
//   characteristics: ["floodborn", "hero"],
//   text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Chip or Dale.)\n(This character counts as being named both Chip and Dale.)\nSEARCH AND RESCUE During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, ["Chip", "Dale"]),
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Search And Rescue",
//       text: "During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
//       optional: true,
//       conditions: [duringYourTurn],
//       effects: [returnCharacterFromDiscardToHand],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 8,
//   strength: 6,
//   willpower: 6,
//   lore: 3,
//   illustrator: "Louis Jones",
//   number: 14,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 582544,
//   },
//   rarity: "rare",
// };
//
