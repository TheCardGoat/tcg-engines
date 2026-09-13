import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05NuGundam020: UnitCard = {
  cardNumber: "GD05-020",
  name: "Nu Gundam",
  type: "unit",
  color: "green",
  traits: ["earth federation", "londo bell"],
  id: "GD05-020",
  canonicalId: "GD05-020",
  externalIds: { bandai: "gundam:gd05-020" },
  slug: "nu-gundam-gd05-020",
  displayName: "Nu Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-020",
  printings: [
    {
      id: "GD05-020",
      artId: "GD05-020",
      setCode: "GD05",
      collectorNumber: "GD05-020",
      cardNumber: "GD05-020",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-020.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-020.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-020_p1",
      artId: "GD05-020_p1",
      setCode: "GD05",
      collectorNumber: "GD05-020_p1",
      cardNumber: "GD05-020",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-020_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-020_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-020", "GD05-020_p1"],
  selectedPrintingId: "GD05-020",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-020.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-020.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Amuro Ray]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【During Pair】This Unit gains <Breach 3>.\n\n(During your turn, when this Unit destroys an enemy Unit with battle damage, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Deploy】If there are 2 or more (Londo Bell) cards in your trash, place 1 EX Resource.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "duringPair",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Pair】This Unit gains <Breach 3>. (During your turn, when this Unit destroys an enemy Unit with battle damage, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 2,
            hasTrait: "londo bell",
          },
          thenDirectives: [
            {
              action: {
                action: "placeExResource",
                state: "active",
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】If there are 2 or more (Londo Bell) cards in your trash, place 1 EX Resource.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
