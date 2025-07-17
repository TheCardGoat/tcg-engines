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

export const side7: GundamitoBaseCard = {
  id: "GD01-124",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 124,
  name: "Side 7",
  color: "blue",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-124.webp?250711",
  imgAlt: "Side 7",
  type: "base",
  zones: ["space"],
  traits: ["earth federation", "stronghold"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 4,
  abilities: abilities,
};
