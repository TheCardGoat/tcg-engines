import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMousePirateLookout: CharacterCard = {
  id: "1hl",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Pirate Lookout",
  fullName: "Minnie Mouse - Pirate Lookout",
  inkType: ["ruby"],
  set: "006",
  text: "LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 120,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c1342a66787eb3f74ae51488e7b16a4ad1776975",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { returnLocationFromDiscardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const minnieMousePirateLookout: LorcanitoCharacterCard = {
//   id: "lm2",
//   name: "Minnie Mouse",
//   title: "Pirate Lookout",
//   characteristics: ["dreamborn", "hero", "pirate"],
//   text: "LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Land, Ho!",
//       text: "Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.",
//       optional: true,
//       conditions: [{ type: "during-turn", value: "self" }],
//       oncePerTurn: true,
//       effects: [returnLocationFromDiscardToHand],
//     }),
//   ],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 120,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593028,
//   },
//   rarity: "super_rare",
// };
//
