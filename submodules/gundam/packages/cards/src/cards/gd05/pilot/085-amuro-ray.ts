import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05AmuroRay085: PilotCard = {
  cardNumber: "GD05-085",
  name: "Amuro Ray",
  type: "pilot",
  color: "green",
  traits: ["earth federation", "londo bell", "newtype"],
  id: "GD05-085",
  canonicalId: "GD05-085",
  externalIds: { bandai: "gundam:gd05-085" },
  slug: "amuro-ray-gd05-085",
  displayName: "Amuro Ray",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-085",
  printings: [
    {
      id: "GD05-085",
      artId: "GD05-085",
      setCode: "GD05",
      collectorNumber: "GD05-085",
      cardNumber: "GD05-085",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-085.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-085.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-085_p1",
      artId: "GD05-085_p1",
      setCode: "GD05",
      collectorNumber: "GD05-085_p1",
      cardNumber: "GD05-085",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-085_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-085_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-085", "GD05-085_p1"],
  selectedPrintingId: "GD05-085",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-085.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-085.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\nDuring your turn, when this Unit destroys an enemy Unit with battle damage, this Unit recovers 2 HP.",
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
        timing: ["onDestroyByBattle"],
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
          {
            type: "eventCardIsSelf",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "During your turn, when this Unit destroys an enemy Unit with battle damage, this Unit recovers 2 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
