import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05CalamityGundamRaiderGundam011: UnitCard = {
  cardNumber: "GD05-011",
  name: "Calamity Gundam & Raider Gundam",
  type: "unit",
  color: "blue",
  traits: ["earth alliance"],
  id: "GD05-011",
  canonicalId: "GD05-011",
  externalIds: { bandai: "gundam:gd05-011" },
  slug: "calamity-gundam-raider-gundam-gd05-011",
  displayName: "Calamity Gundam & Raider Gundam",
  rulesText:
    "【Deploy】You may choose 1 of your other active (Earth Alliance) Units. Rest it. If you do, choose 1 rested enemy Unit. Deal 2 damage to it.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-011",
  printings: [
    {
      id: "GD05-011",
      artId: "GD05-011",
      setCode: "GD05",
      collectorNumber: "GD05-011",
      cardNumber: "GD05-011",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-011.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-011",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-011.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "(Biological CPU) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】You may choose 1 of your other active (Earth Alliance) Units. Rest it. If you do, choose 1 rested enemy Unit. Deal 2 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              state: "active",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "earth alliance",
                },
              ],
              count: 1,
            },
          },
          optional: true,
        },
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】You may choose 1 of your other active (Earth Alliance) Units. Rest it. If you do, choose 1 rested enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
