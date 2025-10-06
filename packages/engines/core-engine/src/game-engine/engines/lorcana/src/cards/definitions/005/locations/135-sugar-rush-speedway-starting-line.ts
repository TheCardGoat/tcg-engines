import type {
  DamageEffect,
  ExertEffect,
  LorcanitoLocationCard,
} from "@lorcanito/lorcana-engine";
import type { MoveToLocationEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";

const exertEffect: ExertEffect = {
  type: "exert",
  exert: true,
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "play" },
      { filter: "type", value: "character" },
      { filter: "location", value: "source" },
      { filter: "status", value: "ready" },
      { filter: "status", value: "dry" },
    ],
  },
};
const damageEffect: DamageEffect = {
  type: "damage",
  amount: 1,
  target: {
    type: "card",
    value: "all",
    filters: [
      // This is replaced by the character that is moving to the location
    ],
  },
};
const moveToLocationEffect: MoveToLocationEffect = {
  type: "move-to-location",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "play" },
      { filter: "type", value: "character" },
      { filter: "location", value: "source" },
      // { filter: "status", value: "ready" },
      // { filter: "status", value: "dry" },
    ],
  },
  to: {
    type: "card",
    value: 1,
    excludeSelf: true,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "play" },
      { filter: "type", value: "location" },
      { filter: "characteristics", value: ["location"] },
    ],
  },
  afterEffect: [
    // This is the "correct" way to do it, but it doesn't work yet
    // {
    //   type: "create-layer-based-on-target",
    //   target: thisCharacter,
    //   effects: [
    //     {
    //       type: "damage",
    //       amount: 1,
    //       target: {
    //         type: "card",
    //         value: "all",
    //         filters: [
    //           // This is replaced by the character that is moving to the location
    //         ],
    //       },
    //     },
    //   ],
    // },
    damageEffect,
  ],
};
export const sugarRushSpeedwayStartingLine: LorcanaLocationCardDefinition = {
  id: "vy0",
  name: "Sugar Rush Speedway",
  title: "Starting Line",
  characteristics: ["location"],
  text: "**ON YOUR MARKS!** Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.",
  type: "location",
  abilities: [
    {
      type: "activated",
      name: "On Your Marks",
      dependentEffects: true,
      costs: [],
      text: "Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.",
      oncePerTurn: true,
      effects: [exertEffect, moveToLocationEffect],
    },
  ],
  colors: ["ruby"],
  cost: 1,
  willpower: 5,
  illustrator: "Cristian Romero",
  number: 135,
  set: "SSK",
  rarity: "rare",
  moveCost: 0,
};
