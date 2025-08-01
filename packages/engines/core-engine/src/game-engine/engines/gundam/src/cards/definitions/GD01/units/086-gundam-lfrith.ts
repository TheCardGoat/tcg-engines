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
    type: "resolution",
    effects: [
      {
        type: "rest",
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
        targetText: "this Unit to change the attack target to it.",
        originalText: "Rest this Unit to change the attack target to it.",
      },
    ],
    text: "(Rest this Unit to change the attack target to it.",
    dependentEffects: false,
    resolveEffectsIndividually: false,
  },
];

export const gundamLfrith: GundamitoUnitCard = {
  id: "GD01-086",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 86,
  name: "Gundam Lfrith",
  color: "white",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-086.webp?250711",
  imgAlt: "Gundam Lfrith",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["-"],
  ap: 2,
  hp: 4,
  text: "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)",
  abilities: abilities,
};
