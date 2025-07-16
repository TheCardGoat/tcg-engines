import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "targeting",
        amount: "1",
        target: {
          type: "unit",
          value: 1,
          filters: [
            {
              filter: "type",
              value: "unit",
            },
          ],
          zone: "battlefield",
          isMultiple: false,
        },
        condition: "",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit.",
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 1,
        preventable: true,
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 1,
        preventable: true,
      },
    ],
    trigger: {
      event: "action",
    },
    text: "【action】",
  },
];

export const zeonRemnantForces: GundamitoCommandCard = {
  id: "GD01-115",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 115,
  name: "Zeon Remnant Forces",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-115.webp?250711",
  imgAlt: "Zeon Remnant Forces",
  type: "command",
  text: "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it.",
  abilities: abilities,
};
