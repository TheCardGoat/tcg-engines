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
        amount: 3,
        preventable: true,
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 3,
        preventable: true,
      },
    ],
    trigger: {
      event: "attack",
    },
    text: "【attack】",
  },
];

export const shamblo: GundamitoUnitCard = {
  id: "GD01-047",
  implemented: false,
  missingTestCase: true,
  cost: 7,
  level: 8,
  number: 47,
  name: "Shamblo",
  color: "red",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-047.webp?250711",
  imgAlt: "Shamblo",
  type: "unit",
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirement: ["(newtype) trait / (cyber-newtype) trait"],
  ap: 6,
  hp: 5,
  text: "【Attack】If 2 or more other rested friendly Units are in play, choose 1 enemy Unit. Deal 3 damage to it.",
  abilities: abilities,
};
