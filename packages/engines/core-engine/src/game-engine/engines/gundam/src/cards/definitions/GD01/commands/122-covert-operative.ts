import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
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
        condition: "4 or less HP instead",
        targetText: "enemy Unit",
        originalText: "choose 1 enemy Unit with 4 or less HP instead.",
      },
    ],
    trigger: {
      event: "main",
    },
    text: "【main】",
  },
];

export const covertOperative: GundamitoCommandCard = {
  id: "GD01-122",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 122,
  name: "Covert Operative",
  color: "white",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-122.webp?250711",
  imgAlt: "Covert Operative",
  type: "command",
  text: "【Main】Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand. If you have a Link Unit in play, choose 1 enemy Unit with 4 or less HP instead.",
  abilities: abilities,
};
