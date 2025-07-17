import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Breach",
        value: 4,
      },
    ],
    text: "<Breach 4>",
  },
];

export const bigZam: GundamitoUnitCard = {
  id: "GD01-027",
  implemented: false,
  missingTestCase: true,
  cost: 5,
  level: 7,
  number: 27,
  name: "Big Zam",
  color: "green",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-027.webp?250711",
  imgAlt: "Big Zam",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["dozle zabi"],
  ap: 5,
  hp: 6,
  text: "&lt;Breach 4&gt; (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  abilities: abilities,
};
