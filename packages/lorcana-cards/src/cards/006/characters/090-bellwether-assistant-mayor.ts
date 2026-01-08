import type { CharacterCard } from "@tcg/lorcana-types";

export const bellwetherAssistantMayor: CharacterCard = {
  id: "vwg",
  cardType: "character",
  name: "Bellwether",
  version: "Assistant Mayor",
  fullName: "Bellwether - Assistant Mayor",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "006",
  text: "FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 90,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "72f9912aaf126caa296ac6b59f85a9b63a5c644d",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const bellwetherAssistantMayor: LorcanitoCharacterCard = {
//   id: "aom",
//   missingTestCase: true,
//   name: "Bellwether",
//   title: "Assistant Mayor",
//   characteristics: ["storyborn", "villain"],
//   text: "FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Fear Always Works",
//       text: "During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn.",
//       conditions: [duringYourTurn],
//       effects: [
//         {
//           type: "ability",
//           ability: "reckless",
//           modifier: "add",
//           duration: "next_turn",
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Samoldstoree",
//   number: 90,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591120,
//   },
//   rarity: "uncommon",
// };
//
