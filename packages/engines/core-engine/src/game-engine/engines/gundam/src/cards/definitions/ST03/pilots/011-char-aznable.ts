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

export const charAznable: GundamitoPilotCard = {
  id: "ST03-011",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 11,
  name: "Char Aznable",
  color: "green",
  set: "ST03",
  rarity: "common",
  imageUrl: "../images/cards/card/ST03-011.webp?250711",
  imgAlt: "Char Aznable",
  type: "pilot",
  traits: ["zeon", "newtype"],
  apModifier: 1,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
