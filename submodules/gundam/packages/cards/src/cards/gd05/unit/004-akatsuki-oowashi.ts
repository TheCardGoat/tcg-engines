import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05AkatsukiOowashi004: UnitCard = {
  cardNumber: "GD05-004",
  name: "Akatsuki (Oowashi)",
  type: "unit",
  color: "blue",
  traits: ["orb"],
  id: "GD05-004",
  canonicalId: "GD05-004",
  externalIds: { bandai: "gundam:gd05-004" },
  slug: "akatsuki-oowashi-gd05-004",
  displayName: "Akatsuki (Oowashi)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-004",
  printings: [
    {
      id: "GD05-004",
      artId: "GD05-004",
      setCode: "GD05",
      collectorNumber: "GD05-004",
      cardNumber: "GD05-004",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-004.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-004.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-004_p1",
      artId: "GD05-004_p1",
      setCode: "GD05",
      collectorNumber: "GD05-004_p1",
      cardNumber: "GD05-004",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-004_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-004_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-004", "GD05-004_p1"],
  selectedPrintingId: "GD05-004",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-004.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-004.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 6,
  cost: 6,
  ap: 4,
  hp: 4,
  linkCondition: "(Orb) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "While you have no Units that are Lv.6 or higher in play, this card in your hand gets Lv. -1 and cost -1 for each of your (Orb) Units in play.\n【When Linked】Choose 1 enemy Unit that is Lv.4 or lower. Return it to its owner's hand.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "unit",
            comparison: "eq",
            count: 0,
            attributeFilters: [
              {
                attribute: "level",
                comparison: "gte",
                value: 6,
              },
            ],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "levelReductionByCount",
            amountPerMatch: 1,
            countFilter: {
              owner: "friendly",
              zone: "battleArea",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "orb",
                },
              ],
            },
            target: {
              owner: "self",
              zone: "hand",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "costReductionByCount",
            amountPerMatch: 1,
            countFilter: {
              owner: "friendly",
              zone: "battleArea",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "orb",
                },
              ],
            },
            target: {
              owner: "self",
              zone: "hand",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While you have no Units that are Lv.6 or higher in play, this card in your hand gets Lv. -1 and cost -1 for each of your (Orb) Units in play.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 enemy Unit that is Lv.4 or lower. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
