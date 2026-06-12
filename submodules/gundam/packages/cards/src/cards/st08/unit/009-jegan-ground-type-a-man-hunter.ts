import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st08JeganGroundTypeAManHunter009: UnitCard = {
  cardNumber: "ST08-009",
  name: "Jegan Ground Type-A (Man Hunter)",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "ST08-009",
  externalId: "gundam:st08-009",
  slug: "jegan-ground-type-a-man-hunter-st08-009",
  displayName: "Jegan Ground Type-A (Man Hunter)",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-009",
  printings: [
    {
      id: "ST08-009",
      collectorNumber: "ST08-009",
      cardNumber: "ST08-009",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-009.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-009_p1",
      collectorNumber: "ST08-009_p1",
      cardNumber: "ST08-009",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-009_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-009_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST08-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-009.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  ap: 0,
  hp: 1,
  effect:
    "【Deploy】Choose 1 rested enemy Unit that is Lv.2 or lower. It won' t be set as active during the start phase of your opponent' s next turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "preventActive",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              state: "rested",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 rested enemy Unit that is Lv.2 or lower. It won' t be set as active during the start phase of your opponent' s next turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
