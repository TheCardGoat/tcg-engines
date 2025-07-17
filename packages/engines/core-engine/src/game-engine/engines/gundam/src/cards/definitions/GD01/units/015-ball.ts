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
        targetText: "of your Units",
        originalText: "Choose 1 of your Units.",
      },
    ],
    trigger: {
      event: "attack",
    },
    text: "【attack】",
  },
];

export const ball: GundamitoUnitCard = {
  id: "GD01-015",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 15,
  name: "Ball",
  color: "blue",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-015.webp?250711",
  imgAlt: "Ball",
  type: "unit",
  zones: ["space"],
  traits: ["earth federation"],
  linkRequirement: ["-"],
  ap: 1,
  hp: 1,
  text: "【Attack】Choose 1 of your Units. It recovers 1 HP.",
  abilities: abilities,
};
