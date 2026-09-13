import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05WidespreadAnnihilation114: CommandCard = {
  cardNumber: "GD05-114",
  name: "Widespread Annihilation",
  type: "command",
  color: "purple",
  traits: [],
  id: "GD05-114",
  canonicalId: "GD05-114",
  externalIds: { bandai: "gundam:gd05-114" },
  slug: "widespread-annihilation-gd05-114",
  displayName: "Widespread Annihilation",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-114",
  printings: [
    {
      id: "GD05-114",
      artId: "GD05-114",
      setCode: "GD05",
      collectorNumber: "GD05-114",
      cardNumber: "GD05-114",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-114.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-114.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-114_p1",
      artId: "GD05-114_p1",
      setCode: "GD05",
      collectorNumber: "GD05-114_p1",
      cardNumber: "GD05-114",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-114_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-114_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-114", "GD05-114_p1"],
  selectedPrintingId: "GD05-114",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-114.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-114.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 6,
  cost: 6,
  effect: "【Main】Destroy all Units that are Lv.4 or lower.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "any",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        },
      ],
      sourceText: "【Main】Destroy all Units that are Lv.4 or lower.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
