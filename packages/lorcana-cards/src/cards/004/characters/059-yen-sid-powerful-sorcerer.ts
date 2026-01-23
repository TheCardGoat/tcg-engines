import type { CharacterCard } from "@tcg/lorcana-types";

export const yenSidPowerfulSorcerer: CharacterCard = {
  id: "7ea",
  cardType: "character",
  name: "Yen Sid",
  version: "Powerful Sorcerer",
  fullName: "Yen Sid - Powerful Sorcerer",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "004",
  text: "TIMELY INTERVENTION When you play this character, if you have a character named Magic Broom in play, you may draw a card. ARCANE STUDY While you have 2 or more Broom characters in play, this character gets +2.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 59,
  inkable: true,
  externalIds: {
    ravensburger: "1aa8732475a085d134487bd92f161c07bcdcbb3e",
  },
  abilities: [
    {
      id: "7ea-1",
      text: "TIMELY INTERVENTION When you play this character, if you have a character named Magic Broom in play, you may draw a card. ARCANE STUDY While you have 2 or more Broom characters in play, this character gets +2.",
      name: "TIMELY INTERVENTION",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-named-character",
          name: "Magic Broom in play",
          controller: "you",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const yenSidPowerfulSorcerer: LorcanitoCharacterCard = {
//   id: "hvf",
//   name: "Yen Sid",
//   title: "Powerful Sorcerer",
//   characteristics: ["hero", "sorcerer", "storyborn"],
//   text: "**TIMELY INTERVENTION** When you play this character, if you have a character named Magic Broom in play, you may draw a card.\n<br>\n**ARCANE STUDY** While you have 2 or more Broom characters in play, this character gets +2 {L}.",
//   type: "character",
//   abilities: [
//     {
//       name: "TIME INTERVENTION",
//       text: "When you play this character, if you have a character named Magic Broom in play, you may draw a card.",
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
//               comparison: { operator: "eq", value: "magic broom" },
//             },
//           ],
//         },
//       ],
//       effects: [drawACard],
//     },
//     whileConditionThisCharacterGets({
//       name: "ARCANE STUDY",
//       text: "While you have 2 or more Broom characters in play, this character gets +2 {L}.",
//       conditions: [
//         {
//           type: "filter",
//           comparison: {
//             operator: "gte",
//             value: 2,
//           },
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//             {
//               filter: "attribute",
//               value: "name",
//               comparison: { operator: "eq", value: "magic broom" },
//             },
//           ],
//         },
//       ],
//       effects: [
//         {
//           type: "attribute" as const,
//           attribute: "lore" as const,
//           amount: 2,
//           modifier: "add" as const,
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Matthew Robert Davies",
//   number: 59,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 543902,
//   },
//   rarity: "legendary",
// };
//
