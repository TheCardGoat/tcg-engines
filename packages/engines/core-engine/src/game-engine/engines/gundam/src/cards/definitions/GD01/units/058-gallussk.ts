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
        targetText: "Unit that is Lv",
        originalText: "Choose 1 Unit that is Lv.",
      },
      {
        type: "attribute-boost",
        target: {
          type: "unit",
          value: "self",
          filters: [],
        },
        attribute: "AP",
        amount: 1,
        duration: "turn",
        targetText: "It",
        originalText: "It gets AP+1",
      },
    ],
    trigger: {
      event: "once-per-turn",
    },
    text: "【once per turn】",
  },
];

export const gallussk: GundamitoUnitCard = {
  id: "GD01-058",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 58,
  name: "Galluss-K",
  color: "red",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-058.webp?250711",
  imgAlt: "Galluss-K",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 3,
  hp: 2,
  text: "【Activate･Action】【Once per Turn】①：Choose 1 Unit that is Lv.4 or higher. It gets AP+1 during this battle.",
  abilities: abilities,
};
