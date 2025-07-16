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

export const zowort: GundamitoUnitCard = {
  id: "ST01-009",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 9,
  name: "Zowort",
  color: "white",
  set: "ST01",
  rarity: "common",
  imageUrl: "../images/cards/card/ST01-009.webp?250711",
  imgAlt: "Zowort",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["-"],
  ap: 3,
  hp: 2,
  text: "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)",
  abilities: abilities,
};
