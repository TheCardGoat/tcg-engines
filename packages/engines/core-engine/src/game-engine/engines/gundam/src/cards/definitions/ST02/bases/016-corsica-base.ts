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

export const corsicaBase: GundamitoBaseCard = {
  id: "ST02-016",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 3,
  number: 16,
  name: "Corsica Base",
  color: "blue",
  set: "ST02",
  rarity: "common",
  imageUrl: "../images/cards/card/ST02-016.webp?250711",
  imgAlt: "Corsica Base",
  type: "base",
  zones: ["earth"],
  traits: ["stronghold"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
