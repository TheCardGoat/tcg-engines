// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { putAllCardsFromDiscardToInkwellFaceDownAndExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const perditaDeterminedMother: LorcanitoCharacterCard = {
//   id: "iue",
//   name: "Perdita",
//   title: "Determined Mother",
//   characteristics: ["floodborn", "hero"],
//   text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Perdita.)\nQUICK, EVERYONE HIDE When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Perdita"),
//     whenYouPlayThisCharacter({
//       name: "QUICK, EVERYONE HIDE",
//       text: "When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [
//         putAllCardsFromDiscardToInkwellFaceDownAndExerted({
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//             { filter: "characteristics", value: ["puppy"] },
//           ],
//         }),
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber", "sapphire"],
//   cost: 6,
//   strength: 4,
//   willpower: 6,
//   illustrator: "Brian Weiss",
//   number: 27,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 630061,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
