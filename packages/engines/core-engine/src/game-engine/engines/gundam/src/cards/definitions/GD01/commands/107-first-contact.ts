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

export const firstContact: GundamitoCommandCard = {
  id: "GD01-107",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 3,
  number: 107,
  name: "First Contact",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-107.webp?250711",
  imgAlt: "First Contact",
  type: "command",
  text: "【Burst】Place 1 EX Resource.",
  abilities: abilities,
};
