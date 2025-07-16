import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "rule",
        ruleText: "(Zeon",
        originalText: "((Zeon)",
      },
    ],
    trigger: {
      event: "destroyed",
    },
    text: "【destroyed】",
  },
];

export const char039sZaku: GundamitoUnitCard = {
  id: "GD01-026",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 26,
  name: "Char&#039;s Zaku Ⅱ",
  color: "green",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-026.webp?250711",
  imgAlt: "Char&#039;s Zaku Ⅱ",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["char aznable"],
  ap: 3,
  hp: 2,
  text: "【During Pair】【Destroyed】Deploy 1 rested [Char&#039;s Zaku Ⅱ]((Zeon)･AP3･HP1) Unit token.",
  abilities: abilities,
};
