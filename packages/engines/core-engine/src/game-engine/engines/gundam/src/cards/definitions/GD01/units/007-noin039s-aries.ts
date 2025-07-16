import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "draw",
        amount: 1,
      },
      {
        type: "rule",
        ruleText: "OZ",
        originalText: "(OZ)",
      },
    ],
    trigger: {
      event: "destroyed",
    },
    text: "【destroyed】",
  },
];

export const noin039sAries: GundamitoUnitCard = {
  id: "GD01-007",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 3,
  number: 7,
  name: "Noin&#039;s Aries",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-007.webp?250711",
  imgAlt: "Noin&#039;s Aries",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["lucrezia noin"],
  ap: 2,
  hp: 3,
  text: "【Destroyed】If you have another (OZ) Unit in play, draw 1.",
  abilities: abilities,
};
