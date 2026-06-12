import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st02GundamHeavyarms003: UnitCard = {
  cardNumber: "ST02-003",
  name: "Gundam Heavyarms",
  type: "unit",
  color: "green",
  traits: ["operation meteor"],
  id: "ST02-003",
  externalId: "gundam:st02-003",
  slug: "gundam-heavyarms-st02-003",
  displayName: "Gundam Heavyarms",
  set: { code: "ST02", name: "Wings of Advance [ST02]", packageId: "616002" },
  printNumber: "ST02-003",
  printings: [
    {
      id: "ST02-003",
      collectorNumber: "ST02-003",
      cardNumber: "ST02-003",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02]",
        packageId: "616002",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-003.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-003.webp?260424",
      productName: "Wings of Advance [ST02]",
    },
    {
      id: "ST02-003_p1",
      collectorNumber: "ST02-003_p1",
      cardNumber: "ST02-003",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02] Bonus Pack",
        packageId: "616002",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-003_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-003_p1.webp?260424",
      productName: "Wings of Advance [ST02] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST02-003",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-003.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-003.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 3,
  hp: 4,
  effect:
    "【During Pair】During your turn, when this Unit destroys an enemy Unit with battle damage, deal 1 damage to all enemy Units that are Lv.3 or lower.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Pair】During your turn, when this Unit destroys an enemy Unit with battle damage, deal 1 damage to all enemy Units that are Lv.3 or lower.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
