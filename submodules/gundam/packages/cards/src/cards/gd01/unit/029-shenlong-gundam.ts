import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01ShenlongGundam029: UnitCard = {
  cardNumber: "GD01-029",
  name: "Shenlong Gundam",
  type: "unit",
  color: "green",
  traits: ["operation meteor"],
  id: "GD01-029",
  externalId: "gundam:gd01-029",
  slug: "shenlong-gundam-gd01-029",
  displayName: "Shenlong Gundam",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-029",
  printings: [
    {
      id: "GD01-029",
      collectorNumber: "GD01-029",
      cardNumber: "GD01-029",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-029.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-029.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-029_p1",
      collectorNumber: "GD01-029_p1",
      cardNumber: "GD01-029",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-029_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-029_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-029",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-029.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-029.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  effect:
    "&lt;Breach 4&gt; (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>【Attack】Choose 1 enemy Unit with &lt;Blocker&gt; that is Lv.3 or lower. Destroy it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
              hasKeyword: "Blocker",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Attack】Choose 1 enemy Unit with <Blocker> that is Lv.3 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 4 }],
  rarity: "rare",
};
