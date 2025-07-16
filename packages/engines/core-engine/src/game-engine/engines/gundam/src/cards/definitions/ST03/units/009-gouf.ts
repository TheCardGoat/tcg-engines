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
      event: "deploy",
    },
    text: "【deploy】",
  },
];

export const gouf: GundamitoUnitCard = {
  id: "ST03-009",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 3,
  number: 9,
  name: "Gouf",
  color: "green",
  set: "ST03",
  rarity: "common",
  imageUrl: "../images/cards/card/ST03-009.webp?250711",
  imgAlt: "Gouf",
  type: "unit",
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirement: ["ramba ral"],
  ap: 2,
  hp: 3,
  text: "【Deploy】Deploy 1 rested [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit token.",
  abilities: abilities,
};
