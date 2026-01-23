// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { forEachCharYouHaveInPlay } from "@lorcanito/lorcana-engine/abilities/amounts";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverThisCharSings } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const brunoMadrigalSingingSeer: LorcanitoCharacterCard = {
//   id: "ooe",
//   name: "Bruno Madrigal",
//   title: "Singing Seer",
//   characteristics: ["floodborn", "ally", "madrigal"],
//   text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Bruno Madrigal.)\nBRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Bruno Madrigal"),
//     wheneverThisCharSings({
//       name: "BRIGHT FUTURE",
//       text: "Whenever this character sings a song, you may draw a card for each character you have in play.",
//       optional: true,
//       effects: [
//         {
//           type: "draw",
//           amount: forEachCharYouHaveInPlay,
//           target: self,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber", "amethyst"],
//   cost: 7,
//   strength: 3,
//   willpower: 7,
//   illustrator: "Milica Celikovic",
//   number: 20,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631364,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
