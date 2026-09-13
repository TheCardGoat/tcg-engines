import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st07GundamKyrios007: UnitCard = {
  cardNumber: "ST07-007",
  name: "Gundam Kyrios",
  type: "unit",
  color: "green",
  traits: ["cb", "gn drive"],
  id: "ST07-007",
  canonicalId: "ST07-007",
  externalIds: { bandai: "gundam:st07-007" },
  slug: "gundam-kyrios/st07-007",
  displayName: "Gundam Kyrios",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-007",
  printings: [
    {
      id: "ST07-007",
      artId: "ST07-007",
      setCode: "ST07",
      collectorNumber: "ST07-007",
      cardNumber: "ST07-007",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st07/ST07-007.webp",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-007_p1",
      artId: "ST07-007_p1",
      setCode: "ST07",
      collectorNumber: "ST07-007_p1",
      cardNumber: "ST07-007",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st07/ST07-007_p1.webp",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
  ],
  reprints: ["ST07-007", "ST07-007_p1"],
  selectedPrintingId: "ST07-007",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st07/ST07-007.webp",
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
