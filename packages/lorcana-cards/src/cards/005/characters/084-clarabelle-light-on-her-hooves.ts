import type { CharacterCard } from "@tcg/lorcana-types";

export const clarabelleLightOnHerHooves: CharacterCard = {
  id: "1dt",
  cardType: "character",
  name: "Clarabelle",
  version: "Light on Her Hooves",
  fullName: "Clarabelle - Light on Her Hooves",
  inkType: ["emerald"],
  set: "005",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Clarabelle.)\nKEEP IN STEP At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 84,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b38a4856ba9e1a52fe3f980304c83bf8c74f7a15",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { drawCardsUntilYouHaveSameNumberOfCardsAsOpponent } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const clarabelleLightOnHerHooves: LorcanitoCharacterCard = {
//   id: "xzi",
//   name: "Clarabelle",
//   title: "Light on Her Hooves",
//   characteristics: ["floodborn", "ally"],
//   text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Clarabelle.)_\n \n**KEEP IN STEP** At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Clarabelle"),
//     atTheEndOfYourTurn({
//       name: "**KEEP IN STEP**",
//       text: "At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.",
//       optional: true,
//       conditions: [
//         {
//           type: "hand",
//           amount: "lt",
//           player: "self",
//         },
//       ],
//       effects: [drawCardsUntilYouHaveSameNumberOfCardsAsOpponent],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 7,
//   strength: 5,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Jennifer Park / Livio Cacciatore",
//   number: 84,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561959,
//   },
//   rarity: "legendary",
// };
//
