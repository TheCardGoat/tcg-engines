import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
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
      event: "main",
    },
    text: "【main】",
  },
];

export const fortressDefense: GundamitoCommandCard = {
  id: "GD01-106",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 5,
  number: 106,
  name: "Fortress Defense",
  color: "green",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-106.webp?250711",
  imgAlt: "Fortress Defense",
  type: "command",
  text: "【Main】Deploy 2 [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit tokens.",
  abilities: abilities,
};
