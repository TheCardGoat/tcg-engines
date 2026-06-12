import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const st08Davao015: BaseCard = {
  cardNumber: "ST08-015",
  name: "Davao",
  type: "base",
  traits: ["earth federation", "stronghold"],
  id: "ST08-015",
  externalId: "gundam:st08-015",
  slug: "davao-st08-015",
  displayName: "Davao",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-015",
  printings: [
    {
      id: "ST08-015",
      collectorNumber: "ST08-015",
      cardNumber: "ST08-015",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-015.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-015_p1",
      collectorNumber: "ST08-015_p1",
      cardNumber: "ST08-015",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-015_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-015_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST08-015",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-015.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-015.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\n【Activate･Main】【Once per Turn】②：Choose 1 of your Units. It recovers 2 HP.",
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
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        payResources: 2,
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Activate·Main】【Once per Turn】②：Choose 1 of your Units. It recovers 2 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
