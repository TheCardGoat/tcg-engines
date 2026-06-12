import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03RauLeCreuset091: PilotCard = {
  cardNumber: "GD03-091",
  name: "Rau Le Creuset",
  type: "pilot",
  color: "red",
  traits: ["zaft"],
  id: "GD03-091",
  externalId: "gundam:gd03-091",
  slug: "rau-le-creuset-gd03-091",
  displayName: "Rau Le Creuset",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-091",
  printings: [
    {
      id: "GD03-091",
      collectorNumber: "GD03-091",
      cardNumber: "GD03-091",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-091.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-091.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-091_p1",
      collectorNumber: "GD03-091_p1",
      cardNumber: "GD03-091",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-091_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-091_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-091",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-091.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-091.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 (ZAFT) Base card from your trash. Add it to your hand.",
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
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "base",
              zone: "trash",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "zaft" }],
            },
          },
        },
      ],
      sourceText: "【When Linked】Choose 1 (ZAFT) Base card from your trash. Add it to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
