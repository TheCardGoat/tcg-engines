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
        targetText: "Command card that is Lv",
        originalText: "Choose 1 Command card that is Lv.",
      },
      {
        type: "move-to-hand",
        target: {
          type: "unit",
          value: "self",
          filters: [],
        },
        targetText: "it",
        originalText: "Add it to your hand",
      },
    ],
    trigger: {
      event: "when-paired",
    },
    text: "【when paired】",
  },
];

export const gundamAerialRebuild: GundamitoUnitCard = {
  id: "GD01-067",
  implemented: false,
  missingTestCase: true,
  cost: 5,
  level: 6,
  number: 67,
  name: "Gundam Aerial Rebuild",
  color: "white",
  set: "GD01",
  rarity: "legendary",
  imageUrl: "../images/cards/card/GD01-067.webp?250711",
  imgAlt: "Gundam Aerial Rebuild",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["suletta mercury"],
  ap: 5,
  hp: 4,
  text: "【When Paired】Choose 1 Command card that is Lv.5 or lower from your trash. Add it to your hand.",
  abilities: abilities,
};
