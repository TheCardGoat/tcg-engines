import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03GrahamAker098: PilotCard = {
  cardNumber: "GD03-098",
  name: "Graham Aker",
  type: "pilot",
  color: "white",
  traits: ["superpower bloc", "un"],
  id: "GD03-098",
  externalId: "gundam:gd03-098",
  slug: "graham-aker-gd03-098",
  displayName: "Graham Aker",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-098",
  printings: [
    {
      id: "GD03-098",
      collectorNumber: "GD03-098",
      cardNumber: "GD03-098",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-098.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-098.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-098_p1",
      collectorNumber: "GD03-098_p1",
      cardNumber: "GD03-098",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-098_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-098_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-098",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-098.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-098.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】When this rested Unit is set as active by an effect, choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
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
        conditions: [{ type: "duringLink" }],
        timing: ["onSetActiveByEffect"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
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
        "【During Link】When this rested Unit is set as active by an effect, choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
