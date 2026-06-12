import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamVirtue052: UnitCard = {
  cardNumber: "GD03-052",
  name: "Gundam Virtue",
  type: "unit",
  color: "purple",
  traits: ["cb", "gn drive"],
  id: "GD03-052",
  externalId: "gundam:gd03-052",
  slug: "gundam-virtue-gd03-052",
  displayName: "Gundam Virtue",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-052",
  printings: [
    {
      id: "GD03-052",
      collectorNumber: "GD03-052",
      cardNumber: "GD03-052",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-052.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-052.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-052_p1",
      collectorNumber: "GD03-052_p1",
      cardNumber: "GD03-052",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-052_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-052_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-052",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-052.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-052.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 3,
  hp: 3,
  linkCondition: "[Tieria Erde]",
  effect:
    "【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)\nWhen this Unit deals battle damage to an enemy Unit that is Lv.5 or lower, if you have a (CB) Pilot in play, destroy that enemy Unit.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onBattleDamageDealtToUnit"],
        conditions: [
          { type: "eventSourceIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
          },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "pilot",
            comparison: "gte",
            count: 1,
            hasTrait: "cb",
          },
        ],
      },
      directives: [{ action: { action: "destroyEventCard" } }],
      sourceText:
        "When this Unit deals battle damage to an enemy Unit that is Lv.5 or lower, if you have a (CB) Pilot in play, destroy that enemy Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Support", value: 2 }],
  rarity: "rare",
};
