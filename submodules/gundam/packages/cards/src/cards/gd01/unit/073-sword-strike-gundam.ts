import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01SwordStrikeGundam073: UnitCard = {
  cardNumber: "GD01-073",
  name: "Sword Strike Gundam",
  type: "unit",
  color: "white",
  traits: ["earth alliance"],
  id: "GD01-073",
  externalId: "gundam:gd01-073",
  slug: "sword-strike-gundam-gd01-073",
  displayName: "Sword Strike Gundam",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-073",
  printings: [
    {
      id: "GD01-073",
      collectorNumber: "GD01-073",
      cardNumber: "GD01-073",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-073.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-073.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-073",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-073.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-073.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  effect:
    "【During Link】【Attack】Choose 1 enemy Unit with 2 or less HP. Return it to its owner's hand.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Attack】Choose 1 enemy Unit with 2 or less HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
