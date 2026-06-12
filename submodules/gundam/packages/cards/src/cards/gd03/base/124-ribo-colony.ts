import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03RiboColony124: BaseCard = {
  cardNumber: "GD03-124",
  name: "Ribo Colony",
  type: "base",
  traits: ["earth federation", "stronghold"],
  id: "GD03-124",
  externalId: "gundam:gd03-124",
  slug: "ribo-colony-gd03-124",
  displayName: "Ribo Colony",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-124",
  printings: [
    {
      id: "GD03-124",
      collectorNumber: "GD03-124",
      cardNumber: "GD03-124",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-124.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-124.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-124",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-124.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-124.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\n【Once per Turn】When you pair a Pilot that is Lv.3 or lower with one of your Units, choose 1 enemy Unit with 3 or less HP. Rest it.",
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
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: { attribute: "level", comparison: "lte", value: 3 },
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 3 }],
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】When you pair a Pilot that is Lv.3 or lower with one of your Units, choose 1 enemy Unit with 3 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
