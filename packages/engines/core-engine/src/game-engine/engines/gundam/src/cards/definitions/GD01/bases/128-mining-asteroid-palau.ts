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

export const miningAsteroidPalau: GundamitoBaseCard = {
  id: "GD01-128",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 128,
  name: "Mining Asteroid Palau",
  color: "red",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-128.webp?250711",
  imgAlt: "Mining Asteroid Palau",
  type: "base",
  zones: ["space"],
  traits: ["zeon", "stronghold"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 6,
  abilities: abilities,
};
