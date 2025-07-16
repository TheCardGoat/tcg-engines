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

export const guncannon: GundamitoUnitCard = {
  id: "GD01-004",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 4,
  name: "Guncannon",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-004.webp?250711",
  imgAlt: "Guncannon",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(white base team) trait"],
  ap: 2,
  hp: 3,
  text: "&lt;Repair 1&gt; (At the end of your turn, this Unit recovers the specified number of HP.)",
  abilities: abilities,
};
