import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "draw",
        amount: 2,
      },
      {
        type: "discard",
        amount: 1,
        originalText: "discard 1.",
      },
    ],
    trigger: {
      event: "main",
    },
    text: "【main】",
  },
];

export const overflowingAffection: GundamitoCommandCard = {
  id: "GD01-118",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 118,
  name: "Overflowing Affection",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-118.webp?250711",
  imgAlt: "Overflowing Affection",
  type: "command",
  text: "【Main】Draw 2. Then, discard 1.",
  abilities: abilities,
};
