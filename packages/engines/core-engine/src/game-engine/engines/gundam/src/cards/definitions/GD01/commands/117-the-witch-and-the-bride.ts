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

export const theWitchAndTheBride: GundamitoCommandCard = {
  id: "GD01-117",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 5,
  number: 117,
  name: "The Witch and the Bride",
  color: "white",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-117.webp?250711",
  imgAlt: "The Witch and the Bride",
  type: "command",
  text: "【Burst】Activate this card&#039;s 【Main】.",
  abilities: abilities,
};
