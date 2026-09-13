import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05DragonGundam035: UnitCard = {
  cardNumber: "GD05-035",
  name: "Dragon Gundam",
  type: "unit",
  color: "red",
  traits: ["mf", "shuffle alliance"],
  id: "GD05-035",
  canonicalId: "GD05-035",
  externalIds: { bandai: "gundam:gd05-035" },
  slug: "dragon-gundam-gd05-035",
  displayName: "Dragon Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-035",
  printings: [
    {
      id: "GD05-035",
      artId: "GD05-035",
      setCode: "GD05",
      collectorNumber: "GD05-035",
      cardNumber: "GD05-035",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-035.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-035.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-035_p1",
      artId: "GD05-035_p1",
      setCode: "GD05",
      collectorNumber: "GD05-035_p1",
      cardNumber: "GD05-035",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-035_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-035_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-035", "GD05-035_p1"],
  selectedPrintingId: "GD05-035",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-035.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-035.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  linkCondition: "[Sai Saici]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Once per Turn】When this Unit destroys an enemy shield area card with damage, choose 1 enemy Unit with 3 or less AP. Deal 2 damage to it.\n【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onShieldAreaCardDestroyByBattle"],
        conditions: [
          {
            type: "eventCardIsSelf",
          },
        ],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】When this Unit destroys an enemy shield area card with damage, choose 1 enemy Unit with 3 or less AP. Deal 2 damage to it.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "duringLink",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "activatePairedCardTiming",
            timing: "main",
          },
        },
      ],
      sourceText: "【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
