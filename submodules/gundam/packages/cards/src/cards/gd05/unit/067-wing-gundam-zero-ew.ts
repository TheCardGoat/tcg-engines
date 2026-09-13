import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05WingGundamZeroEw067: UnitCard = {
  cardNumber: "GD05-067",
  name: "Wing Gundam Zero (EW)",
  type: "unit",
  color: "white",
  traits: ["g team"],
  id: "GD05-067",
  canonicalId: "GD05-067",
  externalIds: { bandai: "gundam:gd05-067" },
  slug: "wing-gundam-zero-ew-gd05-067",
  displayName: "Wing Gundam Zero (EW)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-067",
  printings: [
    {
      id: "GD05-067",
      artId: "GD05-067",
      setCode: "GD05",
      collectorNumber: "GD05-067",
      cardNumber: "GD05-067",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-067.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-067.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-067_p1",
      artId: "GD05-067_p1",
      setCode: "GD05",
      collectorNumber: "GD05-067_p1",
      cardNumber: "GD05-067",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-067_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-067_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-067_p2",
      artId: "GD05-067_p2",
      setCode: "GD05",
      collectorNumber: "GD05-067_p2",
      cardNumber: "GD05-067",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-067_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-067_p2.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-067", "GD05-067_p1", "GD05-067_p2"],
  selectedPrintingId: "GD05-067",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-067.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-067.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Heero Yuy]",
  battlefieldZones: ["space", "earth"],
  effect:
    "While a rested enemy Unit is in play, this Unit gains <Suppression>.\n\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【Attack】Choose 1 enemy Unit. Rest it.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "opponent",
            comparison: "gte",
            count: 1,
            state: "rested",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Suppression",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While a rested enemy Unit is in play, this Unit gains <Suppression>. (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Attack】Choose 1 enemy Unit. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
