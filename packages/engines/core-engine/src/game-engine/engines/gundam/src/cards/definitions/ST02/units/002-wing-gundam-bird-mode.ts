import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "placeholder",
        parameters: {},
      },
    ],
    trigger: {
      event: "deploy",
    },
    text: "【deploy】",
  },
];

export const wingGundamBirdMode: GundamitoUnitCard = {
  id: "ST02-002",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 3,
  number: 2,
  name: "Wing Gundam (Bird Mode)",
  color: "green",
  set: "ST02",
  rarity: "common",
  imageUrl: "../images/cards/card/ST02-002.webp?250711",
  imgAlt: "Wing Gundam (Bird Mode)",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["heero yuy"],
  ap: 2,
  hp: 2,
  text: "【Deploy】Place 1 EX Resource.",
  abilities: abilities,
};
