import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "draw",
        amount: 1,
      },
    ],
    trigger: {
      event: "destroyed",
    },
    text: "【destroyed】",
  },
];

export const miguelsGinn: GundamitoUnitCard = {
  id: "ST04-009",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 9,
  name: "Miguel's Ginn",
  color: "red",
  set: "ST04",
  rarity: "common",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["miguel ayman"],
  ap: 3,
  hp: 1,
  text: "【During Pair】【Destroyed】If you have another Link Unit in play, draw 1.",
  abilities: abilities,
};
