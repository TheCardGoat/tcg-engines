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
        targetText: "friendly (ZAFT) Unit",
        originalText: "Choose 1 friendly (ZAFT) Unit.",
      },
      {
        type: "rule",
        ruleText: "ZAFT",
        originalText: "(ZAFT)",
      },
    ],
    trigger: {
      event: "action",
    },
    text: "【action】",
  },
];

export const theDesertTiger: GundamitoCommandCard = {
  id: "GD01-113",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 113,
  name: "The Desert Tiger",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-113.webp?250711",
  imgAlt: "The Desert Tiger",
  type: "command",
  text: "【Main】/【Action】Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn.",
  abilities: abilities,
};
