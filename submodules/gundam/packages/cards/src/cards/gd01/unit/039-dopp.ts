import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Dopp039: UnitCard = {
  cardNumber: "GD01-039",
  name: "Dopp",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD01-039",
  externalId: "gundam:gd01-039",
  slug: "dopp-gd01-039",
  displayName: "Dopp",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-039",
  printings: [
    {
      id: "GD01-039",
      collectorNumber: "GD01-039",
      cardNumber: "GD01-039",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-039.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-039.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-039",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-039.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-039.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  ap: 1,
  hp: 1,
  effect:
    "【Deploy】Look at the top card of your deck. Return it to the top or bottom of your deck.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 1,
            return: "topAndBottom",
          },
        },
      ],
      sourceText:
        "【Deploy】Look at the top card of your deck. Return it to the top or bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
