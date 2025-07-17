import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Support",
        value: 3,
      },
    ],
    text: "<Support 3>",
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

export const busterGundam: GundamitoUnitCard = {
  id: "GD01-046",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 46,
  name: "Buster Gundam",
  color: "red",
  set: "GD01",
  rarity: "legendary",
  imageUrl: "../images/cards/card/GD01-046.webp?250711",
  imgAlt: "Buster Gundam",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["dearka elthman"],
  ap: 1,
  hp: 4,
  text: "【Activate･Main】&lt;Support 3&gt; (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  abilities: abilities,
};
