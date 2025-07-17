import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "draw",
        amount: 1,
      },
    ],
    trigger: {
      event: "burst",
    },
    text: "【burst】",
  },
];

export const signsOfARevolution: GundamitoCommandCard = {
  id: "GD01-104",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 104,
  name: "Signs of a Revolution",
  color: "blue",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-104.webp?250711",
  imgAlt: "Signs of a Revolution",
  type: "command",
  text: "【Burst】Draw 1.",
  abilities: abilities,
};
