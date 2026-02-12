import type { UnitCardDefinition } from "@tcg/gundam-types";

export const ShenlongGundam: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-041",
  cardType: "UNIT",
  color: "green",
  cost: 3,
  hp: 3,
  id: "gd01-041",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-041.webp?26013001",
  keywords: [
    {
      keyword: "Breach",
      value: 3,
    },
  ],
  level: 4,
  linkRequirements: ["chang-wufei"],
  name: "Shenlong Gundam",
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "<Breach 3> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  traits: ["operation", "meteor"],
  zones: ["earth"],
};
