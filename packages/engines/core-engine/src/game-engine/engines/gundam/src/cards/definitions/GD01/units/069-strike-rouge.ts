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
        condition: ".",
        targetText: "of your rested white Units",
        originalText: "Choose 1 of your rested white Units with .",
      },
    ],
    trigger: {
      event: "once-per-turn",
    },
    text: "【once per turn】",
  },
];

export const strikeRouge: GundamitoUnitCard = {
  id: "GD01-069",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 69,
  name: "Strike Rouge",
  color: "white",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-069.webp?250711",
  imgAlt: "Strike Rouge",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["(orb) trait"],
  ap: 3,
  hp: 2,
  text: "【Activate･Main】【Once per Turn】①：Choose 1 of your rested white Units with &lt;Blocker&gt;. Set it as active. It can&#039;t attack during this turn.",
  abilities: abilities,
};
