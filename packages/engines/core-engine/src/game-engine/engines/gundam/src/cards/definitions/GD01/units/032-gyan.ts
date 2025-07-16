import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Blocker",
      },
    ],
    text: "<Blocker>",
  },
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
        condition: "that is Lv",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with  that is Lv.",
      },
      {
        type: "destroy",
        target: {
          type: "unit",
          value: "opponent",
          filters: [],
        },
        preventable: true,
      },
    ],
    trigger: {
      event: "when-paired･(zeon)-pilot",
    },
    text: "【when paired･(zeon) pilot】",
  },
];

export const gyan: GundamitoUnitCard = {
  id: "GD01-032",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 32,
  name: "Gyan",
  color: "green",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-032.webp?250711",
  imgAlt: "Gyan",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["m&#039;quve"],
  ap: 4,
  hp: 3,
  text: "【When Paired･(Zeon) Pilot】Choose 1 enemy Unit with &lt;Blocker&gt; that is Lv.2 or lower. Destroy it.",
  abilities: abilities,
};
