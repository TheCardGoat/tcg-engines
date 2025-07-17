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
        condition: "3 or less HP",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with 3 or less HP.",
      },
      {
        type: "rest",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        targetText: "it.",
        originalText: "Rest it.",
      },
    ],
    trigger: {
      event: "when-paired",
    },
    text: "【when paired】",
  },
];

export const unicornGundam02BansheeUnicornMode: GundamitoUnitCard = {
  id: "GD01-010",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 10,
  name: "Unicorn Gundam 02 Banshee (Unicorn Mode)",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-010.webp?250711",
  imgAlt: "Unicorn Gundam 02 Banshee (Unicorn Mode)",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(cyber-newtype) trait"],
  ap: 4,
  hp: 3,
  text: "【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.",
  abilities: abilities,
};
