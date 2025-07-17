import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
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

export const unforeseenIncident: GundamitoCommandCard = {
  id: "ST01-014",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 14,
  name: "Unforeseen Incident",
  color: "white",
  set: "ST01",
  rarity: "common",
  imageUrl: "../images/cards/card/ST01-014.webp?250711",
  imgAlt: "Unforeseen Incident",
  type: "command",
  text: "【Burst】Activate this card's 【Main】.",
  abilities: abilities,
};
