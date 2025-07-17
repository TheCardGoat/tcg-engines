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

export const amuroRay: GundamitoPilotCard = {
  id: "ST01-010",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 10,
  name: "Amuro Ray",
  color: "blue",
  set: "ST01",
  rarity: "common",
  imageUrl: "../images/cards/card/ST01-010.webp?250711",
  imgAlt: "Amuro Ray",
  type: "pilot",
  traits: ["earth federation", "newtype"],
  apModifier: 2,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
