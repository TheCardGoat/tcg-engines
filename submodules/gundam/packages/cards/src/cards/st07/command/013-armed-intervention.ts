import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st07ArmedIntervention013: CommandCard = {
  cardNumber: "ST07-013",
  name: "Armed Intervention",
  type: "command",
  color: "purple",
  traits: [],
  id: "ST07-013",
  externalId: "gundam:st07-013",
  slug: "armed-intervention-st07-013",
  displayName: "Armed Intervention",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-013",
  printings: [
    {
      id: "ST07-013",
      collectorNumber: "ST07-013",
      cardNumber: "ST07-013",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-013.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-013.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-013_p1",
      collectorNumber: "ST07-013_p1",
      cardNumber: "ST07-013",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-013_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-013_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST07-013",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-013.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-013.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  effect:
    "【Burst】Draw 1.\n【Action】Choose 1 rested friendly (CB) Unit. Change the attack target of the battling enemy Unit to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Burst】Draw 1.",
    },
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "changeAttackTarget",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "rested",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "cb",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 rested friendly (CB) Unit. Change the attack target of the battling enemy Unit to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
