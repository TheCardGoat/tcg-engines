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

export const deltaPlus: GundamitoUnitCard = {
  id: "GD01-006",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 6,
  name: "Delta Plus",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-006.webp?250711",
  imgAlt: "Delta Plus",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(earth federation) trait"],
  ap: 4,
  hp: 3,
  text: "&lt;Repair 1&gt; (At the end of your turn, this Unit recovers the specified number of HP.)",
  abilities: abilities,
};
