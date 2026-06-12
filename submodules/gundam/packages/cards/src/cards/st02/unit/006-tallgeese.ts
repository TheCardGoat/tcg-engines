import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st02Tallgeese006: UnitCard = {
  cardNumber: "ST02-006",
  name: "Tallgeese",
  type: "unit",
  color: "blue",
  traits: ["oz"],
  id: "ST02-006",
  externalId: "gundam:st02-006",
  slug: "tallgeese-st02-006",
  displayName: "Tallgeese",
  set: { code: "ST02", name: "Wings of Advance [ST02]", packageId: "616002" },
  printNumber: "ST02-006",
  printings: [
    {
      id: "ST02-006",
      collectorNumber: "ST02-006",
      cardNumber: "ST02-006",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02]",
        packageId: "616002",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-006.webp?260424",
      productName: "Wings of Advance [ST02]",
    },
    {
      id: "ST02-006_p1",
      collectorNumber: "ST02-006_p1",
      cardNumber: "ST02-006",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02] Bonus Pack",
        packageId: "616002",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-006_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-006_p1.webp?260424",
      productName: "Wings of Advance [ST02] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST02-006",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-006.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Zechs Merquise]",
  effect: "【Activate･Main】【Once per Turn】④：Set this Unit as active.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        payResources: 4,
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "self",
              cardType: "unit",
              state: "rested",
            },
          },
        },
      ],
      sourceText: "【Activate·Main】【Once per Turn】④：Set this Unit as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
