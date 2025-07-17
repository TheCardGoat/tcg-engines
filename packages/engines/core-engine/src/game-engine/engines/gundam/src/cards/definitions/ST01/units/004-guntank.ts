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
        condition: "2 or less HP",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with 2 or less HP.",
      },
      {
        type: "rest",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        targetText: "it.",
        originalText: "Rest it.",
      },
    ],
    trigger: {
      event: "deploy",
    },
    text: "【deploy】",
  },
];

export const guntank: GundamitoUnitCard = {
  id: "ST01-004",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 4,
  name: "Guntank",
  color: "blue",
  set: "ST01",
  rarity: "common",
  imageUrl: "../images/cards/card/ST01-004.webp?250711",
  imgAlt: "Guntank",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["hayato kobayashi"],
  ap: 2,
  hp: 3,
  text: "【Deploy】Choose 1 enemy Unit with 2 or less HP. Rest it.",
  abilities: abilities,
};
