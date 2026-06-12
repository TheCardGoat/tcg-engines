import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03ChristinaMackenzie085: PilotCard = {
  cardNumber: "GD03-085",
  name: "Christina Mackenzie",
  type: "pilot",
  color: "blue",
  traits: ["earth federation"],
  id: "GD03-085",
  externalId: "gundam:gd03-085",
  slug: "christina-mackenzie-gd03-085",
  displayName: "Christina Mackenzie",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-085",
  printings: [
    {
      id: "GD03-085",
      collectorNumber: "GD03-085",
      cardNumber: "GD03-085",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-085.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-085.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-085",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-085.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-085.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    '【Burst】Add this card to your hand.\nWhen playing this card from your hand and pairing it with a Unit with "Gundam NT-1" in its card name, play this card as if it has 0 cost.',
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
      sourceText:
        '【Burst】Add this card to your hand. When playing this card from your hand and pairing it with a Unit with "Gundam NT-1" in its card name, play this card as if it has 0 cost.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
