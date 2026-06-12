import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamGusionRebakeFullCity053: UnitCard = {
  cardNumber: "GD03-053",
  name: "Gundam Gusion Rebake Full City",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "GD03-053",
  externalId: "gundam:gd03-053",
  slug: "gundam-gusion-rebake-full-city-gd03-053",
  displayName: "Gundam Gusion Rebake Full City",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-053",
  printings: [
    {
      id: "GD03-053",
      collectorNumber: "GD03-053",
      cardNumber: "GD03-053",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-053.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-053.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-053_p1",
      collectorNumber: "GD03-053_p1",
      cardNumber: "GD03-053",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-053_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-053_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-053",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-053.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-053.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Akihiro Altland]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【During Pair】【Once per Turn】During your turn, when one of your (Tekkadan)/(Teiwaz) Units receives effect damage, choose 1 enemy Unit that is Lv.4 or lower. Rest it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onEffectDamageReceived"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [
          { type: "duringPair" },
          { type: "isTurn", whose: "friendly" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "trait", comparison: "includes", value: "tekkadan" },
                    { attribute: "trait", comparison: "includes", value: "teiwaz" },
                  ],
                },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "rest",
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
      sourceText:
        "【During Pair】【Once per Turn】During your turn, when one of your (Tekkadan)/(Teiwaz) Units receives effect damage, choose 1 enemy Unit that is Lv.4 or lower. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "rare",
};
