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
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit.",
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 2,
        preventable: true,
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 2,
        preventable: true,
      },
    ],
    trigger: {
      event: "burst",
    },
    text: "【burst】",
  },
];

export const battleOfAces: GundamitoCommandCard = {
  id: "GD01-111",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 111,
  name: "Battle of Aces",
  color: "red",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-111.webp?250711",
  imgAlt: "Battle of Aces",
  type: "command",
  text: "【Burst】Choose 1 enemy Unit. Deal 2 damage to it.",
  abilities: abilities,
};
