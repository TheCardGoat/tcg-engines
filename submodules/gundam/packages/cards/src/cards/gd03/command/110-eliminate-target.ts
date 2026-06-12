import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03EliminateTarget110: CommandCard = {
  cardNumber: "GD03-110",
  name: "Eliminate Target",
  type: "command",
  color: "red",
  traits: [],
  id: "GD03-110",
  externalId: "gundam:gd03-110",
  slug: "eliminate-target-gd03-110",
  displayName: "Eliminate Target",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-110",
  printings: [
    {
      id: "GD03-110",
      collectorNumber: "GD03-110",
      cardNumber: "GD03-110",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-110.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-110.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-110",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-110.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-110.webp?260424",
  legality: "legal",
  level: 6,
  cost: 1,
  effect:
    "【Main】/【Action】Choose 1 Pilot paired with an enemy Unit that is Lv.5 or lower. Destroy it.",
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
              cardType: "pilot",
              attributeFilters: [
                {
                  attribute: "pairedUnitLevel",
                  comparison: "lte",
                  value: 5,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 Pilot paired with an enemy Unit that is Lv.5 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
