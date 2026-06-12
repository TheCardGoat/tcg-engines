import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const st03Rewloola015: BaseCard = {
  cardNumber: "ST03-015",
  name: "Rewloola",
  type: "base",
  traits: ["neo zeon", "warship"],
  id: "ST03-015",
  externalId: "gundam:st03-015",
  slug: "rewloola-st03-015",
  displayName: "Rewloola",
  set: { code: "ST03", name: "Zeon's Rush [ST03]", packageId: "616003" },
  printNumber: "ST03-015",
  printings: [
    {
      id: "ST03-015",
      collectorNumber: "ST03-015",
      cardNumber: "ST03-015",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-015.webp?260424",
      productName: "Zeon's Rush [ST03]",
    },
    {
      id: "ST03-015_p1",
      collectorNumber: "ST03-015_p1",
      cardNumber: "ST03-015",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03] Bonus Pack",
        packageId: "616003",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-015_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-015_p1.webp?260424",
      productName: "Zeon's Rush [ST03] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST03-015",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-015.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-015.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.<br>",
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
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 5 }],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
