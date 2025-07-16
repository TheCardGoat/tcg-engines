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
        condition: "3 or less HP",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with 3 or less HP.",
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
      event: "when-paired",
    },
    text: "【when paired】",
  },
];

export const zechs039Leo: GundamitoUnitCard = {
  id: "GD01-012",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 12,
  name: "Zechs&#039; Leo",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-012.webp?250711",
  imgAlt: "Zechs&#039; Leo",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["(oz) trait"],
  ap: 3,
  hp: 2,
  text: "【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.",
  abilities: abilities,
};
