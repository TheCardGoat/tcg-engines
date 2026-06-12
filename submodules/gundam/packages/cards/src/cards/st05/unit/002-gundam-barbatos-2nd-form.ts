import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st05GundamBarbatos2ndForm002: UnitCard = {
  cardNumber: "ST05-002",
  name: "Gundam Barbatos 2nd Form",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "ST05-002",
  externalId: "gundam:st05-002",
  slug: "gundam-barbatos-2nd-form-st05-002",
  displayName: "Gundam Barbatos 2nd Form",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-002",
  printings: [
    {
      id: "ST05-002",
      collectorNumber: "ST05-002",
      cardNumber: "ST05-002",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-002.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-002.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-002_p1",
      collectorNumber: "ST05-002_p1",
      cardNumber: "ST05-002",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-002_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-002_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
    {
      id: "ST05-002_p2",
      collectorNumber: "ST05-002_p2",
      cardNumber: "ST05-002",
      set: {
        code: "ST05",
        name: "[ST05] Starter Deck Release Event",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-002_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-002_p2.webp?260424",
      productName: "[ST05] Starter Deck Release Event",
    },
    {
      id: "ST05-002_p3",
      collectorNumber: "ST05-002_p3",
      cardNumber: "ST05-002",
      set: {
        code: "EVX05",
        name: "Premium Card Collection [EVX05]",
        packageId: "616701",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-002_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-002_p3.webp?260424",
      productName: "Premium Card Collection [EVX05]",
    },
  ],
  selectedPrintingId: "ST05-002",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-002.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-002.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 2,
  hp: 4,
  effect: "While this Unit is damaged, it gets AP+2.<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "selfIsDamaged",
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
            },
          },
        },
      ],
      sourceText: "While this Unit is damaged, it gets AP+2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
