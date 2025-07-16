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

export const zechsMerquise: GundamitoPilotCard = {
  id: "ST02-011",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 5,
  number: 11,
  name: "Zechs Merquise",
  color: "blue",
  set: "ST02",
  rarity: "common",
  imageUrl: "../images/cards/card/ST02-011.webp?250711",
  imgAlt: "Zechs Merquise",
  type: "pilot",
  traits: [],
  apModifier: 2,
  hpModifier: 1,
  text: "【Burst】Add this card to your hand.",
  abilities: abilities,
};
