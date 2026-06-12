import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01BlitzGundam049: UnitCard = {
  cardNumber: "GD01-049",
  name: "Blitz Gundam",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "GD01-049",
  externalId: "gundam:gd01-049",
  slug: "blitz-gundam-gd01-049",
  displayName: "Blitz Gundam",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-049",
  printings: [
    {
      id: "GD01-049",
      collectorNumber: "GD01-049",
      cardNumber: "GD01-049",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-049.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-049.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-049_p1",
      collectorNumber: "GD01-049_p1",
      cardNumber: "GD01-049",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-049_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-049_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "GD01-049",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-049.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-049.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 3,
  effect:
    "【Deploy】Choose 1 of your (ZAFT) Units with 5 or more AP. It gains &lt;First Strike&gt; during this turn.<br>\n(While this Unit is attacking, it deals damage before the enemy Unit.)<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "zaft" },
                { attribute: "ap", comparison: "gte", value: 5 },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your (ZAFT) Units with 5 or more AP. It gains <First Strike> during this turn.",
    },
  ] satisfies CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
