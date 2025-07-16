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

export const gundamDeathscythe: GundamitoUnitCard = {
  id: "GD01-033",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 33,
  name: "Gundam Deathscythe",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-033.webp?250711",
  imgAlt: "Gundam Deathscythe",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["duo maxwell"],
  ap: 4,
  hp: 3,
  text: "&lt;Repair 1&gt; (At the end of your turn, this Unit recovers the specified number of HP.)",
  abilities: abilities,
};
