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
        targetText:
          "active friendly (Earth Federation) Unit and 1 active enemy Unit",
        originalText:
          "Choose 1 active friendly (Earth Federation) Unit and 1 active enemy Unit.",
      },
      {
        type: "rule",
        ruleText: "Earth Federation",
        originalText: "(Earth Federation)",
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
    ],
    trigger: {
      event: "main",
    },
    text: "【main】",
  },
];

export const theStubbornCog: GundamitoCommandCard = {
  id: "GD01-103",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 103,
  name: "The Stubborn Cog",
  color: "blue",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-103.webp?250711",
  imgAlt: "The Stubborn Cog",
  type: "command",
  text: "【Main】Choose 1 active friendly (Earth Federation) Unit and 1 active enemy Unit. Rest them.",
  abilities: abilities,
};
