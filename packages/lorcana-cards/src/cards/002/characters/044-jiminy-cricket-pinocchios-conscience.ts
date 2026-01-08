import type { CharacterCard } from "@tcg/lorcana-types";

export const jiminyCricketPinocchiosConscience: CharacterCard = {
  id: "tfc",
  cardType: "character",
  name: "Jiminy Cricket",
  version: "Pinocchio's Conscience",
  fullName: "Jiminy Cricket - Pinocchio's Conscience",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nTHAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 44,
  inkable: true,
  externalIds: {
    ravensburger: "6a0e1c5bd5e10ee679a0aaa9eb92ba73c5bafe57",
  },
  abilities: [
    {
      id: "tfc-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "tfc-2",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Pinocchio in play",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "THAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const jiminyCricketPinocchiosConscience: LorcanitoCharacterCard = {
//   id: "na1",
//
//   name: "Jiminy Cricket",
//   title: "Pinocchio's Conscience",
//   characteristics: ["storyborn", "mentor"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**THAT STILL, SMALL VOICE** When you play this character, if you have a character named Pinocchio in play, you may draw a card.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     {
//       name: "THAT STILL, SMALL VOICE",
//       text: "When you play this character, if you have a character named Pinocchio in play, you may draw a card",
//       optional: true,
//       type: "resolution",
//       resolutionConditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             {
//               filter: "attribute",
//               value: "name",
//               comparison: { operator: "eq", value: "pinocchio" },
//             },
//           ],
//         },
//       ],
//       effects: [drawACard],
//     },
//   ],
//   flavour: "Say, that's pretty swell.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Isaiah Mesq",
//   number: 44,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527302,
//   },
//   rarity: "common",
// };
//
