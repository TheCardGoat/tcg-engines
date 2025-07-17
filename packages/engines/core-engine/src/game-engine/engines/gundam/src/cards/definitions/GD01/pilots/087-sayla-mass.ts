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

export const saylaMass: GundamitoPilotCard = {
  id: "GD01-087",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 87,
  name: "Sayla Mass",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-087.webp?250711",
  imgAlt: "Sayla Mass",
  type: "pilot",
  traits: ["earth federation", "newtype"],
  apModifier: 1,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
