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

export const undergroundDesertBase: GundamitoBaseCard = {
  id: "GD01-126",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 126,
  name: "Underground Desert Base",
  color: "green",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-126.webp?250711",
  imgAlt: "Underground Desert Base",
  type: "base",
  zones: ["earth"],
  traits: ["stronghold"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 6,
  abilities: abilities,
};
