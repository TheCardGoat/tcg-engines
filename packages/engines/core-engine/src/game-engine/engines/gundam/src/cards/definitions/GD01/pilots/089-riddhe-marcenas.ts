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

export const riddheMarcenas: GundamitoPilotCard = {
  id: "GD01-089",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 89,
  name: "Riddhe Marcenas",
  color: "blue",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-089.webp?250711",
  imgAlt: "Riddhe Marcenas",
  type: "pilot",
  traits: ["earth federation"],
  apModifier: 1,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
