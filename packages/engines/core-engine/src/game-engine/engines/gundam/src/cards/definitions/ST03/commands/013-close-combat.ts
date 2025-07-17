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
      event: "burst",
    },
    text: "【burst】",
  },
];

export const closeCombat: GundamitoCommandCard = {
  id: "ST03-013",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 13,
  name: "Close Combat",
  color: "red",
  set: "ST03",
  rarity: "common",
  imageUrl: "../images/cards/card/ST03-013.webp?250711",
  imgAlt: "Close Combat",
  type: "command",
  text: "【Burst】Activate this card's 【Main】.",
  abilities: abilities,
};
