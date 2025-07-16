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

export const shenlongGundam: GundamitoUnitCard = {
  id: "GD01-029",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 29,
  name: "Shenlong Gundam",
  color: "green",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-029.webp?250711",
  imgAlt: "Shenlong Gundam",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["chang wufei"],
  ap: 4,
  hp: 4,
  text: "&lt;Breach 4&gt; (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  abilities: abilities,
};
