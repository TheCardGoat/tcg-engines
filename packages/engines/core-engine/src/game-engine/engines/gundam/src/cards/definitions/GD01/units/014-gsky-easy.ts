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
        targetText: "Unit",
        originalText: "Choose 1 Unit.",
      },
    ],
    trigger: {
      event: "once-per-turn",
    },
    text: "【once per turn】",
  },
];

export const gskyEasy: GundamitoUnitCard = {
  id: "GD01-014",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 14,
  name: "G-Sky Easy",
  color: "blue",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-014.webp?250711",
  imgAlt: "G-Sky Easy",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(white base team) trait"],
  ap: 1,
  hp: 3,
  text: "【During Link】【Activate･Action】【Once per Turn】Choose 1 Unit. It recovers 1 HP.",
  abilities: abilities,
};
