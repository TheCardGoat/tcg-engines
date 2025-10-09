import type { UnitCardDefinition } from "../../card-types";

export const Skygrasper: UnitCardDefinition = {
  id: "gd01-079",
  name: "Skygrasper",
  cardNumber: "GD01-079",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-079.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 2,
  zones: ["earth"],
  traits: ["earth", "alliance"],
  linkRequirements: ["(earth-alliance)-trait"],
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
