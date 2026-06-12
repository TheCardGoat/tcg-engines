import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03DistantReunion115: CommandCard = {
  cardNumber: "GD03-115",
  name: "Distant Reunion",
  type: "command",
  color: "purple",
  traits: ["civilian", "vagan", "x-rounder"],
  id: "GD03-115",
  externalId: "gundam:gd03-115",
  slug: "distant-reunion-gd03-115",
  displayName: "Distant Reunion",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-115",
  printings: [
    {
      id: "GD03-115",
      collectorNumber: "GD03-115",
      cardNumber: "GD03-115",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-115.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-115.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-115",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-115.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-115.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Yurin L'Ciel",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Action】Choose 1 friendly Unit paired with an (X-Rounder) Pilot. It can't receive battle damage from enemy Units with 2 or less AP during this battle. If you are Lv.7 or higher, it can't receive battle damage from enemy Units with 5 or less AP instead.\n【Pilot】[Yurin L'Ciel]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            damageType: "battle",
            duration: "thisBattle",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                { attribute: "pairedPilotTrait", comparison: "includes", value: "x-rounder" },
              ],
            },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 2 }],
            },
          },
        },
        {
          condition: { type: "playerLevel", comparison: "gte", value: 7 },
          thenDirectives: [
            {
              action: {
                action: "preventDamage",
                damageType: "battle",
                duration: "thisBattle",
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  count: 1,
                  attributeFilters: [
                    {
                      attribute: "pairedPilotTrait",
                      comparison: "includes",
                      value: "x-rounder",
                    },
                  ],
                },
                unitFilter: {
                  owner: "opponent",
                  cardType: "unit",
                  attributeFilters: [{ attribute: "ap", comparison: "lte", value: 5 }],
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Action】Choose 1 friendly Unit paired with an (X-Rounder) Pilot. It can't receive battle damage from enemy Units with 2 or less AP during this battle. If you are Lv.7 or higher, it can't receive battle damage from enemy Units with 5 or less AP instead. 【Pilot】[Yurin L'Ciel]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
