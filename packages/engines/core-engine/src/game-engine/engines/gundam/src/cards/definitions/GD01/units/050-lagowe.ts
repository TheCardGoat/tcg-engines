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
        originalText: "choose 1 enemy Unit.",
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
      event: "attack",
    },
    text: "【attack】",
  },
];

export const lagowe: GundamitoUnitCard = {
  id: "GD01-050",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 50,
  name: "LaGOWE",
  color: "red",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-050.webp?250711",
  imgAlt: "LaGOWE",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["(zaft) trait"],
  ap: 2,
  hp: 3,
  text: "【Attack】If this Unit has 5 or more AP and it is attacking an enemy Unit, choose 1 enemy Unit. Deal 2 damage to it.",
  abilities: abilities,
};
