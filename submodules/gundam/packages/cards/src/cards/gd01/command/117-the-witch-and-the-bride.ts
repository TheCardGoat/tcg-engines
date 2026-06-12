import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01TheWitchAndTheBride117: CommandCard = {
  cardNumber: "GD01-117",
  name: "The Witch and the Bride",
  type: "command",
  color: "white",
  traits: ["-"],
  id: "GD01-117",
  externalId: "gundam:gd01-117",
  slug: "the-witch-and-the-bride-gd01-117",
  displayName: "The Witch and the Bride",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-117",
  printings: [
    {
      id: "GD01-117",
      collectorNumber: "GD01-117",
      cardNumber: "GD01-117",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-117.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-117.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-117_p1",
      collectorNumber: "GD01-117_p1",
      cardNumber: "GD01-117",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-117_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-117_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-117_p2",
      collectorNumber: "GD01-117_p2",
      cardNumber: "GD01-117",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-117_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-117_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-117",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-117.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-117.webp?260424",
  legality: "legal",
  level: 5,
  cost: 2,
  effect:
    "【Burst】Activate this card's 【Main】.<br>【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "activateTiming",
            timing: "main",
          },
        },
      ],
      sourceText: "【Burst】Activate this card's 【Main】.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
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
                  value: 5,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
