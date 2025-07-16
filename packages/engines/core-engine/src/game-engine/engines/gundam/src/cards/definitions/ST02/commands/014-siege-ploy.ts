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

export const siegePloy: GundamitoCommandCard = {
  id: "ST02-014",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 14,
  name: "Siege Ploy",
  color: "blue",
  set: "ST02",
  rarity: "common",
  imageUrl: "../images/cards/card/ST02-014.webp?250711",
  imgAlt: "Siege Ploy",
  type: "command",
  text: "【Burst】Activate this card's 【Main】.",
  abilities: abilities,
};
