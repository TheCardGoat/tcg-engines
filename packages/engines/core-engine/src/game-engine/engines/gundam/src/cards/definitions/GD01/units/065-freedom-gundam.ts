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

export const freedomGundam: GundamitoUnitCard = {
  id: "GD01-065",
  implemented: false,
  missingTestCase: true,
  cost: 5,
  level: 7,
  number: 65,
  name: "Freedom Gundam",
  color: "white",
  set: "GD01",
  rarity: "legendary",
  imageUrl: "../images/cards/card/GD01-065.webp?250711",
  imgAlt: "Freedom Gundam",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["kira yamato"],
  ap: 4,
  hp: 6,
  text: "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)",
  abilities: abilities,
};
