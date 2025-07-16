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
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit.",
      },
      {
        type: "attribute-boost",
        target: {
          type: "unit",
          value: "self",
          filters: [],
        },
        attribute: "AP",
        amount: -1,
        duration: "turn",
        targetText: "It",
        originalText: "It gets AP-1",
      },
    ],
    trigger: {
      event: "once-per-turn",
    },
    text: "【once per turn】",
  },
];

export const gundamAerialMirasoulFlightUnit: GundamitoUnitCard = {
  id: "GD01-082",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 82,
  name: "Gundam Aerial (Mirasoul Flight Unit)",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-082.webp?250711",
  imgAlt: "Gundam Aerial (Mirasoul Flight Unit)",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["suletta mercury"],
  ap: 4,
  hp: 3,
  text: "【During Pair】【Activate･Action】【Once per Turn】②：Choose 1 enemy Unit. It gets AP-1 during this battle.",
  abilities: abilities,
};
