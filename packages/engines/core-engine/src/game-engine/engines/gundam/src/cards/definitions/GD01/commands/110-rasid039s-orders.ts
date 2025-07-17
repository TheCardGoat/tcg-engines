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
        targetText: "Unit that is Lv",
        originalText: "Choose 1 Unit that is Lv.",
      },
    ],
    trigger: {
      event: "action",
    },
    text: "【action】",
  },
];

export const rasid039sOrders: GundamitoCommandCard = {
  id: "GD01-110",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 110,
  name: "Rasid&#039;s Orders",
  color: "green",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-110.webp?250711",
  imgAlt: "Rasid&#039;s Orders",
  type: "command",
  text: "【Main】/【Action】Choose 1 Unit that is Lv.4 or higher. During this turn, it may choose an active enemy Unit with 6 or less AP as its attack target.",
  abilities: abilities,
};
