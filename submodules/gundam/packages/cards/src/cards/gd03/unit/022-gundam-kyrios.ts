import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamKyrios022: UnitCard = {
  cardNumber: "GD03-022",
  name: "Gundam Kyrios",
  type: "unit",
  color: "green",
  traits: ["cb", "gn drive"],
  id: "GD03-022",
  externalId: "gundam:gd03-022",
  slug: "gundam-kyrios-gd03-022",
  displayName: "Gundam Kyrios",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-022",
  printings: [
    {
      id: "GD03-022",
      collectorNumber: "GD03-022",
      cardNumber: "GD03-022",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-022.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-022.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-022_p1",
      collectorNumber: "GD03-022_p1",
      cardNumber: "GD03-022",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-022_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-022_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-022",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-022.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-022.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 5,
  hp: 3,
  linkCondition: "[Allelujah Haptism] / [Hallelujah Haptism]",
  effect:
    "【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, deal 1 damage to all enemy Units that are Lv.3 or lower.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle"],
        conditions: [{ type: "duringLink" }, { type: "isTurn", whose: "friendly" }],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, deal 1 damage to all enemy Units that are Lv.3 or lower.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
