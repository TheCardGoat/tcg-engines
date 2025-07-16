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

export const saintGabrielInstitute: GundamitoBaseCard = {
  id: "ST02-015",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 15,
  name: "Saint Gabriel Institute",
  color: "green",
  set: "ST02",
  rarity: "common",
  imageUrl: "../images/cards/card/ST02-015.webp?250711",
  imgAlt: "Saint Gabriel Institute",
  type: "base",
  zones: ["earth"],
  traits: ["academy", "stronghold"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
