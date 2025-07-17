import type { GundamitoPilotCard } from "../../cardTypes";

const abilities: GundamitoPilotCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "move-to-hand",
        target: {
          type: "unit",
          value: "self",
          filters: [
            {
              filter: "type",
              value: "unit",
            },
          ],
          zone: "battlefield",
        },
        targetText: "this card",
        originalText: "Add this card to your hand",
      },
    ],
    trigger: {
      event: "burst",
    },
    text: "【burst】",
  },
];

export const heeroYuy: GundamitoPilotCard = {
  id: "ST02-010",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 10,
  name: "Heero Yuy",
  color: "green",
  set: "ST02",
  rarity: "common",
  imageUrl: "../images/cards/card/ST02-010.webp?250711",
  imgAlt: "Heero Yuy",
  type: "pilot",
  traits: [],
  apModifier: 2,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
