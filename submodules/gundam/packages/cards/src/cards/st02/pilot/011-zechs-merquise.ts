import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st02ZechsMerquise011: PilotCard = {
  cardNumber: "ST02-011",
  name: "Zechs Merquise",
  type: "pilot",
  color: "blue",
  traits: ["oz"],
  id: "ST02-011",
  externalId: "gundam:st02-011",
  slug: "zechs-merquise-st02-011",
  displayName: "Zechs Merquise",
  set: { code: "ST02", name: "Wings of Advance [ST02]", packageId: "616002" },
  printNumber: "ST02-011",
  printings: [
    {
      id: "ST02-011",
      collectorNumber: "ST02-011",
      cardNumber: "ST02-011",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02]",
        packageId: "616002",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-011.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-011.webp?260424",
      productName: "Wings of Advance [ST02]",
    },
    {
      id: "ST02-011_p1",
      collectorNumber: "ST02-011_p1",
      cardNumber: "ST02-011",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02] Bonus Pack",
        packageId: "616002",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-011_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-011_p1.webp?260424",
      productName: "Wings of Advance [ST02] Bonus Pack",
    },
    {
      id: "ST02-011_p2",
      collectorNumber: "ST02-011_p2",
      cardNumber: "ST02-011",
      set: {
        code: "ST02",
        name: "Championship Participation Pack 01",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-011_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-011_p2.webp?260424",
      productName: "Championship Participation Pack 01",
    },
  ],
  selectedPrintingId: "ST02-011",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-011.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-011.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, draw 1.<br>",
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
        timing: ["destroyed"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText:
        "【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
