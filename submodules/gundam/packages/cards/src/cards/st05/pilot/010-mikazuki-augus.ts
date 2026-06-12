import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st05MikazukiAugus010: PilotCard = {
  cardNumber: "ST05-010",
  name: "Mikazuki Augus",
  type: "pilot",
  color: "purple",
  traits: ["tekkadan", "alaya-vijnana"],
  id: "ST05-010",
  externalId: "gundam:st05-010",
  slug: "mikazuki-augus-st05-010",
  displayName: "Mikazuki Augus",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-010",
  printings: [
    {
      id: "ST05-010",
      collectorNumber: "ST05-010",
      cardNumber: "ST05-010",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-010.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-010.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-010_p1",
      collectorNumber: "ST05-010_p1",
      cardNumber: "ST05-010",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-010_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-010_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
    {
      id: "ST05-010_p2",
      collectorNumber: "ST05-010_p2",
      cardNumber: "ST05-010",
      set: {
        code: "ST05",
        name: "Events",
        packageId: "616901",
      },
      rarity: "promo",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-010_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-010_p2.webp?260424",
      productName: "Events",
    },
    {
      id: "ST05-010_p3",
      collectorNumber: "ST05-010_p3",
      cardNumber: "ST05-010",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-010_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-010_p3.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "ST05-010",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-010.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-010.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【When Paired】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.<br>",
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
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Paired】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
