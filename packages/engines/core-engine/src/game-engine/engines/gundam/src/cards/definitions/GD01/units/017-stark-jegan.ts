import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Repair",
        value: 1,
      },
    ],
    text: "<Repair 1>",
  },
];

export const starkJegan: GundamitoUnitCard = {
  id: "GD01-017",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 3,
  number: 17,
  name: "Stark Jegan",
  color: "blue",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-017.webp?250711",
  imgAlt: "Stark Jegan",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(earth federation) trait"],
  ap: 3,
  hp: 3,
  text: "&lt;Repair 1&gt; (At the end of your turn, this Unit recovers the specified number of HP.)",
  abilities: abilities,
};
