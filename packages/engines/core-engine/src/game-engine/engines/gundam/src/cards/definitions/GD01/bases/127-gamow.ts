import type { GundamitoBaseCard } from "../../cardTypes";

const abilities: GundamitoBaseCard["abilities"] = [
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

export const gamow: GundamitoBaseCard = {
  id: "GD01-127",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 127,
  name: "Gamow",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-127.webp?250711",
  imgAlt: "Gamow",
  type: "base",
  zones: ["space"],
  traits: ["warship"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
