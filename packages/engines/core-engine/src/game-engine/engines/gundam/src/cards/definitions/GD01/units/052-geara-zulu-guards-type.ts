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
      event: "deploy",
    },
    text: "【deploy】",
  },
];

export const gearaZuluGuardsType: GundamitoUnitCard = {
  id: "GD01-052",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 52,
  name: "Geara Zulu (Guards Type)",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-052.webp?250711",
  imgAlt: "Geara Zulu (Guards Type)",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 2,
  hp: 4,
  text: "【Deploy】Choose 1 enemy Unit. Deal 1 damage to it.",
  abilities: abilities,
};
