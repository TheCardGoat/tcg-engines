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

export const thirteenthTacticalTestingSector: GundamitoBaseCard = {
  id: "GD01-130",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 130,
  name: "13th Tactical Testing Sector",
  color: "white",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-130.webp?250711",
  imgAlt: "13th Tactical Testing Sector",
  type: "base",
  zones: ["space"],
  traits: ["academy", "stronghold"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
