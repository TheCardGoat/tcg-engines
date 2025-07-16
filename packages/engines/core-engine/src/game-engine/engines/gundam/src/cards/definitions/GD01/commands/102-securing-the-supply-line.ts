import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "placeholder",
        parameters: {},
      },
    ],
    trigger: {
      event: "main",
    },
    text: "【Main】",
  },
];

export const securingTheSupplyLine: GundamitoCommandCard = {
  id: "GD01-102",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 102,
  name: "Securing the Supply Line",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-102.webp?250711",
  imgAlt: "Securing the Supply Line",
  type: "command",
  text: "【Main】All friendly Units that are Lv.4 or lower recover 2 HP.",
  abilities: abilities,
};
