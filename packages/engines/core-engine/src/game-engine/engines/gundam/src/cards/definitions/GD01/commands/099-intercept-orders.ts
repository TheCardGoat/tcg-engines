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
        condition: "5 or less HP",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with 5 or less HP.",
      },
      {
        type: "rest",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        targetText: "it.",
        originalText: "Rest it.",
      },
    ],
    trigger: {
      event: "burst",
    },
    text: "【burst】",
  },
];

export const interceptOrders: GundamitoCommandCard = {
  id: "GD01-099",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 99,
  name: "Intercept Orders",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-099.webp?250711",
  imgAlt: "Intercept Orders",
  type: "command",
  text: "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.",
  abilities: abilities,
};
