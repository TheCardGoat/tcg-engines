import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamHeavyarmsCustomEw079: UnitCard = {
  cardNumber: "GD05-079",
  name: "Gundam Heavyarms Custom (EW)",
  type: "unit",
  color: "white",
  traits: ["g team"],
  id: "GD05-079",
  canonicalId: "GD05-079",
  externalIds: { bandai: "gundam:gd05-079" },
  slug: "gundam-heavyarms-custom-ew-gd05-079",
  displayName: "Gundam Heavyarms Custom (EW)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-079",
  printings: [
    {
      id: "GD05-079",
      artId: "GD05-079",
      setCode: "GD05",
      collectorNumber: "GD05-079",
      cardNumber: "GD05-079",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-079.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-079.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-079_p1",
      artId: "GD05-079_p1",
      setCode: "GD05",
      collectorNumber: "GD05-079_p1",
      cardNumber: "GD05-079",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-079_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-079_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-079", "GD05-079_p1"],
  selectedPrintingId: "GD05-079",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-079.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-079.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[Trowa Barton]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Activate･Main】【Once per Turn】If you have another (G Team)/(Preventer) Unit in play, choose 1 enemy Unit that is Lv.4 or lower. It gets AP-1 during this turn.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: ["g team", "preventer"],
          },
          thenDirectives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: -1,
                duration: "thisTurn",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  count: 1,
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
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】If you have another (G Team)/(Preventer) Unit in play, choose 1 enemy Unit that is Lv.4 or lower. It gets AP-1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
