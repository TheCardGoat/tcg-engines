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

export const athrunZala: GundamitoPilotCard = {
  id: "ST04-011",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 11,
  name: "Athrun Zala",
  color: "red",
  set: "ST04",
  rarity: "common",
  type: "pilot",
  traits: [],
  apModifier: 1,
  hpModifier: 2,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
