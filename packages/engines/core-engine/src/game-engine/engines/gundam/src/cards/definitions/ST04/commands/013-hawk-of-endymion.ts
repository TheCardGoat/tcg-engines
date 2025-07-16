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
        condition: "3 or less HP",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with 3 or less HP.",
      },
      {
        type: "move-to-hand",
        target: {
          type: "unit",
          value: "self",
          filters: [],
        },
        targetText: "it",
        originalText: "Return it to its owner's hand",
      },
    ],
    trigger: {
      event: "action",
    },
    text: "【action】",
  },
];

export const hawkOfEndymion: GundamitoCommandCard = {
  id: "ST04-013",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 13,
  name: "Hawk of Endymion",
  color: "white",
  set: "ST04",
  rarity: "common",
  type: "command",
  text: "【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
  abilities: abilities,
};
