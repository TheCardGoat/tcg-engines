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

export const banagherLinks: GundamitoPilotCard = {
  id: "GD01-088",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 5,
  number: 88,
  name: "Banagher Links",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-088.webp?250711",
  imgAlt: "Banagher Links",
  type: "pilot",
  traits: ["civilian", "newtype"],
  apModifier: 2,
  hpModifier: 2,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
