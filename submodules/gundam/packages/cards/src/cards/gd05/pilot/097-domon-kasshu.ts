import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05DomonKasshu097: PilotCard = {
  cardNumber: "GD05-097",
  name: "Domon Kasshu",
  type: "pilot",
  color: "white",
  traits: ["gundam fighter", "shuffle alliance"],
  id: "GD05-097",
  canonicalId: "GD05-097",
  externalIds: { bandai: "gundam:gd05-097" },
  slug: "domon-kasshu-gd05-097",
  displayName: "Domon Kasshu",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-097",
  printings: [
    {
      id: "GD05-097",
      artId: "GD05-097",
      setCode: "GD05",
      collectorNumber: "GD05-097",
      cardNumber: "GD05-097",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-097.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-097.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-097_p1",
      artId: "GD05-097_p1",
      setCode: "GD05",
      collectorNumber: "GD05-097_p1",
      cardNumber: "GD05-097",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-097_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-097_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-097", "GD05-097_p1"],
  selectedPrintingId: "GD05-097",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-097.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-097.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】Draw 1. Then, discard 1. If you discard a (Special Move) Command card with this effect, you may activate its 【Main】.",
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
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "drawThenDiscard",
            drawCount: 1,
            discardCount: 1,
            activateDiscardedCommand: {
              trait: "special move",
              timing: "main",
            },
          },
        },
      ],
      sourceText:
        "【When Paired】Draw 1. Then, discard 1. If you discard a (Special Move) Command card with this effect, you may activate its 【Main】.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
