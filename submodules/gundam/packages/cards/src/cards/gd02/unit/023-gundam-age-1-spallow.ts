import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamAge1Spallow023: UnitCard = {
  cardNumber: "GD02-023",
  name: "Gundam AGE-1 Spallow",
  type: "unit",
  color: "green",
  traits: ["earth federation", "age system"],
  id: "GD02-023",
  externalId: "gundam:gd02-023",
  slug: "gundam-age-1-spallow-gd02-023",
  displayName: "Gundam AGE-1 Spallow",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-023",
  printings: [
    {
      id: "GD02-023",
      collectorNumber: "GD02-023",
      cardNumber: "GD02-023",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-023.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-023.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-023_p1",
      collectorNumber: "GD02-023_p1",
      cardNumber: "GD02-023",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-023_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-023_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-023",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-023.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-023.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  effect:
    "【During Link】While you are Lv.7 or higher, this Unit gains &lt;First Strike&gt;.<br>\n(While this Unit is attacking, it deals damage before the enemy Unit.)<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }, { type: "playerLevel", comparison: "gte", value: 7 }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Link】While you are Lv.7 or higher, this Unit gains <First Strike>. (While this Unit is attacking, it deals damage before the enemy Unit.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
