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

export const yzakJule: GundamitoPilotCard = {
  id: "GD01-094",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 94,
  name: "Yzak Jule",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-094.webp?250711",
  imgAlt: "Yzak Jule",
  type: "pilot",
  traits: [],
  apModifier: 1,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
