import type { CharacterCard } from "@tcg/lorcana-types";

export const goGoTomagoDartingDynamo: CharacterCard = {
  id: "1b9",
  cardType: "character",
  name: "Go Go Tomago",
  version: "Darting Dynamo",
  fullName: "Go Go Tomago - Darting Dynamo",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSTOP WHINING, WOMAN UP When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 73,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aa571ab1daf373cf1e599119acfe9463dd530dbc",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenOpposingDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const goGoTomagoDartingDynamo: LorcanitoCharacterCard = {
//   id: "fz6",
//   name: "Go Go Tomago",
//   title: "Darting Dynamo",
//   characteristics: ["hero", "storyborn", "inventor"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**STOP WHINING, WOMAN UP** When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     {
//       type: "resolution",
//       name: "Stop Whining, Woman Up",
//       text: "When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.",
//       optional: true,
//       costs: [{ type: "ink", amount: 2 }],
//       effects: [
//         {
//           type: "from-target-card-to-target-player",
//           player: "effect-owner",
//           target: chosenOpposingDamagedCharacter,
//           effects: [
//             youGainLore({
//               dynamic: true,
//               target: { attribute: "damage" },
//             }),
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Alex Accorsi",
//   number: 73,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578177,
//   },
//   rarity: "rare",
// };
//
