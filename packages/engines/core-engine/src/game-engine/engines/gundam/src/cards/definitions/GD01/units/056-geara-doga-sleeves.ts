import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
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
        condition: "5 or less AP",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with 5 or less AP.",
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
      event: "destroyed",
    },
    text: "【destroyed】",
  },
];

export const gearaDogaSleeves: GundamitoUnitCard = {
  id: "GD01-056",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 56,
  name: "Geara Doga (Sleeves)",
  color: "red",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-056.webp?250711",
  imgAlt: "Geara Doga (Sleeves)",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 2,
  hp: 3,
  text: "【Destroyed】Choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.",
  abilities: abilities,
};
