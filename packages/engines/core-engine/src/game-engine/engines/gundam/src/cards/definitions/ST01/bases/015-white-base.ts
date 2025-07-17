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

export const whiteBase: GundamitoBaseCard = {
  id: "ST01-015",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 15,
  name: "White Base",
  color: "blue",
  set: "ST01",
  rarity: "common",
  imageUrl: "../images/cards/card/ST01-015.webp?250711",
  imgAlt: "White Base",
  type: "base",
  zones: ["space", "earth"],
  traits: ["earth federation", "warship"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
