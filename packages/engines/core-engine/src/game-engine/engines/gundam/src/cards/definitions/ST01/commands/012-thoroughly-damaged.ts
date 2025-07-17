import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "targeting",
        amount: "1",
        target: {
          type: "unit",
          value: 1,
          filters: [
            {
              filter: "type",
              value: "unit",
            },
          ],
          zone: "battlefield",
          isMultiple: false,
        },
        condition: "",
        targetText: "rested enemy Unit",
        originalText: "Choose 1 rested enemy Unit.",
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 1,
        preventable: true,
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 1,
        preventable: true,
      },
    ],
    trigger: {
      event: "main",
    },
    text: "【main】",
  },
];

export const thoroughlyDamaged: GundamitoCommandCard = {
  id: "ST01-012",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 12,
  name: "Thoroughly Damaged",
  color: "blue",
  set: "ST01",
  rarity: "common",
  imageUrl: "../images/cards/card/ST01-012.webp?250711",
  imgAlt: "Thoroughly Damaged",
  type: "command",
  text: "【Main】Choose 1 rested enemy Unit. Deal 1 damage to it.",
  abilities: abilities,
};
