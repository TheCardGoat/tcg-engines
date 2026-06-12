import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04PalaSys094: PilotCard = {
  cardNumber: "GD04-094",
  name: "Pala Sys",
  type: "pilot",
  color: "purple",
  traits: ["satyricon", "vulture"],
  id: "GD04-094",
  externalId: "gundam:gd04-094",
  slug: "pala-sys-gd04-094",
  displayName: "Pala Sys",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-094",
  printings: [
    {
      id: "GD04-094",
      collectorNumber: "GD04-094",
      cardNumber: "GD04-094",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-094.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-094.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-094",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-094.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-094.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 purple Unit card with <Suppression> from your trash. Add it to your hand.",
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
              cardType: "unit",
              zone: "trash",
              count: 1,
              hasKeyword: "Suppression",
              attributeFilters: [
                {
                  attribute: "color",
                  comparison: "eq",
                  value: "purple",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 purple Unit card with <Suppression> from your trash. Add it to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
