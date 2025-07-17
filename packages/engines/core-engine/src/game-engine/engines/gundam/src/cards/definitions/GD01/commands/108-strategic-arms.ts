import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Blocker",
      },
    ],
    text: "<Blocker>",
  },
  {
    type: "triggered",
    effects: [
      {
        type: "damage",
        target: {
          type: "unit",
          value: "all",
          filters: [
            {
              filter: "type",
              value: "unit",
            },
          ],
          zone: "battlefield",
          isMultiple: true,
        },
        amount: 2,
        preventable: true,
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "all",
          filters: [
            {
              filter: "type",
              value: "unit",
            },
          ],
          zone: "battlefield",
          isMultiple: true,
        },
        amount: 2,
        preventable: true,
      },
    ],
    trigger: {
      event: "main",
    },
    text: "【main】",
  },
];

export const strategicArms: GundamitoCommandCard = {
  id: "GD01-108",
  implemented: false,
  missingTestCase: true,
  cost: 6,
  level: 6,
  number: 108,
  name: "Strategic Arms",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-108.webp?250711",
  imgAlt: "Strategic Arms",
  type: "command",
  text: "【Main】Deal 2 damage to all Units with &lt;Blocker&gt;.",
  abilities: abilities,
};
