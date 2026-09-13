import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05AWindAgainstFires119: CommandCard = {
  cardNumber: "GD05-119",
  name: "A Wind Against Fires",
  type: "command",
  color: "white",
  traits: ["preventer"],
  id: "GD05-119",
  canonicalId: "GD05-119",
  externalIds: { bandai: "gundam:gd05-119" },
  slug: "a-wind-against-fires-gd05-119",
  displayName: "A Wind Against Fires",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-119",
  printings: [
    {
      id: "GD05-119",
      artId: "GD05-119",
      setCode: "GD05",
      collectorNumber: "GD05-119",
      cardNumber: "GD05-119",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-119.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-119.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-119_p1",
      artId: "GD05-119_p1",
      setCode: "GD05",
      collectorNumber: "GD05-119_p1",
      cardNumber: "GD05-119",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-119_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-119_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-119", "GD05-119_p1"],
  selectedPrintingId: "GD05-119",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-119.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-119.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 5,
  cost: 1,
  pilotName: "Zechs Merquise",
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Action】Choose 1 enemy Unit that is battling one of your Units that is Lv.5 or higher. It gets AP-3 during this battle.\n【Pilot】[Zechs Merquise]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -3,
            duration: "thisBattle",
            target: {
              owner: "opponent",
              cardType: "unit",
              isBattling: {
                opponentMatches: {
                  owner: "friendly",
                  cardType: "unit",
                  attributeFilters: [
                    {
                      attribute: "level",
                      comparison: "gte",
                      value: 5,
                    },
                  ],
                },
              },
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 enemy Unit that is battling one of your Units that is Lv.5 or higher. It gets AP-3 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
