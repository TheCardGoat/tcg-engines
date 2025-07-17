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
        condition: "2 or less AP",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with 2 or less AP.",
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 2,
        preventable: true,
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 2,
        preventable: true,
      },
    ],
    trigger: {
      event: "action",
    },
    text: "【action】",
  },
];

export const stealthStratagem: GundamitoCommandCard = {
  id: "GD01-116",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 116,
  name: "Stealth Stratagem",
  color: "red",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-116.webp?250711",
  imgAlt: "Stealth Stratagem",
  type: "command",
  text: "【Main】/【Action】Choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it.",
  abilities: abilities,
};
