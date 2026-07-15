import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamLfrith: UnitCardDefinition = {
  ap: 2,
  cardNumber: "GD01-086",
  cardType: "UNIT",
  color: "white",
  cost: 2,
  hp: 4,
  id: "gd01-086",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-086.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 3,
  linkRequirements: ["-"],
  name: "Gundam Lfrith",
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  traits: ["vanadis", "institute"],
  zones: ["space", "earth"],
};
