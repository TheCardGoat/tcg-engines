import type { UnitCardDefinition } from "../../card-types";

export const Noin039sAries: UnitCardDefinition = {
  id: "gd01-007",
  name: "Noin&#039;s Aries",
  cardNumber: "GD01-007",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "blue",
  level: 3,
  cost: 3,
  text: "【Destroyed】If you have another (OZ) Unit in play, draw 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-007.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 2,
  hp: 3,
  zones: ["earth"],
  traits: ["oz"],
  linkRequirements: ["lucrezia-noin"],
  abilities: [
    {
      trigger: "ON_DESTROY",
      description:
        "【Destroyed】 If you have another (OZ) Unit in play, draw 1.",
      effect: {
        type: "UNKNOWN",
        rawText: "If you have another (OZ) Unit in play, draw 1.",
      },
    },
  ],
};
