import type { CharacterCard } from "@tcg/lorcana-types";

export const treasureGuardianForebodingSentry: CharacterCard = {
  id: "9vb",
  cardType: "character",
  name: "Treasure Guardian",
  version: "Foreboding Sentry",
  fullName: "Treasure Guardian - Foreboding Sentry",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "007",
  text: "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 47,
  inkable: true,
  externalIds: {
    ravensburger: "239268271716f479ba115fea202b33efe3854e73",
  },
  abilities: [
    {
      id: "9vb-1",
      type: "triggered",
      name: "UNTOLD TREASURE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have an Illusion character in play",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const treasureGuardianForebodingSentry: LorcanitoCharacterCard = {
//   id: "ptw",
//   name: "Treasure Guardian",
//   title: "Foreboding Sentry",
//   characteristics: ["storyborn"],
//   text: "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.",
//   type: "character",
//   abilities: [
//     {
//       name: "UNTOLD TREASURE",
//       text: "When you play this character, if you have an Illusion character in play, you may draw a card.",
//       optional: true,
//       type: "resolution",
//       resolutionConditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "characteristics", value: ["illusion"] },
//           ],
//         },
//       ],
//       effects: [drawACard],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Alexandra Neonakis",
//   number: 47,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619431,
//   },
//   rarity: "common",
//   lore: 2,
// };
//
