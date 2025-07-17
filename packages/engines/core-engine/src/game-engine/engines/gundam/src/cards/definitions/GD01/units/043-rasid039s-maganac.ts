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
        targetText: "of your green Units",
        originalText: "Choose 1 of your green Units.",
      },
    ],
    trigger: {
      event: "deploy",
    },
    text: "【deploy】",
  },
];

export const rasid039sMaganac: GundamitoUnitCard = {
  id: "GD01-043",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 43,
  name: "Rasid&#039;s Maganac",
  color: "green",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-043.webp?250711",
  imgAlt: "Rasid&#039;s Maganac",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["(maganac corps) trait"],
  ap: 2,
  hp: 3,
  text: "【Deploy】Choose 1 of your green Units. During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.",
  abilities: abilities,
};
