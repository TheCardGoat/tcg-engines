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
        condition: "1 HP",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with 1 HP.",
      },
    ],
    trigger: {
      event: "deploy",
    },
    text: "【deploy】",
  },
];

export const darilbalde: GundamitoUnitCard = {
  id: "GD01-075",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 75,
  name: "Darilbalde",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-075.webp?250711",
  imgAlt: "Darilbalde",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["(academy) trait"],
  ap: 4,
  hp: 2,
  text: "【Deploy】Choose 1 enemy Unit with 1 HP. Return it to its owner&#039;s hand.",
  abilities: abilities,
};
