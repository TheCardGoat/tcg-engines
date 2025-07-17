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

export const vesalius: GundamitoBaseCard = {
  id: "ST04-016",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 16,
  name: "Vesalius",
  color: "red",
  set: "ST04",
  rarity: "common",
  imageUrl: "../images/cards/card/ST04-016.webp?250711",
  imgAlt: "Vesalius",
  type: "base",
  zones: ["space"],
  traits: ["warship"],
  text: "【Burst】Deploy this card.",
  ap: 0,
  hp: 5,
  abilities: abilities,
};
