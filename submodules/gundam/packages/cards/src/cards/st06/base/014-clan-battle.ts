import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const st06ClanBattle014: BaseCard = {
  cardNumber: "ST06-014",
  name: "Clan Battle",
  type: "base",
  traits: ["clan", "stronghold"],
  id: "ST06-014",
  externalId: "gundam:st06-014",
  slug: "clan-battle-st06-014",
  displayName: "Clan Battle",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-014",
  printings: [
    {
      id: "ST06-014",
      collectorNumber: "ST06-014",
      cardNumber: "ST06-014",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-014.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-014_p1",
      collectorNumber: "ST06-014_p1",
      cardNumber: "ST06-014",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-014_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-014_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST06-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-014.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Activate･Main】Rest this Base：If a friendly (Clan) Link Unit is in play, choose 1 friendly Unit. It gets AP+2 during this turn.<br>",
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
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】Rest this Base：If a friendly (Clan) Link Unit is in play, choose 1 friendly Unit. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
