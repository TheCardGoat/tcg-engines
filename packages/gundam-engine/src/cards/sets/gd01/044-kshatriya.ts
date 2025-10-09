import type { UnitCardDefinition } from "../../card-types";

export const Kshatriya_GD01_044: UnitCardDefinition = {
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
  abilities: [
    {
      description:
        "【When Paired･(Cyber-Newtype)/(Newtype) Pilot】Choose 1 to 2 enemy Units. Deal 1 damage to them.",
      effect: {
        type: "DAMAGE",
        amount: 1,
        target: {
          type: "unknown",
          rawText: "them",
        },
      },
    },
  ],
};
