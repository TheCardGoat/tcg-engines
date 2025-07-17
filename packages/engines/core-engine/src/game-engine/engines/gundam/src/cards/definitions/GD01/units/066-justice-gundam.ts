import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
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
        type: "rule",
        ruleText: "(Triple Ship Alliance",
        originalText: "((Triple Ship Alliance)",
      },
    ],
    trigger: {
      event: "deploy",
    },
    text: "【deploy】",
  },
];

export const justiceGundam: GundamitoUnitCard = {
  id: "GD01-066",
  implemented: false,
  missingTestCase: true,
  cost: 5,
  level: 7,
  number: 66,
  name: "Justice Gundam",
  color: "white",
  set: "GD01",
  rarity: "legendary",
  imageUrl: "../images/cards/card/GD01-066.webp?250711",
  imgAlt: "Justice Gundam",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["athrun zala"],
  ap: 5,
  hp: 5,
  text: "【Deploy】Deploy 1 [Fatum-00]((Triple Ship Alliance)･AP2･HP2･&lt;Blocker&gt;) Unit token.",
  abilities: abilities,
};
