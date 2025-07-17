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

export const kusanagi: GundamitoBaseCard = {
  id: "GD01-129",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 129,
  name: "Kusanagi",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-129.webp?250711",
  imgAlt: "Kusanagi",
  type: "base",
  zones: ["space"],
  traits: ["warship"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 4,
  abilities: abilities,
};
