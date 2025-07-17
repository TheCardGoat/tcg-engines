import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Breach",
        value: 5,
      },
    ],
    text: "<Breach 5>",
  },
];

export const wingGundam: GundamitoUnitCard = {
  id: "ST02-001",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 6,
  number: 1,
  name: "Wing Gundam",
  color: "green",
  set: "ST02",
  rarity: "legendary",
  imageUrl: "../images/cards/card/ST02-001.webp?250711",
  imgAlt: "Wing Gundam",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["heero yuy"],
  ap: 4,
  hp: 5,
  text: "&lt;Breach 5&gt; (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  abilities: abilities,
};
