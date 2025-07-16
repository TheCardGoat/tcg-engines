import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Support",
        value: 2,
      },
    ],
    text: "<Support 2>",
  },
  {
    type: "triggered",
    effects: [
      {
        type: "rest",
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
        targetText: "this Unit.",
        originalText: "Rest this Unit.",
      },
    ],
    trigger: {
      event: "activate･main",
    },
    text: "【activate･main】",
  },
];

export const bucue: GundamitoUnitCard = {
  id: "GD01-055",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 55,
  name: "BuCUE",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-055.webp?250711",
  imgAlt: "BuCUE",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["-"],
  ap: 2,
  hp: 3,
  text: "【Activate･Main】&lt;Support 2&gt; (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  abilities: abilities,
};
