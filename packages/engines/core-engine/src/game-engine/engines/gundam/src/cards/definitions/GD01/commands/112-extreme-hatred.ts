import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "targeting",
        amount: "2",
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
        targetText: "of your active Units",
        originalText: "Choose 2 of your active Units.",
      },
      {
        type: "rest",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        targetText: "them.",
        originalText: "Rest them.",
      },
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
        originalText: "choose 1 enemy Unit.",
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 3,
        preventable: true,
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 3,
        preventable: true,
      },
    ],
    trigger: {
      event: "main",
    },
    text: "【main】",
  },
];

export const extremeHatred: GundamitoCommandCard = {
  id: "GD01-112",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 6,
  number: 112,
  name: "Extreme Hatred",
  color: "red",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-112.webp?250711",
  imgAlt: "Extreme Hatred",
  type: "command",
  text: "【Main】Choose 2 of your active Units. Rest them. If you do, choose 1 enemy Unit. Deal 3 damage to it.",
  abilities: abilities,
};
