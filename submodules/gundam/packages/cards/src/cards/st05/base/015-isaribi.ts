import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const st05Isaribi015: BaseCard = {
  cardNumber: "ST05-015",
  name: "Isaribi",
  type: "base",
  traits: ["tekkadan", "warship"],
  id: "ST05-015",
  externalId: "gundam:st05-015",
  slug: "isaribi-st05-015",
  displayName: "Isaribi",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-015",
  printings: [
    {
      id: "ST05-015",
      collectorNumber: "ST05-015",
      cardNumber: "ST05-015",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-015.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-015_p1",
      collectorNumber: "ST05-015_p1",
      cardNumber: "ST05-015",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-015_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-015_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
    {
      id: "ST05-015_p2",
      collectorNumber: "ST05-015_p2",
      cardNumber: "ST05-015",
      set: {
        code: "ST05",
        name: "NEWTYPE CHALLENGE 2026 MISSION 3 Participation Prize",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-015_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-015_p2.webp?260424",
      productName: "NEWTYPE CHALLENGE 2026 MISSION 3 Participation Prize",
    },
  ],
  selectedPrintingId: "ST05-015",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-015.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-015.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Activate･Main】Rest this Base：Choose 1 of your damaged Units. It gets AP+2 during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
      },
      cost: {
        restSelf: true,
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "damaged",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】Rest this Base：Choose 1 of your damaged Units. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
