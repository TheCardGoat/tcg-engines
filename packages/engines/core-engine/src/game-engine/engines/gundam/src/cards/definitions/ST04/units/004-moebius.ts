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

export const moebius: GundamitoUnitCard = {
  id: "ST04-004",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 4,
  name: "Moebius",
  color: "white",
  set: "ST04",
  rarity: "common",
  type: "unit",
  zones: ["space"],
  traits: ["earth federation"],
  linkRequirement: ["-"],
  ap: 1,
  hp: 1,
  text: "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)",
  abilities: abilities,
};
