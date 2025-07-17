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
      event: "action",
    },
    text: "【action】",
  },
];

export const indignation: GundamitoCommandCard = {
  id: "ST03-012",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 12,
  name: "Indignation",
  color: "red",
  set: "ST03",
  rarity: "common",
  imageUrl: "../images/cards/card/ST03-012.webp?250711",
  imgAlt: "Indignation",
  type: "command",
  text: "【Main】/【Action】Choose 1 friendly Unit. It gets AP+2 during this turn.",
  abilities: abilities,
};
