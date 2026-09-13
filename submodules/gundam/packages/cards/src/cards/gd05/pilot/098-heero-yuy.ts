import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05HeeroYuy098: PilotCard = {
  cardNumber: "GD05-098",
  name: "Heero Yuy",
  type: "pilot",
  color: "white",
  traits: ["g team", "operation meteor"],
  id: "GD05-098",
  canonicalId: "GD05-098",
  externalIds: { bandai: "gundam:gd05-098" },
  slug: "heero-yuy-gd05-098",
  displayName: "Heero Yuy",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-098",
  printings: [
    {
      id: "GD05-098",
      artId: "GD05-098",
      setCode: "GD05",
      collectorNumber: "GD05-098",
      cardNumber: "GD05-098",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-098.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-098.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-098_p1",
      artId: "GD05-098_p1",
      setCode: "GD05",
      collectorNumber: "GD05-098_p1",
      cardNumber: "GD05-098",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-098_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-098_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-098", "GD05-098_p1"],
  selectedPrintingId: "GD05-098",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-098.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-098.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\nWhen this Unit destroys an enemy shield area card with damage, choose 1 enemy Unit. It gets AP-2 during this turn.",
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
        timing: ["onShieldAreaCardDestroyByBattle"],
        conditions: [
          {
            type: "eventCardIsSelf",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "When this Unit destroys an enemy shield area card with damage, choose 1 enemy Unit. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
