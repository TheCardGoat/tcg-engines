import type { UnitCardDefinition } from "../../card-types";

export const Zaku: UnitCardDefinition = {
  id: "gd01-035",
  name: "Zaku Ⅱ",
  cardNumber: "GD01-035",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 2,
  cost: 1,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-035.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 2,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["zeon"],
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
