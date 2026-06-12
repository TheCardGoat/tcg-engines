import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03FieldDirective103: CommandCard = {
  cardNumber: "GD03-103",
  name: "Field Directive",
  type: "command",
  color: "blue",
  traits: [],
  id: "GD03-103",
  externalId: "gundam:gd03-103",
  slug: "field-directive-gd03-103",
  displayName: "Field Directive",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-103",
  printings: [
    {
      id: "GD03-103",
      collectorNumber: "GD03-103",
      cardNumber: "GD03-103",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-103.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-103.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-103",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-103.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-103.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  effect:
    "【Burst】Choose 1 enemy Unit with 2 or less HP. Rest it.\n【Main】If 3 or more enemy Units are in play, choose 1 rested enemy Unit. Deal 2 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 enemy Unit with 2 or less HP. Rest it.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "opponent",
            comparison: "gte",
            count: 3,
          },
          thenDirectives: [
            {
              action: {
                action: "dealDamage",
                amount: 2,
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  state: "rested",
                  count: 1,
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Main】If 3 or more enemy Units are in play, choose 1 rested enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
