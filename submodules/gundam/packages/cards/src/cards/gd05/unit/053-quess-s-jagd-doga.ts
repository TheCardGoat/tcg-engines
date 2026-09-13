import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05QuessSJagdDoga053: UnitCard = {
  cardNumber: "GD05-053",
  name: "Quess's Jagd Doga",
  type: "unit",
  color: "purple",
  traits: ["neo zeon"],
  id: "GD05-053",
  canonicalId: "GD05-053",
  externalIds: { bandai: "gundam:gd05-053" },
  slug: "quess-s-jagd-doga-gd05-053",
  displayName: "Quess's Jagd Doga",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-053",
  printings: [
    {
      id: "GD05-053",
      artId: "GD05-053",
      setCode: "GD05",
      collectorNumber: "GD05-053",
      cardNumber: "GD05-053",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-053.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-053.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-053_p1",
      artId: "GD05-053_p1",
      setCode: "GD05",
      collectorNumber: "GD05-053_p1",
      cardNumber: "GD05-053",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-053_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-053_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-053", "GD05-053_p1"],
  selectedPrintingId: "GD05-053",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-053.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-053.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  linkCondition: "[Quess Paraya]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Destroyed】If this Unit is destroyed by one of your (Neo Zeon) card's effects, add it from your trash to your hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [
          {
            type: "eventSourceMatches",
            target: {
              owner: "friendly",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "neo zeon",
                },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "self",
              zone: "trash",
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】If this Unit is destroyed by one of your (Neo Zeon) card's effects, add it from your trash to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
