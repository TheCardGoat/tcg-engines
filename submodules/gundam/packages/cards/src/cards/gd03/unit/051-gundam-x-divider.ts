import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamXDivider051: UnitCard = {
  cardNumber: "GD03-051",
  name: "Gundam X Divider",
  type: "unit",
  color: "purple",
  traits: ["vulture"],
  id: "GD03-051",
  externalId: "gundam:gd03-051",
  slug: "gundam-x-divider-gd03-051",
  displayName: "Gundam X Divider",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-051",
  printings: [
    {
      id: "GD03-051",
      collectorNumber: "GD03-051",
      cardNumber: "GD03-051",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-051.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-051.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-051",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-051.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-051.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Garrod Ran] / [Jamil Neate]",
  effect:
    "【When Linked】You may choose 1 Unit card that is Lv.4 or lower from your trash. Pay its cost to deploy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "deployFromTrash",
            levelAtMost: 4,
            payCost: true,
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
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
        "【When Linked】You may choose 1 Unit card that is Lv.4 or lower from your trash. Pay its cost to deploy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
