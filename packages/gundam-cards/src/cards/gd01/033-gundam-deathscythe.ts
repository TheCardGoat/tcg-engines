import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamDeathscythe: UnitCardDefinition = {
  id: "gd01-033",
  name: "Gundam Deathscythe",
  cardNumber: "GD01-033",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "green",
  level: 4,
  cost: 2,
  text: "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-033.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 4,
  hp: 3,
  zones: ["earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["duo-maxwell"],
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
};
