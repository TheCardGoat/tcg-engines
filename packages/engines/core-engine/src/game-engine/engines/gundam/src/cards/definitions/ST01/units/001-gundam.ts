import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Repair",
        value: 2,
      },
    ],
    text: "<Repair 2>",
  },
];

export const gundam: GundamitoUnitCard = {
  id: "ST01-001",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 1,
  name: "Gundam",
  color: "blue",
  set: "ST01",
  rarity: "legendary",
  imageUrl: "../images/cards/card/ST01-001.webp?250711",
  imgAlt: "Gundam",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["amuro ray"],
  ap: 3,
  hp: 4,
  text: "&lt;Repair 2&gt; (At the end of your turn, this Unit recovers the specified number of HP.)",
  abilities: abilities,
};
