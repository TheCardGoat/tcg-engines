import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "damage",
        target: {
          type: "unit",
          value: "all",
          filters: [
            {
              filter: "type",
              value: "unit",
            },
            {
              filter: "owner",
              value: "opponent",
            },
          ],
          zone: "battlefield",
          isMultiple: true,
        },
        amount: 1,
        preventable: true,
      },
      {
        type: "damage",
        target: {
          type: "unit",
          value: "all",
          filters: [
            {
              filter: "type",
              value: "unit",
            },
            {
              filter: "owner",
              value: "opponent",
            },
          ],
          zone: "battlefield",
          isMultiple: true,
        },
        amount: 1,
        preventable: true,
      },
    ],
    trigger: {
      event: "during-pair",
    },
    text: "【during pair】",
  },
];

export const gundamHeavyarms: GundamitoUnitCard = {
  id: "ST02-003",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 5,
  number: 3,
  name: "Gundam Heavyarms",
  color: "green",
  set: "ST02",
  rarity: "common",
  imageUrl: "../images/cards/card/ST02-003.webp?250711",
  imgAlt: "Gundam Heavyarms",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["trowa barton"],
  ap: 3,
  hp: 4,
  text: "【During Pair】During your turn, when this Unit destroys an enemy Unit with battle damage, deal 1 damage to all enemy Units that are Lv.3 or lower.",
  abilities: abilities,
};
