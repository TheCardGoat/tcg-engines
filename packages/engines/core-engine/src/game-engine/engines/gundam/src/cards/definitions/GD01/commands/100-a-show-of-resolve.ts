import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "draw",
        amount: 2,
      },
    ],
    trigger: {
      event: "main",
    },
    text: "【main】",
  },
];

export const aShowOfResolve: GundamitoCommandCard = {
  id: "GD01-100",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 100,
  name: "A Show of Resolve",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-100.webp?250711",
  imgAlt: "A Show of Resolve",
  type: "command",
  text: "【Main】Draw 2.",
  abilities: abilities,
};
