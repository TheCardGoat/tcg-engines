import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookThinkingAHappyThought: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "4hp-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      id: "4hp-2",
      keyword: "Challenger",
      text: "Challenger +3",
      type: "keyword",
      value: 3,
    },
    {
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
      id: "4hp-3",
      name: "STOLEN DUST",
      text: "STOLEN DUST Characters with cost 3 or less can't challenge this character.",
      type: "static",
    },
  ],
  cardNumber: 175,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Pirate", "Captain"],
  cost: 5,
  externalIds: {
    ravensburger: "1030555f87af5d3d70406e6d85cf3a40ae98e4f2",
  },
  franchise: "Peter Pan",
  fullName: "Captain Hook - Thinking a Happy Thought",
  id: "4hp",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  name: "Captain Hook",
  set: "001",
  strength: 2,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nChallenger +3 (While challenging, this character gets +3 {S}.)\nSTOLEN DUST Characters with cost 3 or less can't challenge this character.",
  version: "Thinking a Happy Thought",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   ChallengerAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const captainHookThinkingAHappyThought: LorcanitoCharacterCard = {
//   Id: "s1b",
//
//   Name: "Captain Hook",
//   Title: "Thinking a Happy Thought",
//   Characteristics: ["floodborn", "villain", "pirate", "captain"],
//   Text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)_\n\n**Challenger** +3 _(While challenging, this character gets +3 {S}.)_\n\n**STOLEN DUST** Characters with cost 3 or less can't challenge this character.",
//   Type: "character",
//   Illustrator: "Elliot Bocxtaele",
//   Abilities: [
//     {
//       Type: "static",
//       Name: "Stolen Dust",
//       Text: "Characters with cost 3 or less can't challenge this character.",
//       Ability: "effects",
//       Effects: [
//         {
//           Type: "protection",
//           From: "challenge",
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 Filter: "attribute",
//                 Value: "cost",
//                 Comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//     ChallengerAbility(3),
//     ShiftAbility(3, "Captain Hook"),
//   ],
//   Colors: ["steel"],
//   Cost: 5,
//   Strength: 2,
//   Willpower: 5,
//   Lore: 1,
//   Number: 175,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507505,
//   },
//   Rarity: "rare",
// };
//
