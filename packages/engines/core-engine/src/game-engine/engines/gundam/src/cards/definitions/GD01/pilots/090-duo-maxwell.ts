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

export const duoMaxwell: GundamitoPilotCard = {
  id: "GD01-090",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 90,
  name: "Duo Maxwell",
  color: "green",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-090.webp?250711",
  imgAlt: "Duo Maxwell",
  type: "pilot",
  traits: [],
  apModifier: 1,
  hpModifier: 2,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
