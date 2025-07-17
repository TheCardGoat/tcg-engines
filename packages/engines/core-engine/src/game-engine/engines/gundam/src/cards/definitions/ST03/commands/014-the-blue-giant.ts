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

export const theBlueGiant: GundamitoCommandCard = {
  id: "ST03-014",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 14,
  name: "The Blue Giant",
  color: "green",
  set: "ST03",
  rarity: "common",
  imageUrl: "../images/cards/card/ST03-014.webp?250711",
  imgAlt: "The Blue Giant",
  type: "command",
  text: "【Action】Choose 1 friendly Unit. It can't receive battle damage from enemy Units with 2 or less AP during this battle.",
  abilities: abilities,
};
