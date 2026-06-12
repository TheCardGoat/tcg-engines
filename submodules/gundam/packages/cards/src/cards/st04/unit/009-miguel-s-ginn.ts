import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st04MiguelSGinn009: UnitCard = {
  cardNumber: "ST04-009",
  name: "Miguel's Ginn",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "ST04-009",
  externalId: "gundam:st04-009",
  slug: "miguel-s-ginn-st04-009",
  displayName: "Miguel's Ginn",
  set: { code: "ST04", name: "SEED Strike [ST04]", packageId: "616004" },
  printNumber: "ST04-009",
  printings: [
    {
      id: "ST04-009",
      collectorNumber: "ST04-009",
      cardNumber: "ST04-009",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-009.webp?260424",
      productName: "SEED Strike [ST04]",
    },
    {
      id: "ST04-009_p1",
      collectorNumber: "ST04-009_p1",
      cardNumber: "ST04-009",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04] Bonus Pack",
        packageId: "616004",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-009_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-009_p1.webp?260424",
      productName: "SEED Strike [ST04] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST04-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-009.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 1,
  effect: "【During Pair】【Destroyed】If you have another Link Unit in play, draw 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            isLinkUnit: true,
          },
          thenDirectives: [
            {
              action: {
                action: "draw",
                count: 1,
              },
            },
          ],
        },
      ],
      sourceText: "【During Pair】【Destroyed】If you have another Link Unit in play, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
