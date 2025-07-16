import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "discard",
        amount: 1,
        originalText: "discard 1.",
      },
    ],
    trigger: {
      event: "destroyed",
    },
    text: "【destroyed】",
  },
];

export const unicornGundamUnicornMode: GundamitoUnitCard = {
  id: "GD01-005",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 5,
  name: "Unicorn Gundam (Unicorn Mode)",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-005.webp?250711",
  imgAlt: "Unicorn Gundam (Unicorn Mode)",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["civilian"],
  linkRequirement: ["banagher links"],
  ap: 4,
  hp: 3,
  text: "【During Link】【Destroyed】Return this Unit&#039;s paired Pilot to its owner&#039;s hand. Then, discard 1.",
  abilities: abilities,
};
