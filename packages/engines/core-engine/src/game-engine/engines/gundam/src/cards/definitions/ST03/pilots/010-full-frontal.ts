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

export const fullFrontal: GundamitoPilotCard = {
  id: "ST03-010",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 6,
  number: 10,
  name: "Full Frontal",
  color: "red",
  set: "ST03",
  rarity: "common",
  imageUrl: "../images/cards/card/ST03-010.webp?250711",
  imgAlt: "Full Frontal",
  type: "pilot",
  traits: ["zeon", "newtype"],
  apModifier: 2,
  hpModifier: 2,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
