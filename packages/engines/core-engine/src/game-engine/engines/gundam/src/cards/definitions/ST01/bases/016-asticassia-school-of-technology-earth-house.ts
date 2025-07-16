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

export const asticassiaSchoolOfTechnologyEarthHouse: GundamitoBaseCard = {
  id: "ST01-016",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 16,
  name: "Asticassia School of Technology, Earth House",
  color: "white",
  set: "ST01",
  rarity: "common",
  imageUrl: "../images/cards/card/ST01-016.webp?250711",
  imgAlt: "Asticassia School of Technology, Earth House",
  type: "base",
  zones: ["space"],
  traits: ["academy", "stronghold"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
