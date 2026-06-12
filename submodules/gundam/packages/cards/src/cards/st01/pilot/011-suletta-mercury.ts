import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st01SulettaMercury011: PilotCard = {
  cardNumber: "ST01-011",
  name: "Suletta Mercury",
  type: "pilot",
  color: "white",
  traits: ["academy"],
  id: "ST01-011",
  externalId: "gundam:st01-011",
  slug: "suletta-mercury-st01-011",
  displayName: "Suletta Mercury",
  set: { code: "ST01", name: "Heroic Beginnings [ST01]", packageId: "616001" },
  printNumber: "ST01-011",
  printings: [
    {
      id: "ST01-011",
      collectorNumber: "ST01-011",
      cardNumber: "ST01-011",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01]",
        packageId: "616001",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-011.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-011.webp?260424",
      productName: "Heroic Beginnings [ST01]",
    },
    {
      id: "ST01-011_p1",
      collectorNumber: "ST01-011_p1",
      cardNumber: "ST01-011",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01] Bonus Pack",
        packageId: "616001",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-011_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-011_p1.webp?260424",
      productName: "Heroic Beginnings [ST01] Bonus Pack",
    },
    {
      id: "ST01-011_p2",
      collectorNumber: "ST01-011_p2",
      cardNumber: "ST01-011",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST01-011_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-011_p2.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "ST01-011_p3",
      collectorNumber: "ST01-011_p3",
      cardNumber: "ST01-011",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST01-011_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-011_p3.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "ST01-011_p4",
      collectorNumber: "ST01-011_p4",
      cardNumber: "ST01-011",
      set: {
        code: "ST01",
        name: "Newtype Challenge 2025 Mission1",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-011_p4.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-011_p4.webp?260424",
      productName: "Newtype Challenge 2025 Mission1",
    },
  ],
  selectedPrintingId: "ST01-011",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-011.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-011.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.<br>【Attack】【Once per Turn】Choose 1 of your Resources. Set it as active.<br>",
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
        timing: ["attack"],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "resource",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Attack】【Once per Turn】Choose 1 of your Resources. Set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
