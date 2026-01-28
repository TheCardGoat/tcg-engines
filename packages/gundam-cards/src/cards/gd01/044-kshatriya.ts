import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Kshatriya: UnitCardDefinition = {
  id: "gd01-044",
  name: "Kshatriya",
  cardNumber: "GD01-044",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "red",
  level: 5,
  cost: 4,
  text: "【When Paired･(Cyber-Newtype)/(Newtype) Pilot】Choose 1 to 2 enemy Units. Deal 1 damage to them.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-044.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 5,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["neo", "zeon"],
  linkRequirements: ["marida-cruz"],
  effects: [
    {
      id: "eff-8hvi48gy5",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      description: "Choose 1 to 2 enemy Units. Deal 1 damage to them.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 1,
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [],
        },
      },
    },
  ],
};
