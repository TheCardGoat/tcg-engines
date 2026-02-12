import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamDeathscythe: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-033",
  cardType: "UNIT",
  color: "green",
  cost: 2,
  hp: 3,
  id: "gd01-033",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-033.webp?26013001",
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
  level: 4,
  linkRequirements: ["duo-maxwell"],
  name: "Gundam Deathscythe",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)",
  traits: ["operation", "meteor"],
  zones: ["earth"],
};
