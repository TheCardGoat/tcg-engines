import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st07GundamDynames005: UnitCard = {
  cardNumber: "ST07-005",
  name: "Gundam Dynames",
  type: "unit",
  color: "green",
  traits: ["cb", "gn drive"],
  id: "ST07-005",
  externalId: "gundam:st07-005",
  slug: "gundam-dynames-st07-005",
  displayName: "Gundam Dynames",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-005",
  printings: [
    {
      id: "ST07-005",
      collectorNumber: "ST07-005",
      cardNumber: "ST07-005",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-005.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-005.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-005_p1",
      collectorNumber: "ST07-005_p1",
      cardNumber: "ST07-005",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-005_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-005_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
    {
      id: "ST07-005_p2",
      collectorNumber: "ST07-005_p2",
      cardNumber: "ST07-005",
      set: {
        code: "ST07",
        name: "Newtype Challenge 2026 Mission 2",
        packageId: "616901",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-005_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-005_p2.webp?260424",
      productName: "Newtype Challenge 2026 Mission 2",
    },
  ],
  selectedPrintingId: "ST07-005",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-005.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-005.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 2,
  hp: 4,
  linkCondition: "[Lockon Stratos]",
  effect:
    "During your turn, when this Unit destroys an enemy Unit with battle damage, this Unit recovers 2 HP.\n【During Link】This Unit gets AP+2.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle"],
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "During your turn, when this Unit destroys an enemy Unit with battle damage, this Unit recovers 2 HP.",
    },
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Link】This Unit gets AP+2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
