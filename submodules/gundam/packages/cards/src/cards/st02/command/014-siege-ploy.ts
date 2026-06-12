import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st02SiegePloy014: CommandCard = {
  cardNumber: "ST02-014",
  name: "Siege Ploy",
  type: "command",
  color: "blue",
  traits: ["-"],
  id: "ST02-014",
  externalId: "gundam:st02-014",
  slug: "siege-ploy-st02-014",
  displayName: "Siege Ploy",
  set: { code: "ST02", name: "Wings of Advance [ST02]", packageId: "616002" },
  printNumber: "ST02-014",
  printings: [
    {
      id: "ST02-014",
      collectorNumber: "ST02-014",
      cardNumber: "ST02-014",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02]",
        packageId: "616002",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-014.webp?260424",
      productName: "Wings of Advance [ST02]",
    },
    {
      id: "ST02-014_p1",
      collectorNumber: "ST02-014_p1",
      cardNumber: "ST02-014",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02] Bonus Pack",
        packageId: "616002",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-014_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-014_p1.webp?260424",
      productName: "Wings of Advance [ST02] Bonus Pack",
    },
    {
      id: "ST02-014_p2",
      collectorNumber: "ST02-014_p2",
      cardNumber: "ST02-014",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-014_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-014_p2.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST02-014_p3",
      collectorNumber: "ST02-014_p3",
      cardNumber: "ST02-014",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-014_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-014_p3.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST02-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-014.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  effect:
    "【Burst】Activate this card's 【Main】.<br>【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Rest it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "activateTiming",
            timing: "main",
          },
        },
      ],
      sourceText: "【Burst】Activate this card's 【Main】.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
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
      sourceText: "【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
