import type { UnitCardDefinition } from "@tcg/gundam-types";

export const ShenlongGundam: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-029",
  cardType: "UNIT",
  color: "green",
  cost: 4,
  hp: 4,
  id: "gd01-029",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-029.webp?26013001",
  keywords: [
    {
      keyword: "Breach",
      value: 4,
    },
    {
      keyword: "Blocker",
    },
  ],
  level: 5,
  linkRequirements: ["chang-wufei"],
  name: "Shenlong Gundam",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "<Breach 4> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)\n【Attack】Choose 1 enemy Unit with <Blocker> that is Lv.3 or lower. Destroy it.",
  traits: ["operation", "meteor"],
  zones: ["earth"],
};
