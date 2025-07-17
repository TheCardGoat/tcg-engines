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

export const archangel: GundamitoBaseCard = {
  id: "ST04-015",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 15,
  name: "Archangel",
  color: "white",
  set: "ST04",
  rarity: "common",
  imageUrl: "../images/cards/card/ST04-015.webp?250711",
  imgAlt: "Archangel",
  type: "base",
  zones: ["space", "earth"],
  traits: ["earth federation", "warship"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
