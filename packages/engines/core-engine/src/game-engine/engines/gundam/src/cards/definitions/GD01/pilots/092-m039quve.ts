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

export const m039quve: GundamitoPilotCard = {
  id: "GD01-092",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 92,
  name: "M&#039;Quve",
  color: "green",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-092.webp?250711",
  imgAlt: "M&#039;Quve",
  type: "pilot",
  traits: ["zeon"],
  apModifier: 1,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
