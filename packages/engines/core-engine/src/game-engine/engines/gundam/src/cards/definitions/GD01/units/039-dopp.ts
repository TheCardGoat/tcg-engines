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

export const dopp: GundamitoUnitCard = {
  id: "GD01-039",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 39,
  name: "Dopp",
  color: "green",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-039.webp?250711",
  imgAlt: "Dopp",
  type: "unit",
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 1,
  hp: 1,
  text: "【Deploy】Look at the top card of your deck. Return it to the top or bottom of your deck.",
  abilities: abilities,
};
