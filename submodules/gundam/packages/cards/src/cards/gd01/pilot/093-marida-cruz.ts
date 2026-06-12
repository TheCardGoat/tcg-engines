import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd01MaridaCruz093: PilotCard = {
  cardNumber: "GD01-093",
  name: "Marida Cruz",
  type: "pilot",
  color: "red",
  traits: ["neo zeon", "cyber-newtype"],
  id: "GD01-093",
  externalId: "gundam:gd01-093",
  slug: "marida-cruz-gd01-093",
  displayName: "Marida Cruz",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-093",
  printings: [
    {
      id: "GD01-093",
      collectorNumber: "GD01-093",
      cardNumber: "GD01-093",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-093.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-093.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-093_p1",
      collectorNumber: "GD01-093_p1",
      cardNumber: "GD01-093",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-093_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-093_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-093",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-093.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-093.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【During Link】【Attack】Choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "addSelfToHand" } }],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: { timing: ["attack"], conditions: [{ type: "duringLink" }] },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: { ref: "source", stat: "level" },
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Attack】Choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
