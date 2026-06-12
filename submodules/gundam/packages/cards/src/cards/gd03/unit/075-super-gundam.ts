import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03SuperGundam075: UnitCard = {
  cardNumber: "GD03-075",
  name: "Super Gundam",
  type: "unit",
  color: "white",
  traits: ["aeug"],
  id: "GD03-075",
  externalId: "gundam:gd03-075",
  slug: "super-gundam-gd03-075",
  displayName: "Super Gundam",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-075",
  printings: [
    {
      id: "GD03-075",
      collectorNumber: "GD03-075",
      cardNumber: "GD03-075",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-075.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-075.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-075",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-075.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-075.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "(AEUG) Trait",
  effect:
    "【During Link】【Attack】Choose 1 enemy Unit with no paired Pilot. It gets AP-2 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "paired",
                  comparison: "eq",
                  value: false,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Attack】Choose 1 enemy Unit with no paired Pilot. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
