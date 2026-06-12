import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01DuelGundam054: UnitCard = {
  cardNumber: "GD01-054",
  name: "Duel Gundam",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "GD01-054",
  externalId: "gundam:gd01-054",
  slug: "duel-gundam-gd01-054",
  displayName: "Duel Gundam",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-054",
  printings: [
    {
      id: "GD01-054",
      collectorNumber: "GD01-054",
      cardNumber: "GD01-054",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-054.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-054.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-054_p1",
      collectorNumber: "GD01-054_p1",
      cardNumber: "GD01-054",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-054_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-054_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "GD01-054",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-054.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-054.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  effect:
    "While this Unit has 5 or more AP, it gains &lt;Breach 3&gt;.<br>\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "selfStat",
            stat: "ap",
            comparison: "gte",
            value: 5,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While this Unit has 5 or more AP, it gains <Breach 3>. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
