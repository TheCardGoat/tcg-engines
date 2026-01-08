// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { duringOpponentsTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverOneOfYouCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const chiefBogoCommandingOfficer: LorcanitoCharacterCard = {
//   id: "g07",
//   name: "Chief Bogo",
//   title: "Commanding Officer",
//   characteristics: ["storyborn"],
//   text: "SENDING BACKUP During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Nicola Savioli",
//   number: 18,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631362,
//   },
//   rarity: "legendary",
//   lore: 1,
//   abilities: [
//     wheneverOneOfYouCharactersIsBanished({
//       name: "SENDING BACKUP",
//       text: "During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
//       optional: true,
//       conditions: [duringOpponentsTurn],
//       triggerTarget: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "ability", value: "bodyguard" },
//       ],
//       effects: [
//         {
//           type: "reveal-and-play",
//           putInto: "deck",
//           exerted: false,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 5 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
