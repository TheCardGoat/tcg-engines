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

export const kiraYamato: GundamitoPilotCard = {
  id: "ST04-010",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 10,
  name: "Kira Yamato",
  color: "white",
  set: "ST04",
  rarity: "common",
  type: "pilot",
  traits: ["earth federation"],
  apModifier: 2,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
