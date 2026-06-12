import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st07GundamExia001: UnitCard = {
  cardNumber: "ST07-001",
  name: "Gundam Exia",
  type: "unit",
  color: "purple",
  traits: ["cb", "gn drive"],
  id: "ST07-001",
  externalId: "gundam:st07-001",
  slug: "gundam-exia-st07-001",
  displayName: "Gundam Exia",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-001",
  printings: [
    {
      id: "ST07-001",
      collectorNumber: "ST07-001",
      cardNumber: "ST07-001",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-001.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-001_p1",
      collectorNumber: "ST07-001_p1",
      cardNumber: "ST07-001",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-001_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST07-001",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-001.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Setsuna F. Seiei]",
  effect:
    "At the end of your turn, if there are 7 or more (CB) cards in your trash, choose 1 of your Resources. Set it as active.\n【When Paired】Place the top 2 cards of your deck into your trash. If you place a (CB) card with this effect, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "millDeckThenDrawIfTrait",
            count: 2,
            trait: "cb",
            drawCount: 1,
          },
        },
      ],
      sourceText:
        "【When Paired】Place the top 2 cards of your deck into your trash. If you place a (CB) card with this effect, draw 1.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["endOfTurn"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 7,
            hasTrait: "cb",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              zone: "resourceArea",
              state: "rested",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "At the end of your turn, if there are 7 or more (CB) cards in your trash, choose 1 of your Resources. Set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
