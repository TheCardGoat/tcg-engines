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
      event: "when-paired",
    },
    text: "【when paired】",
  },
];

export const gundamAerialPermetScoreSix: GundamitoUnitCard = {
  id: "ST01-006",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 6,
  name: "Gundam Aerial (Permet Score Six)",
  color: "white",
  set: "ST01",
  rarity: "legendary",
  imageUrl: "../images/cards/card/ST01-006.webp?250711",
  imgAlt: "Gundam Aerial (Permet Score Six)",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["suletta mercury"],
  ap: 4,
  hp: 4,
  text: "【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-3 during this turn.",
  abilities: abilities,
};
