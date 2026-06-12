import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st07GundamKyrios007: UnitCard = {
  cardNumber: "ST07-007",
  name: "Gundam Kyrios",
  type: "unit",
  color: "green",
  traits: ["cb", "gn drive"],
  id: "ST07-007",
  externalId: "gundam:st07-007",
  slug: "gundam-kyrios-st07-007",
  displayName: "Gundam Kyrios",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-007",
  printings: [
    {
      id: "ST07-007",
      collectorNumber: "ST07-007",
      cardNumber: "ST07-007",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-007.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-007.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-007_p1",
      collectorNumber: "ST07-007_p1",
      cardNumber: "ST07-007",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-007_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-007_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST07-007",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-007.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-007.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  linkCondition: "[Allelujah Haptism] / [Hallelujah Haptism]",
  effect: "During your turn, while you have a (CB) Pilot in play, this Unit gets AP+2.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "pilot",
            comparison: "gte",
            count: 1,
            hasTrait: "cb",
          },
        ],
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
      sourceText: "During your turn, while you have a (CB) Pilot in play, this Unit gets AP+2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
