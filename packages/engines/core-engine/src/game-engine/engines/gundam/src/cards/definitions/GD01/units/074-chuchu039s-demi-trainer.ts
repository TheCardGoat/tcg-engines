import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "draw",
        amount: 1,
      },
      {
        type: "discard",
        amount: 1,
        originalText: "discard 1.",
      },
    ],
    trigger: {
      event: "attack",
    },
    text: "【attack】",
  },
];

export const chuchu039sDemiTrainer: GundamitoUnitCard = {
  id: "GD01-074",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 74,
  name: "Chuchu&#039;s Demi Trainer",
  color: "white",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-074.webp?250711",
  imgAlt: "Chuchu&#039;s Demi Trainer",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["chuatury panlunch"],
  ap: 3,
  hp: 1,
  text: "【Attack】Draw 1. Then, discard 1.",
  abilities: abilities,
};
