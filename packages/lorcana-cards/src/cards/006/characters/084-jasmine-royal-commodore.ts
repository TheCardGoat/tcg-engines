import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineRoyalCommodore: CharacterCard = {
  id: "8v1",
  cardType: "character",
  name: "Jasmine",
  version: "Royal Commodore",
  fullName: "Jasmine - Royal Commodore",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jasmine.)\nRULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 84,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1ffe7a4dabe4b56c6fbb1a72511efa264a253ecc",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const jasmineRoyalCommodore: LorcanitoCharacterCard = {
//   id: "pzt",
//   name: "Jasmine",
//   title: "Royal Commodore",
//   characteristics: ["floodborn", "hero", "princess"],
//   text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jasmine.)\nRULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Jasmine"),
//     whenYouPlayThis({
//       name: "Ruler of the Seas",
//       text: "When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.",
//       conditions: [{ type: "resolution", value: "shift" }],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: "all",
//             excludeSelf: true,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "status", value: "exerted" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Matthew Robert Davies",
//   number: 84,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591116,
//   },
//   rarity: "legendary",
// };
//
