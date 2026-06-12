import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03KMpfer017: UnitCard = {
  cardNumber: "GD03-017",
  name: "Kämpfer",
  type: "unit",
  color: "green",
  traits: ["zeon", "cyclops team"],
  id: "GD03-017",
  externalId: "gundam:gd03-017",
  slug: "k-mpfer-gd03-017",
  displayName: "Kämpfer",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-017",
  printings: [
    {
      id: "GD03-017",
      collectorNumber: "GD03-017",
      cardNumber: "GD03-017",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-017.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-017.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-017_p1",
      collectorNumber: "GD03-017_p1",
      cardNumber: "GD03-017",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-017_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-017_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-017_p2",
      collectorNumber: "GD03-017_p2",
      cardNumber: "GD03-017",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-017_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-017_p2.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-017",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-017.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-017.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Mikhail Kaminsky]",
  effect:
    "【Burst】Choose 1 (Cyclops Team) Pilot card from your trash. Add it to your hand.\n【When Paired･(Cyclops Team) Pilot】All your (Cyclops Team) Units may choose an active enemy Unit with 5 or less AP as their attack target during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "pilot",
              zone: "trash",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "cyclops team" },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Burst】Choose 1 (Cyclops Team) Pilot card from your trash. Add it to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "cyclops team",
        },
        conditions: [{ type: "eventCardIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "cyclops team" },
              ],
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 5 }],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【When Paired･(Cyclops Team) Pilot】All your (Cyclops Team) Units may choose an active enemy Unit with 5 or less AP as their attack target during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
