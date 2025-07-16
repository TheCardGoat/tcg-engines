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
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit.",
      },
    ],
    trigger: {
      event: "burst",
    },
    text: "【burst】",
  },
];

export const navalBombardment: GundamitoCommandCard = {
  id: "GD01-120",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 120,
  name: "Naval Bombardment",
  color: "white",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-120.webp?250711",
  imgAlt: "Naval Bombardment",
  type: "command",
  text: "【Burst】Choose 1 enemy Unit. It gets AP-3 during this turn.",
  abilities: abilities,
};
