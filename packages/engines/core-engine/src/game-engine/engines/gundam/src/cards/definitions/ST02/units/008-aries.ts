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

export const aries: GundamitoUnitCard = {
  id: "ST02-008",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 8,
  name: "Aries",
  color: "blue",
  set: "ST02",
  rarity: "common",
  imageUrl: "../images/cards/card/ST02-008.webp?250711",
  imgAlt: "Aries",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["-"],
  ap: 2,
  hp: 1,
  text: "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)",
  abilities: abilities,
};
