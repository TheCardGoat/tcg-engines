import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st07LockonStratosNeil011: PilotCard = {
  cardNumber: "ST07-011",
  name: "Lockon Stratos (Neil)",
  type: "pilot",
  color: "green",
  traits: ["cb"],
  id: "ST07-011",
  externalId: "gundam:st07-011",
  slug: "lockon-stratos-neil-st07-011",
  displayName: "Lockon Stratos (Neil)",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-011",
  printings: [
    {
      id: "ST07-011",
      collectorNumber: "ST07-011",
      cardNumber: "ST07-011",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-011.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-011.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-011_p1",
      collectorNumber: "ST07-011_p1",
      cardNumber: "ST07-011",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-011_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-011_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
    {
      id: "ST07-011_p2",
      collectorNumber: "ST07-011_p2",
      cardNumber: "ST07-011",
      set: {
        code: "ST07",
        name: "Newtype Challenge 2026 Mission 2",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-011_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-011_p2.webp?260424",
      productName: "Newtype Challenge 2026 Mission 2",
    },
  ],
  selectedPrintingId: "ST07-011",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-011.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-011.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】If this is a (CB) Unit, it may choose an active enemy Unit whose Lv. is equal to or lower than this Unit as its attack target during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              count: 1,
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: {
                    ref: "source",
                    stat: "level",
                  },
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【When Paired】If this is a (CB) Unit, it may choose an active enemy Unit whose Lv. is equal to or lower than this Unit as its attack target during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
