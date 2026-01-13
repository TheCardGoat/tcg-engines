import type { ActionCard } from "@tcg/lorcana-types";

export const promisingLead: ActionCard = {
  id: "19l",
  cardType: "action",
  name: "Promising Lead",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  text: "Chosen character gets +1 {L} and gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  cardNumber: 162,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a44ddfb28ff8435ece31f42c92d599f64a90165f",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AttributeEffect,
//   CardEffectTarget,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// import { chosenCharacterGainsSupport } from "@lorcanito/lorcana-engine/effects/effects";
//
// const gain2LoreEffect: AttributeEffect = {
//   type: "attribute",
//   attribute: "lore",
//   amount: 2,
//   modifier: "add",
//   duration: "turn",
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "type", value: "character" },
//       { filter: "zone", value: "play" },
//     ],
//   },
// };
//
// const targetDetectiveCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//     { filter: "characteristics", value: ["detective"] },
//   ],
// };
//
// export const promisingLead: LorcanitoActionCard = {
//   id: "yyd",
//   name: "Promising Lead",
//   characteristics: ["action"],
//   text: "Chosen character gets +2 {L} this turn. If that character is a Detective, they also gain Support this turn.",
//   type: "action",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Greez",
//   number: 162,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658877,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Promising Lead",
//       text: "Chosen character gets +2 {L} this turn. If that character is a Detective, they also gain Support this turn.",
//       effects: [
//         {
//           type: "target-conditional",
//           target: targetDetectiveCharacter,
//           effects: [
//             { ...gain2LoreEffect, target: targetDetectiveCharacter },
//             chosenCharacterGainsSupport("turn"),
//           ],
//           fallback: [gain2LoreEffect],
//         },
//       ],
//     },
//   ],
// };
//
