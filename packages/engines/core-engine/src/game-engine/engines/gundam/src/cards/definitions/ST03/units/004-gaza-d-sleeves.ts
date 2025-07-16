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

export const gazaDSleeves: GundamitoUnitCard = {
  id: "ST03-004",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 4,
  name: "Gaza D (Sleeves)",
  color: "red",
  set: "ST03",
  rarity: "common",
  imageUrl: "../images/cards/card/ST03-004.webp?250711",
  imgAlt: "Gaza D (Sleeves)",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 2,
  hp: 1,
  text: "【Activate･Main】&lt;Support 2&gt; (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  abilities: abilities,
};
