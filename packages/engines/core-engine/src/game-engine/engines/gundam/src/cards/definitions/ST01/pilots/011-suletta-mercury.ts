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

export const sulettaMercury: GundamitoPilotCard = {
  id: "ST01-011",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 11,
  name: "Suletta Mercury",
  color: "white",
  set: "ST01",
  rarity: "common",
  imageUrl: "../images/cards/card/ST01-011.webp?250711",
  imgAlt: "Suletta Mercury",
  type: "pilot",
  traits: ["academy"],
  apModifier: 1,
  hpModifier: 2,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
