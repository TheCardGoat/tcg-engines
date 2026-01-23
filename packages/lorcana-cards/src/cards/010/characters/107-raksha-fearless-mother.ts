import type { CharacterCard } from "@tcg/lorcana-types";

export const rakshaFearlessMother: CharacterCard = {
  id: "w0f",
  cardType: "character",
  name: "Raksha",
  version: "Fearless Mother",
  fullName: "Raksha - Fearless Mother",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "010",
  text: "ON PATROL Once during your turn, you may pay 1 {I} less to move this character to a location.",
  cost: 3,
  strength: 5,
  willpower: 3,
  lore: 1,
  cardNumber: 107,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "735f3bec8983bdfbc8cb0893d830ddbd77dce1d5",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const rakshaFearlessMother: LorcanitoCharacterCard = {
//   id: "e5z",
//   name: "Raksha",
//   title: "Fearless Mother",
//   characteristics: ["storyborn", "ally"],
//   text: "ON PATROL Once during your turn, you may pay 1 less to move this character to a location.",
//   type: "character",
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 5,
//   willpower: 3,
//   illustrator: "Shavrin Ivan / Jaime Puga",
//   number: 107,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659626,
//   },
//   rarity: "common",
//   lore: 1,
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "ON PATROL",
//       text: "Once during your turn, you may pay 1 less to move this character to a location.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "locationEntryCost",
//           amount: 1,
//           modifier: "subtract",
//           duration: "turn",
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
// };
//
