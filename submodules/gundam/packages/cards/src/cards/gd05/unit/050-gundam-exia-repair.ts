import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamExiaRepair050: UnitCard = {
  cardNumber: "GD05-050",
  name: "Gundam Exia Repair",
  type: "unit",
  color: "purple",
  traits: ["cb", "gn drive"],
  id: "GD05-050",
  canonicalId: "GD05-050",
  externalIds: { bandai: "gundam:gd05-050" },
  slug: "gundam-exia-repair-gd05-050",
  displayName: "Gundam Exia Repair",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-050",
  printings: [
    {
      id: "GD05-050",
      artId: "GD05-050",
      setCode: "GD05",
      collectorNumber: "GD05-050",
      cardNumber: "GD05-050",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-050.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-050.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-050_p1",
      artId: "GD05-050_p1",
      setCode: "GD05",
      collectorNumber: "GD05-050_p1",
      cardNumber: "GD05-050",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-050_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-050_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-050", "GD05-050_p1"],
  selectedPrintingId: "GD05-050",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-050.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-050.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam 00",
  level: 2,
  cost: 1,
  ap: 2,
  hp: 1,
  linkCondition: "[Setsuna F. Seiei]",
  battlefieldZones: ["space", "earth"],
  effect:
    "When this Unit deals battle damage to an enemy Unit that is Lv.4 or lower that has no paired Pilot, destroy that enemy Unit.\n【Destroyed】Place the top 2 cards of your deck into your trash.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onBattleDamageDealtToUnit"],
        conditions: [
          {
            type: "eventSourceIsSelf",
          },
          {
            type: "eventCardMatches",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
                {
                  attribute: "paired",
                  comparison: "eq",
                  value: false,
                },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "destroyEventCard",
          },
        },
      ],
      sourceText:
        "When this Unit deals battle damage to an enemy Unit that is Lv.4 or lower that has no paired Pilot, destroy that enemy Unit.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "millDeck",
            count: 2,
            owner: "self",
          },
        },
      ],
      sourceText: "【Destroyed】Place the top 2 cards of your deck into your trash.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
