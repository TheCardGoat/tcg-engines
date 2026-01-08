// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//   ],
// };
//
// export const youCanFly: LorcanitoActionCard = {
//   id: "yio",
//   reprints: ["uv6"],
//
//   name: "You Can Fly",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nChosen character gains **Evasive** until the start of your next turn. _Only characters with Evasive can challenge them.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   illustrator: "Eva Widermann",
//   number: 133,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527243,
//   },
//   rarity: "uncommon",
// };
//
