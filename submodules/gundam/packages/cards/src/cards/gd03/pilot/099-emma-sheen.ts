import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03EmmaSheen099: PilotCard = {
  cardNumber: "GD03-099",
  name: "Emma Sheen",
  type: "pilot",
  color: "white",
  traits: ["aeug"],
  id: "GD03-099",
  externalId: "gundam:gd03-099",
  slug: "emma-sheen-gd03-099",
  displayName: "Emma Sheen",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-099",
  printings: [
    {
      id: "GD03-099",
      collectorNumber: "GD03-099",
      cardNumber: "GD03-099",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-099.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-099.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-099",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-099.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-099.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Destroyed】If a friendly white Base is in play, choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Return it to its owner's hand.",
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
        conditions: [{ type: "duringLink" }, { type: "friendlyBaseInPlay", color: "white" }],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: { ref: "source", stat: "level" },
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Destroyed】If a friendly white Base is in play, choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
