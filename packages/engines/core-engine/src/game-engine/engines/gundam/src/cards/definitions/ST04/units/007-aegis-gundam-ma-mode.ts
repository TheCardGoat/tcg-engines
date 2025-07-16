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

export const aegisGundamMaMode: GundamitoUnitCard = {
  id: "ST04-007",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 7,
  name: "Aegis Gundam (MA Mode)",
  color: "red",
  set: "ST04",
  rarity: "common",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["athrun zala"],
  ap: 3,
  hp: 4,
  text: "&lt;Breach 3&gt; (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  abilities: abilities,
};
