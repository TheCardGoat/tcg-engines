import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const st04Vesalius016: BaseCard = {
  cardNumber: "ST04-016",
  name: "Vesalius",
  type: "base",
  traits: ["zaft", "warship"],
  id: "ST04-016",
  externalId: "gundam:st04-016",
  slug: "vesalius-st04-016",
  displayName: "Vesalius",
  set: { code: "ST04", name: "SEED Strike [ST04]", packageId: "616004" },
  printNumber: "ST04-016",
  printings: [
    {
      id: "ST04-016",
      collectorNumber: "ST04-016",
      cardNumber: "ST04-016",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-016.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-016.webp?260424",
      productName: "SEED Strike [ST04]",
    },
    {
      id: "ST04-016_p1",
      collectorNumber: "ST04-016_p1",
      cardNumber: "ST04-016",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04] Bonus Pack",
        packageId: "616004",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-016_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-016_p1.webp?260424",
      productName: "SEED Strike [ST04] Bonus Pack",
    },
    {
      id: "ST04-016_p2",
      collectorNumber: "ST04-016_p2",
      cardNumber: "ST04-016",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-016_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-016_p2.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "ST04-016",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-016.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-016.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Activate･Main】Rest this Base：Choose 1 friendly Unit. It gets AP+1 during this turn.<br>",
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
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】Rest this Base：Choose 1 friendly Unit. It gets AP+1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
