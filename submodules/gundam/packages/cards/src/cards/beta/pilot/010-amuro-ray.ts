import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const betaAmuroRay010: PilotCard = {
  cardNumber: "ST01-010",
  name: "Amuro Ray",
  type: "pilot",
  color: "blue",
  traits: ["earth federation", "white base team", "newtype"],
  id: "ST01-010_p2",
  externalId: "gundam:st01-010_p2",
  slug: "amuro-ray-st01-010-p2",
  displayName: "Amuro Ray",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "ST01-010_p2",
  printings: [
    {
      id: "ST01-010",
      collectorNumber: "ST01-010",
      cardNumber: "ST01-010",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01]",
        packageId: "616001",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-010.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-010.webp?260424",
      productName: "Heroic Beginnings [ST01]",
    },
    {
      id: "ST01-010_p1",
      collectorNumber: "ST01-010_p1",
      cardNumber: "ST01-010",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01] Bonus Pack",
        packageId: "616001",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-010_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-010_p1.webp?260424",
      productName: "Heroic Beginnings [ST01] Bonus Pack",
    },
    {
      id: "ST01-010_p2",
      collectorNumber: "ST01-010_p2",
      cardNumber: "ST01-010",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST01-010_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-010_p2.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "ST01-010_p3",
      collectorNumber: "ST01-010_p3",
      cardNumber: "ST01-010",
      set: {
        code: "ST01",
        name: "WORLD CHAMPIONSHIPS 25-26 REGIONAL CHAMPIONSHIPS Participation Card",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-010_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-010_p3.webp?260424",
      productName: "WORLD CHAMPIONSHIPS 25-26 REGIONAL CHAMPIONSHIPS Participation Card",
    },
  ],
  selectedPrintingId: "ST01-010_p2",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST01-010_p2.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-010_p2.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【When Paired】Choose 1 enemy Unit with 5 or less HP. Rest it.<br>",
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
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 5,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Paired】Choose 1 enemy Unit with 5 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
