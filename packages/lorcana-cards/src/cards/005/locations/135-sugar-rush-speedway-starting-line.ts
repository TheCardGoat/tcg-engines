import type { LocationCard } from "@tcg/lorcana-types";

export const sugarRushSpeedwayStartingLine: LocationCard = {
  id: "gyt",
  cardType: "location",
  name: "Sugar Rush Speedway",
  version: "Starting Line",
  fullName: "Sugar Rush Speedway - Starting Line",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "ON YOUR MARKS! Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.",
  cost: 1,
  moveCost: 0,
  lore: 0,
  cardNumber: 135,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3d26c3f06233e002b80a865b2044fc6742045f95",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   DamageEffect,
//   ExertEffect,
//   LorcanitoLocationCard,
// } from "@lorcanito/lorcana-engine";
// import type { MoveToLocationEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const exertEffect: ExertEffect = {
//   type: "exert",
//   exert: true,
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "owner", value: "self" },
//       { filter: "zone", value: "play" },
//       { filter: "type", value: "character" },
//       { filter: "location", value: "source" },
//       { filter: "status", value: "ready" },
//       { filter: "status", value: "dry" },
//     ],
//   },
// };
//
// const damageEffect: DamageEffect = {
//   type: "damage",
//   amount: 1,
//   target: {
//     type: "card",
//     value: "all",
//     filters: [
//       // This is replaced by the character that is moving to the location
//     ],
//   },
// };
//
// const moveToLocationEffect: MoveToLocationEffect = {
//   type: "move-to-location",
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "owner", value: "self" },
//       { filter: "zone", value: "play" },
//       { filter: "type", value: "character" },
//       { filter: "location", value: "source" },
//     ],
//   },
//   to: {
//     type: "card",
//     value: 1,
//     excludeSelf: true,
//     filters: [
//       { filter: "owner", value: "self" },
//       { filter: "zone", value: "play" },
//       { filter: "type", value: "location" },
//       { filter: "characteristics", value: ["location"] },
//     ],
//   },
//   // Don't pass location targets to afterEffect - it has its own instanceId filters for the character
//   ignoreParentsTargets: true,
//   afterEffect: [
//     // This is the "correct" way to do it, but it doesn't work yet
//     // {
//     //   type: "create-layer-based-on-target",
//     //   target: thisCharacter,
//     //   effects: [
//     //     {
//     //       type: "damage",
//     //       amount: 1,
//     //       target: {
//     //         type: "card",
//     //         value: "all",
//     //         filters: [
//     //           // This is replaced by the character that is moving to the location
//     //         ],
//     //       },
//     //     },
//     //   ],
//     // },
//     // @ts-expect-error
//     damageEffect,
//   ],
// };
// export const sugarRushSpeedwayStartingLine: LorcanitoLocationCard = {
//   id: "vy0",
//   name: "Sugar Rush Speedway",
//   title: "Starting Line",
//   characteristics: ["location"],
//   text: "**ON YOUR MARKS!** Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.",
//   type: "location",
//   abilities: [
//     {
//       type: "activated",
//       name: "On Your Marks",
//       dependentEffects: true,
//       costs: [],
//       text: "Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.",
//       oncePerTurn: true,
//       effects: [exertEffect, moveToLocationEffect],
//     },
//   ],
//   colors: ["ruby"],
//   cost: 1,
//   willpower: 5,
//   illustrator: "Cristian Romero",
//   number: 135,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559787,
//   },
//   rarity: "rare",
//   moveCost: 0,
// };
//
