import type { CharacterCard } from "@tcg/lorcana-types";

export const owlPirateLookout: CharacterCard = {
  id: "kq3",
  cardType: "character",
  name: "Owl",
  version: "Pirate Lookout",
  fullName: "Owl - Pirate Lookout",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 1,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4ab1a2c7f0197a4df9d436fc82d25fb88371a3ec",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const owlPirateLookout: LorcanitoCharacterCard = {
//   id: "bc1",
//   missingTestCase: true,
//   name: "Owl",
//   title: "Pirate Lookout",
//   characteristics: ["storyborn", "ally", "pirate"],
//   text: "WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Well Spotted",
//       text: "During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
//       conditions: [{ type: "during-turn", value: "self" }],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "subtract",
//           duration: "next_turn",
//           until: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Omar Lozano",
//   number: 1,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588072,
//   },
//   rarity: "uncommon",
// };
//
