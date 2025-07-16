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

export const midairModifications: GundamitoCommandCard = {
  id: "GD01-121",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 121,
  name: "Midair Modifications",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-121.webp?250711",
  imgAlt: "Midair Modifications",
  type: "command",
  text: "【Burst】Activate this card&#039;s 【Main】.",
  abilities: abilities,
};
