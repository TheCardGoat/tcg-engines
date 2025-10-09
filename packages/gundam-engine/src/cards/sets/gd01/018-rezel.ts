import type { UnitCardDefinition } from "../../card-types";

export const Rezel: UnitCardDefinition = {
  id: "gd01-018",
  name: "ReZEL",
  cardNumber: "GD01-018",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-018.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "federation"],
  linkRequirements: ["-"],
  abilities: [
    {
      description: "-",
      effect: {
        type: "UNKNOWN",
        rawText: "-",
      },
    },
  ],
};
