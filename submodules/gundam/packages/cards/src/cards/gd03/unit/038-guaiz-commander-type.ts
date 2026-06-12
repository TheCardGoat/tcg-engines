import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GuaizCommanderType038: UnitCard = {
  cardNumber: "GD03-038",
  name: "GuAIZ (Commander Type)",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "GD03-038",
  externalId: "gundam:gd03-038",
  slug: "guaiz-commander-type-gd03-038",
  displayName: "GuAIZ (Commander Type)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-038",
  printings: [
    {
      id: "GD03-038",
      collectorNumber: "GD03-038",
      cardNumber: "GD03-038",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-038.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-038.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-038",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-038.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-038.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Rau Le Creuset]",
  effect:
    "【Activate･Main】<Support 1> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)\nDuring your turn, when this Unit is rested by an effect, choose 1 of your (ZAFT) Units. It gets AP+2 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onRestedByEffect"],
        conditions: [{ type: "isTurn", whose: "friendly" }, { type: "eventCardIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "zaft" }],
            },
          },
        },
      ],
      sourceText:
        "During your turn, when this Unit is rested by an effect, choose 1 of your (ZAFT) Units. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Support", value: 1 }],
  rarity: "rare",
};
