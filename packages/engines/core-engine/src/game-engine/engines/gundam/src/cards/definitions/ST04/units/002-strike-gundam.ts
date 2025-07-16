import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "draw",
        amount: 1,
      },
      {
        type: "discard",
        amount: 1,
        originalText: "discard 1.",
      },
    ],
    trigger: {
      event: "deploy",
    },
    text: "【deploy】",
  },
];

export const strikeGundam: GundamitoUnitCard = {
  id: "ST04-002",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 2,
  name: "Strike Gundam",
  color: "white",
  set: "ST04",
  rarity: "common",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["kira yamato"],
  ap: 3,
  hp: 3,
  text: "【Deploy】Draw 1. Then, discard 1.",
  abilities: abilities,
};
