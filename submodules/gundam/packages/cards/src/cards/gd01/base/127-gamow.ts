import type { BaseCard, CardEffect } from "@tcg/gundam-types";

export const gd01Gamow127: BaseCard = {
  cardNumber: "GD01-127",
  name: "Gamow",
  type: "base",
  traits: ["zaft", "warship"],
  id: "GD01-127",
  externalId: "gundam:gd01-127",
  slug: "gamow-gd01-127",
  displayName: "Gamow",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-127",
  printings: [
    {
      id: "GD01-127",
      collectorNumber: "GD01-127",
      cardNumber: "GD01-127",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-127.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-127.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-127",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-127.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-127.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Activate･Action】Rest this Base：Choose 1 friendly (ZAFT) Unit with 5 or more AP. It gains &lt;Breach 3&gt; during this battle.<br>\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "deploySelf" } }],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [{ action: { action: "addShieldToHand", count: 1 } }],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "activated",
      activation: { timing: ["activate:action"] },
      cost: { restSelf: true },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "thisBattle",
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
        "【Activate･Action】Rest this Base：Choose 1 friendly (ZAFT) Unit with 5 or more AP. It gains <Breach 3> during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
