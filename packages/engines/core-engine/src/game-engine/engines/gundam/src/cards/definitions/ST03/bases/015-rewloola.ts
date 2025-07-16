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

export const rewloola: GundamitoBaseCard = {
  id: "ST03-015",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 15,
  name: "Rewloola",
  color: "red",
  set: "ST03",
  rarity: "common",
  imageUrl: "../images/cards/card/ST03-015.webp?250711",
  imgAlt: "Rewloola",
  type: "base",
  zones: ["space"],
  traits: ["zeon", "warship"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
