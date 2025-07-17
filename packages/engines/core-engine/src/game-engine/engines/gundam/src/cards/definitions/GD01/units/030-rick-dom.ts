import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Breach",
        value: 2,
      },
    ],
    text: "<Breach 2>",
  },
];

export const rickDom: GundamitoUnitCard = {
  id: "GD01-030",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 30,
  name: "Rick Dom",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-030.webp?250711",
  imgAlt: "Rick Dom",
  type: "unit",
  zones: ["space"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 3,
  hp: 3,
  text: "&lt;Breach 2&gt; (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  abilities: abilities,
};
