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
        originalText: "Choose 1 enemy Unit that is Lv.",
      },
    ],
    trigger: {
      event: "destroyed",
    },
    text: "【destroyed】",
  },
];

export const cagalli039sSkygrasper: GundamitoUnitCard = {
  id: "GD01-080",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 80,
  name: "Cagalli&#039;s Skygrasper",
  color: "white",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-080.webp?250711",
  imgAlt: "Cagalli&#039;s Skygrasper",
  type: "unit",
  zones: ["earth"],
  traits: ["earth federation"],
  linkRequirement: ["cagalli yula athha"],
  ap: 2,
  hp: 1,
  text: "【Destroyed】Choose 1 enemy Unit that is Lv.2 or lower. Return it to its owner&#039;s hand.",
  abilities: abilities,
};
