import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "resolution",
    effects: [
      {
        type: "rule",
        ruleText: "Earth Federation",
        originalText: "(Earth Federation)",
      },
    ],
    text: "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.",
    dependentEffects: false,
    resolveEffectsIndividually: false,
  },
];

export const jegan: GundamitoUnitCard = {
  id: "GD01-016",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 16,
  name: "Jegan",
  color: "blue",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-016.webp?250711",
  imgAlt: "Jegan",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["-"],
  ap: 2,
  hp: 3,
  text: "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.",
  abilities: abilities,
};
