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
        condition: "",
        targetText: "friendly Unit",
        originalText: "Choose 1 friendly Unit.",
      },
    ],
    trigger: {
      event: "main",
    },
    text: "【main】",
  },
];

export const kaisResolve: GundamitoCommandCard = {
  id: "ST01-013",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 13,
  name: "Kai's Resolve",
  color: "blue",
  set: "ST01",
  rarity: "common",
  imageUrl: "../images/cards/card/ST01-013.webp?250711",
  imgAlt: "Kai's Resolve",
  type: "command",
  text: "【Main】Choose 1 friendly Unit. It recovers 3 HP.",
  abilities: abilities,
};
