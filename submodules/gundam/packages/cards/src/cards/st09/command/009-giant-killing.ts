import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st09GiantKilling009: CommandCard = {
  cardNumber: "ST09-009",
  name: "Giant Killing",
  type: "command",
  color: "purple",
  traits: [],
  id: "ST09-009",
  externalId: "gundam:st09-009",
  slug: "giant-killing-st09-009",
  displayName: "Giant Killing",
  set: { code: "ST09", name: "Destiny Ignition [ST09]", packageId: "616009" },
  printNumber: "ST09-009",
  printings: [
    {
      id: "ST09-009",
      collectorNumber: "ST09-009",
      cardNumber: "ST09-009",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-009.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
    {
      id: "ST09-009_p1",
      collectorNumber: "ST09-009_p1",
      cardNumber: "ST09-009",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-009_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-009_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "ST09-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st09/ST09-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST09-009.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  effect: "【Main】/【Action】Choose 1 active enemy Unit with 4 or less AP. Destroy it.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Main】/【Action】Choose 1 active enemy Unit with 4 or less AP. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
