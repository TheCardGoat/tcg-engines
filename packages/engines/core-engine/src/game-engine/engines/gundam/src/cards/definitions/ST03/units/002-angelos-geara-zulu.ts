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

export const angelosGearaZulu: GundamitoUnitCard = {
  id: "ST03-002",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 2,
  name: "Angelo's Geara Zulu",
  color: "red",
  set: "ST03",
  rarity: "common",
  imageUrl: "../images/cards/card/ST03-002.webp?250711",
  imgAlt: "Angelo's Geara Zulu",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["angelo sauper"],
  ap: 3,
  hp: 3,
  text: "【Activate･Main】&lt;Support 2&gt; (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  abilities: abilities,
};
