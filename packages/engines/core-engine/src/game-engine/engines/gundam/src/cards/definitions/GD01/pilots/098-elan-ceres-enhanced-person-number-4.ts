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

export const elanCeresEnhancedPersonNumber4: GundamitoPilotCard = {
  id: "GD01-098",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 98,
  name: "Elan Ceres (Enhanced Person Number 4)",
  color: "white",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-098.webp?250711",
  imgAlt: "Elan Ceres (Enhanced Person Number 4)",
  type: "pilot",
  traits: ["academy"],
  apModifier: 2,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
