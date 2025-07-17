import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "damage",
        target: {
          type: "unit",
          value: "all",
          filters: [
            {
              filter: "type",
              value: "unit",
            },
            {
              filter: "owner",
              value: "opponent",
            },
          ],
          zone: "battlefield",
          isMultiple: true,
        },
        amount: 1,
        preventable: true,
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "all",
          filters: [
            {
              filter: "type",
              value: "unit",
            },
            {
              filter: "owner",
              value: "opponent",
            },
          ],
          zone: "battlefield",
          isMultiple: true,
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

export const adzam: GundamitoUnitCard = {
  id: "GD01-038",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 38,
  name: "Adzam",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-038.webp?250711",
  imgAlt: "Adzam",
  type: "unit",
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirement: ["(zeon) trait"],
  ap: 2,
  hp: 5,
  text: "【Deploy】If 5 or more enemy Units are in play, deal 1 damage to all enemy Units.",
  abilities: abilities,
};
