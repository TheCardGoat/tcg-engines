import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const betaGuncannon004: UnitCard = {
  cardNumber: "GD01-004",
  name: "Guncannon",
  type: "unit",
  color: "blue",
  traits: ["earth federation", "white base team"],
  id: "GD01-004_p1",
  externalId: "gundam:gd01-004_p1",
  slug: "guncannon-gd01-004-p1",
  displayName: "Guncannon",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-004_p1",
  printings: [
    {
      id: "GD01-004",
      collectorNumber: "GD01-004",
      cardNumber: "GD01-004",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-004.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-004.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-004_p1",
      collectorNumber: "GD01-004_p1",
      cardNumber: "GD01-004",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-004_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-004_p1.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "GD01-004_p2",
      collectorNumber: "GD01-004_p2",
      cardNumber: "GD01-004",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-004_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-004_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-004_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-004_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-004_p1.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect:
    "&lt;Repair 1&gt; (At the end of your turn, this Unit recovers the specified number of HP.)<br>【When Paired】Choose 1 enemy Unit with 2 or less HP. Rest it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "rest",
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
      sourceText: "【When Paired】Choose 1 enemy Unit with 2 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Repair", value: 1 }],
  rarity: "rare",
};
