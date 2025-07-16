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

export const nahelArgama: GundamitoBaseCard = {
  id: "GD01-123",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 123,
  name: "Nahel Argama",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-123.webp?250711",
  imgAlt: "Nahel Argama",
  type: "base",
  zones: ["space", "earth"],
  traits: ["earth federation", "warship"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
