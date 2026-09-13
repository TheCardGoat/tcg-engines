import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GaiaGundamMaMode041: UnitCard = {
  cardNumber: "GD05-041",
  name: "Gaia Gundam (MA Mode)",
  type: "unit",
  color: "red",
  traits: ["earth alliance", "phantom pain"],
  id: "GD05-041",
  canonicalId: "GD05-041",
  externalIds: { bandai: "gundam:gd05-041" },
  slug: "gaia-gundam-ma-mode-gd05-041",
  displayName: "Gaia Gundam (MA Mode)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-041",
  printings: [
    {
      id: "GD05-041",
      artId: "GD05-041",
      setCode: "GD05",
      collectorNumber: "GD05-041",
      cardNumber: "GD05-041",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-041.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-041.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-041_p1",
      artId: "GD05-041_p1",
      setCode: "GD05",
      collectorNumber: "GD05-041_p1",
      cardNumber: "GD05-041",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-041_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-041_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-041", "GD05-041_p1"],
  selectedPrintingId: "GD05-041",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-041.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-041.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Stellar Loussier]",
  battlefieldZones: ["space", "earth"],
  effect:
    "During a turn where your opponent has discarded due to one of your effects, this card in your hand gets cost -2.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "opponentDiscardedByYourEffectThisTurn" }],
      },
      directives: [
        {
          action: {
            action: "costReduction",
            amount: 2,
            target: {
              owner: "self",
              zone: "hand",
            },
          },
        },
      ],
      sourceText:
        "During a turn where your opponent has discarded due to one of your effects, this card in your hand gets cost -2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
