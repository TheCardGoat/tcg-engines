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
    ],
    trigger: {
      event: "deploy",
    },
    text: "【deploy】",
  },
];

export const mistral: GundamitoUnitCard = {
  id: "GD01-078",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 78,
  name: "Mistral",
  color: "white",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-078.webp?250711",
  imgAlt: "Mistral",
  type: "unit",
  zones: ["space"],
  traits: ["earth federation"],
  linkRequirement: ["-"],
  ap: 1,
  hp: 1,
  text: "【Deploy】Choose 1 enemy Unit. It gets AP-1 during this turn.",
  abilities: abilities,
};
