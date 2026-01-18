import type { CharacterCard } from "@tcg/lorcana-types";
import { challenger, shift } from "../../ability-helpers";

export const captainHookThinkingAHappyThought: CharacterCard = {
  id: "4hp",
  cardType: "character",
  name: "Captain Hook",
  version: "Thinking a Happy Thought",
  fullName: "Captain Hook - Thinking a Happy Thought",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "001",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nChallenger +3 (While challenging, this character gets +3 {S}.)\nSTOLEN DUST Characters with cost 3 or less can't challenge this character.",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 175,
  inkable: false,
  externalIds: {
    ravensburger: "1030555f87af5d3d70406e6d85cf3a40ae98e4f2",
  },
  abilities: [
    shift("4hp-1", 3, "Captain Hook"),
    challenger("4hp-2", 3),
    {
      id: "4hp-3",
      text: "STOLEN DUST Characters with cost 3 or less can't challenge this character.",
      name: "STOLEN DUST",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
    },
  ],
  classifications: ["Floodborn", "Villain", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   challengerAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const captainHookThinkingAHappyThought: LorcanitoCharacterCard = {
//   id: "s1b",
//
//   name: "Captain Hook",
//   title: "Thinking a Happy Thought",
//   characteristics: ["floodborn", "villain", "pirate", "captain"],
//   text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)_\n\n**Challenger** +3 _(While challenging, this character gets +3 {S}.)_\n\n**STOLEN DUST** Characters with cost 3 or less can't challenge this character.",
//   type: "character",
//   illustrator: "Elliot Bocxtaele",
//   abilities: [
//     {
//       type: "static",
//       name: "Stolen Dust",
//       text: "Characters with cost 3 or less can't challenge this character.",
//       ability: "effects",
//       effects: [
//         {
//           type: "protection",
//           from: "challenge",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//     challengerAbility(3),
//     shiftAbility(3, "Captain Hook"),
//   ],
//   colors: ["steel"],
//   cost: 5,
//   strength: 2,
//   willpower: 5,
//   lore: 1,
//   number: 175,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507505,
//   },
//   rarity: "rare",
// };
//
