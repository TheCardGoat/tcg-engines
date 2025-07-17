import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "rule",
        ruleText: "Maganac Corps",
        originalText: "(Maganac Corps)",
      },
    ],
    trigger: {
      event: "deploy",
    },
    text: "【deploy】",
  },
];

export const gundamSandrock: GundamitoUnitCard = {
  id: "GD01-028",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 5,
  number: 28,
  name: "Gundam Sandrock",
  color: "green",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-028.webp?250711",
  imgAlt: "Gundam Sandrock",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["quatre raberba winner"],
  ap: 4,
  hp: 4,
  text: "【Deploy】You may deploy 1 (Maganac Corps) Unit card from your hand.",
  abilities: abilities,
};
