import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05KiraYamato081: PilotCard = {
  cardNumber: "GD05-081",
  name: "Kira Yamato",
  type: "pilot",
  color: "blue",
  traits: ["orb", "coordinator"],
  id: "GD05-081",
  canonicalId: "GD05-081",
  externalIds: { bandai: "gundam:gd05-081" },
  slug: "kira-yamato-gd05-081",
  displayName: "Kira Yamato",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-081",
  printings: [
    {
      id: "GD05-081",
      artId: "GD05-081",
      setCode: "GD05",
      collectorNumber: "GD05-081",
      cardNumber: "GD05-081",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-081.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-081.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-081_p1",
      artId: "GD05-081_p1",
      setCode: "GD05",
      collectorNumber: "GD05-081_p1",
      cardNumber: "GD05-081",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-081_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-081_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-081", "GD05-081_p1"],
  selectedPrintingId: "GD05-081",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-081.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-081.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】If this is an (Orb)/(Triple Ship Alliance) Unit, draw 1.",
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
        conditions: [
          {
            type: "linkedUnitHasTrait",
            trait: ["orb", "triple ship alliance"],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【When Linked】If this is an (Orb)/(Triple Ship Alliance) Unit, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
