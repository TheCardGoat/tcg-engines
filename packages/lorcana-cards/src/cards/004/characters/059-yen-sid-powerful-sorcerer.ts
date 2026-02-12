import type { CharacterCard } from "@tcg/lorcana-types";

export const yenSidPowerfulSorcerer: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          controller: "you",
          name: "Magic Broom in play",
          type: "has-named-character",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "7ea-1",
      name: "TIMELY INTERVENTION",
      text: "TIMELY INTERVENTION When you play this character, if you have a character named Magic Broom in play, you may draw a card. ARCANE STUDY While you have 2 or more Broom characters in play, this character gets +2.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 59,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "1aa8732475a085d134487bd92f161c07bcdcbb3e",
  },
  franchise: "Fantasia",
  fullName: "Yen Sid - Powerful Sorcerer",
  id: "7ea",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Yen Sid",
  set: "004",
  strength: 1,
  text: "TIMELY INTERVENTION When you play this character, if you have a character named Magic Broom in play, you may draw a card. ARCANE STUDY While you have 2 or more Broom characters in play, this character gets +2.",
  version: "Powerful Sorcerer",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const yenSidPowerfulSorcerer: LorcanitoCharacterCard = {
//   Id: "hvf",
//   Name: "Yen Sid",
//   Title: "Powerful Sorcerer",
//   Characteristics: ["hero", "sorcerer", "storyborn"],
//   Text: "**TIMELY INTERVENTION** When you play this character, if you have a character named Magic Broom in play, you may draw a card.\n<br>\n**ARCANE STUDY** While you have 2 or more Broom characters in play, this character gets +2 {L}.",
//   Type: "character",
//   Abilities: [
//     {
//       Name: "TIME INTERVENTION",
//       Text: "When you play this character, if you have a character named Magic Broom in play, you may draw a card.",
//       Optional: true,
//       Type: "resolution",
//       ResolutionConditions: [
//         {
//           Type: "filter",
//           Comparison: { operator: "gte", value: 1 },
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             {
//               Filter: "attribute",
//               Value: "name",
//               Comparison: { operator: "eq", value: "magic broom" },
//             },
//           ],
//         },
//       ],
//       Effects: [drawACard],
//     },
//     WhileConditionThisCharacterGets({
//       Name: "ARCANE STUDY",
//       Text: "While you have 2 or more Broom characters in play, this character gets +2 {L}.",
//       Conditions: [
//         {
//           Type: "filter",
//           Comparison: {
//             Operator: "gte",
//             Value: 2,
//           },
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//             {
//               Filter: "attribute",
//               Value: "name",
//               Comparison: { operator: "eq", value: "magic broom" },
//             },
//           ],
//         },
//       ],
//       Effects: [
//         {
//           Type: "attribute" as const,
//           Attribute: "lore" as const,
//           Amount: 2,
//           Modifier: "add" as const,
//           Target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Matthew Robert Davies",
//   Number: 59,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 543902,
//   },
//   Rarity: "legendary",
// };
//
