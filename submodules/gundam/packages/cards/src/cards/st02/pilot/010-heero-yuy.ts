import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st02HeeroYuy010: PilotCard = {
  cardNumber: "ST02-010",
  name: "Heero Yuy",
  type: "pilot",
  color: "green",
  traits: ["operation meteor"],
  id: "ST02-010",
  externalId: "gundam:st02-010",
  slug: "heero-yuy-st02-010",
  displayName: "Heero Yuy",
  set: { code: "ST02", name: "Wings of Advance [ST02]", packageId: "616002" },
  printNumber: "ST02-010",
  printings: [
    {
      id: "ST02-010",
      collectorNumber: "ST02-010",
      cardNumber: "ST02-010",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02]",
        packageId: "616002",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-010.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-010.webp?260424",
      productName: "Wings of Advance [ST02]",
    },
    {
      id: "ST02-010_p1",
      collectorNumber: "ST02-010_p1",
      cardNumber: "ST02-010",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02] Bonus Pack",
        packageId: "616002",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-010_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-010_p1.webp?260424",
      productName: "Wings of Advance [ST02] Bonus Pack",
    },
    {
      id: "ST02-010_p2",
      collectorNumber: "ST02-010_p2",
      cardNumber: "ST02-010",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST02-010_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-010_p2.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "ST02-010_p3",
      collectorNumber: "ST02-010_p3",
      cardNumber: "ST02-010",
      set: {
        code: "ST02",
        name: "Championship Finalist Card 01",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-010_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-010_p3.webp?260424",
      productName: "Championship Finalist Card 01",
    },
    {
      id: "ST02-010_p4",
      collectorNumber: "ST02-010_p4",
      cardNumber: "ST02-010",
      set: {
        code: "PB01",
        name: "Premium Accessory Set -Mobile Suit Gundam Wing- [PB01]",
        packageId: "616701",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-010_p4.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-010_p4.webp?260424",
      productName: "Premium Accessory Set -Mobile Suit Gundam Wing- [PB01]",
    },
  ],
  selectedPrintingId: "ST02-010",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-010.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-010.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【During Link】This Unit gets AP+1 and HP+1.<br>",
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
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "hp",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Link】This Unit gets AP+1 and HP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
