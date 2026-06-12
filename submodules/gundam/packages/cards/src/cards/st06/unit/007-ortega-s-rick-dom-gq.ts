import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st06OrtegaSRickDomGq007: UnitCard = {
  cardNumber: "ST06-007",
  name: "Ortega's Rick Dom (GQ)",
  type: "unit",
  color: "green",
  traits: ["clan"],
  id: "ST06-007",
  externalId: "gundam:st06-007",
  slug: "ortega-s-rick-dom-gq-st06-007",
  displayName: "Ortega's Rick Dom (GQ)",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-007",
  printings: [
    {
      id: "ST06-007",
      collectorNumber: "ST06-007",
      cardNumber: "ST06-007",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-007.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-007.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-007_p1",
      collectorNumber: "ST06-007_p1",
      cardNumber: "ST06-007",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-007_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-007_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST06-007",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-007.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-007.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "【Deploy】Choose 1 of your other (Clan) Units. During this turn, it may choose an active enemy Unit with 3 or less AP as its attack target.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              excludeSource: true,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your other (Clan) Units. During this turn, it may choose an active enemy Unit with 3 or less AP as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
