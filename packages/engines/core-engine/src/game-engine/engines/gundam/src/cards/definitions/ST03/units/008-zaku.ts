import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "attribute-boost",
        amount: 2,
        parameters: {
          targetText: "This Unit",
          attribute: "AP",
          originalText: "This Unit gets AP+2",
        },
        target: {
          type: "unit",
          value: "self",
          filters: [
            {
              filter: "type",
              value: "unit",
            },
          ],
          zone: "battlefield",
        },
      },
      {
        type: "attribute-modification",
        amount: 2,
        parameters: {
          targetText: "This Unit",
          attribute: "AP",
          duration: "turn",
          originalText: "This Unit gets AP+2 during this turn",
        },
        target: {
          type: "unit",
          value: "self",
          filters: [
            {
              filter: "type",
              value: "unit",
            },
          ],
          zone: "battlefield",
        },
      },
    ],
    trigger: {
      event: "attack",
    },
    text: "【Attack】 This Unit gets AP+2 during this turn.",
  },
];

export const zaku: GundamitoUnitCard = {
  id: "ST03-008",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 8,
  name: "Zaku Ⅱ",
  color: "green",
  set: "ST03",
  rarity: "common",
  imageUrl: "../images/cards/card/ST03-008.webp?250711",
  imgAlt: "Zaku Ⅱ",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 1,
  hp: 2,
  text: "【Attack】This Unit gets AP+2 during this turn.",
  abilities: abilities,
};
