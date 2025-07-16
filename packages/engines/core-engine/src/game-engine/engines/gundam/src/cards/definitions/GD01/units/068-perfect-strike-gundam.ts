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

export const perfectStrikeGundam: GundamitoUnitCard = {
  id: "GD01-068",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 5,
  number: 68,
  name: "Perfect Strike Gundam",
  color: "white",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-068.webp?250711",
  imgAlt: "Perfect Strike Gundam",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["(earth alliance) trait"],
  ap: 4,
  hp: 4,
  text: "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)",
  abilities: abilities,
};
