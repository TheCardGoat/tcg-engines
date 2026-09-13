import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05Sazabi052: UnitCard = {
  cardNumber: "GD05-052",
  name: "Sazabi",
  type: "unit",
  color: "purple",
  traits: ["neo zeon"],
  id: "GD05-052",
  canonicalId: "GD05-052",
  externalIds: { bandai: "gundam:gd05-052" },
  slug: "sazabi-gd05-052",
  displayName: "Sazabi",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-052",
  printings: [
    {
      id: "GD05-052",
      artId: "GD05-052",
      setCode: "GD05",
      collectorNumber: "GD05-052",
      cardNumber: "GD05-052",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-052.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-052.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-052_p1",
      artId: "GD05-052_p1",
      setCode: "GD05",
      collectorNumber: "GD05-052_p1",
      cardNumber: "GD05-052",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-052_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-052_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-052", "GD05-052_p1"],
  selectedPrintingId: "GD05-052",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-052.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-052.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 5,
  cost: 4,
  ap: 5,
  hp: 4,
  linkCondition: "[Char Aznable]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】You may choose 1 of your other Units. Destroy it. If you do, place the top 3 cards of your deck into your trash. Add 1 (Neo Zeon) Unit card you placed from your deck with this effect to your hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              count: 1,
            },
          },
          optional: true,
        },
        {
          action: {
            action: "millDeckThenAddToHand",
            count: 3,
            target: {
              owner: "friendly",
              zone: "trash",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "neo zeon",
                },
              ],
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】You may choose 1 of your other Units. Destroy it. If you do, place the top 3 cards of your deck into your trash. Add 1 (Neo Zeon) Unit card you placed from your deck with this effect to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
