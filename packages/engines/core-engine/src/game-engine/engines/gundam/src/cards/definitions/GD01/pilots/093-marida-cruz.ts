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

export const maridaCruz: GundamitoPilotCard = {
  id: "GD01-093",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 93,
  name: "Marida Cruz",
  color: "red",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-093.webp?250711",
  imgAlt: "Marida Cruz",
  type: "pilot",
  traits: ["zeon", "newtype"],
  apModifier: 2,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
