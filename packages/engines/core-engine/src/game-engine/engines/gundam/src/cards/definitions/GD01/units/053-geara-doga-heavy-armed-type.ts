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
        condition: "2 or less AP",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with 2 or less AP.",
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
      event: "once-per-turn",
    },
    text: "【once per turn】",
  },
];

export const gearaDogaHeavyArmedType: GundamitoUnitCard = {
  id: "GD01-053",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 53,
  name: "Geara Doga (Heavy Armed Type)",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-053.webp?250711",
  imgAlt: "Geara Doga (Heavy Armed Type)",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 4,
  hp: 2,
  text: "【Activate･Main】【Once per Turn】①：Choose 1 enemy Unit with 2 or less AP. Deal 1 damage to it.",
  abilities: abilities,
};
