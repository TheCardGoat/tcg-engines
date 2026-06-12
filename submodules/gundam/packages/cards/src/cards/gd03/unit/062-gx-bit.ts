import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GxBit062: UnitCard = {
  cardNumber: "GD03-062",
  name: "GX-Bit",
  type: "unit",
  color: "purple",
  traits: ["old une", "vulture"],
  id: "GD03-062",
  externalId: "gundam:gd03-062",
  slug: "gx-bit-gd03-062",
  displayName: "GX-Bit",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-062",
  printings: [
    {
      id: "GD03-062",
      collectorNumber: "GD03-062",
      cardNumber: "GD03-062",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-062.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-062.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-062",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-062.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-062.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  effect:
    "【Deploy】If you deploy this Unit from your trash, choose 1 enemy Unit with 4 or less AP. Deal 2 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "deployedFromZone", zone: "trash" }],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 4 }],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If you deploy this Unit from your trash, choose 1 enemy Unit with 4 or less AP. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
