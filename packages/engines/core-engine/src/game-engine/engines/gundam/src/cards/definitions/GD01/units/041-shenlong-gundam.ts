import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Breach",
        value: 3,
      },
    ],
    text: "<Breach 3>",
  },
];

export const shenlongGundam: GundamitoUnitCard = {
  id: "GD01-041",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 41,
  name: "Shenlong Gundam",
  color: "green",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-041.webp?250711",
  imgAlt: "Shenlong Gundam",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["chang wufei"],
  ap: 4,
  hp: 3,
  text: "&lt;Breach 3&gt; (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  abilities: abilities,
};
