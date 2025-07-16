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

export const zanzibar: GundamitoBaseCard = {
  id: "GD01-125",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 125,
  name: "Zanzibar",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-125.webp?250711",
  imgAlt: "Zanzibar",
  type: "base",
  zones: ["space", "earth"],
  traits: ["zeon", "warship"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
