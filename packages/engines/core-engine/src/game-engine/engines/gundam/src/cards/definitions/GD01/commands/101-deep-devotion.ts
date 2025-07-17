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
        targetText: "friendly Link Unit",
        originalText: "Choose 1 friendly Link Unit.",
      },
    ],
    trigger: {
      event: "action",
    },
    text: "【action】",
  },
];

export const deepDevotion: GundamitoCommandCard = {
  id: "GD01-101",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 101,
  name: "Deep Devotion",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-101.webp?250711",
  type: "command",
  text: "【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP.",
  abilities: abilities,
};
