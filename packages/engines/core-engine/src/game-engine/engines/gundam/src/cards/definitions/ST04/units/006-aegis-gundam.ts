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
        targetText: "enemy Unit that is Lv",
        originalText: "choose 1 enemy Unit that is Lv.",
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 3,
        preventable: true,
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        amount: 3,
        preventable: true,
      },
    ],
    trigger: {
      event: "attack",
    },
    text: "【attack】",
  },
];

export const aegisGundam: GundamitoUnitCard = {
  id: "ST04-006",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 6,
  name: "Aegis Gundam",
  color: "red",
  set: "ST04",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["athrun zala"],
  ap: 4,
  hp: 3,
  text: "【Attack】If this Unit has 5 or more AP, choose 1 enemy Unit that is Lv.5 or higher. Deal 3 damage to it.",
  abilities: abilities,
};
