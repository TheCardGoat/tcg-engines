import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Support",
        value: 1,
      },
    ],
    text: "<Support 1>",
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

export const zakuISniperType: GundamitoUnitCard = {
  id: "GD01-048",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 48,
  name: "Zaku I Sniper Type",
  color: "red",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-048.webp?250711",
  imgAlt: "Zaku I Sniper Type",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["(zeon) trait"],
  ap: 0,
  hp: 1,
  text: "【Activate･Main】&lt;Support 1&gt; (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  abilities: abilities,
};
