// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { Effect, LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// function getEffects(value: "self" | "opponent" | "all"): Effect[] {
//   return [
//     {
//       type: "discard",
//       amount: 60,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "zone", value: "hand" },
//           value === "all"
//             ? { filter: "zone", value: "hand" }
//             : { filter: "owner", value: value },
//         ],
//       },
//     },
//     {
//       type: "draw",
//       amount: 3,
//       target: {
//         type: "player",
//         value: value,
//       },
//     },
//   ];
// }
//
// export const beyondTheHorizon: LorcanitoActionCard = {
//   id: "yv0",
//   name: "Beyond The Horizon",
//   characteristics: ["action", "song"],
//   text: "Sing Together 7\nChoose any number of players. They discard their hands and draw 3 cards each.",
//   type: "action",
//   abilities: [
//     singerTogetherAbility(7),
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "modal",
//           // TODO: Get rid of target
//           target: chosenCharacter,
//           modes: [
//             {
//               id: "1",
//               text: "Both Players Discard their Hands and Draw 3 Cards",
//               effects: getEffects("all"),
//             },
//             {
//               id: "2",
//               text: "You discard your hand and draw 3 cards",
//               effects: getEffects("self"),
//             },
//             {
//               id: "3",
//               text: "Your opponent discards their hand and draws 3 cards",
//               effects: getEffects("opponent"),
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 7,
//   illustrator: "Taranah",
//   number: 202,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631483,
//   },
//   rarity: "uncommon",
// };
//
